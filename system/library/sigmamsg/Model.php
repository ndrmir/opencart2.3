<?php

class ModelSigmaSMS
{

    public function __construct()
    {
        $this->pdo = new PDO("mysql:host=" . DB_HOSTNAME . ";dbname=" . DB_DATABASE . "", DB_USERNAME, DB_PASSWORD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    }

    public function getUserDataByDb()
    {

        $stmt = $this->pdo->query("select * from sigmamsg_user where id=1");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    public function logout()
    {

        $stmt = $this->pdo->query("UPDATE `sigmamsg_user` SET `user_id` = '', `login` = '', `password`='', `token`='' WHERE `sigmamsg_user`.`id` = 1;");
        $stmt->execute();

        return true;
    }

    public function SelectMaxOrderSumm()
    {
        $sql = 'Select max(total) as total from 
                                    (SELECT sum(oc_order.total) as total
                                       FROM oc_customer
                                       LEFT JOIN oc_order 
                                       ON oc_customer.customer_id = oc_order.customer_id
                                       group by oc_customer.customer_id) as total';

        $max_order_sum = $this->pdo->prepare($sql);

        $max_order_sum->execute();

        $result = $max_order_sum->fetchAll(PDO::FETCH_ASSOC);

        return $result[0];

    }

    public function get_customers($status_id = null, $total_start = null, $total_end = null, $language_id, $manufacturer_id = null, $customer_group_id = null, $product_categories_id = null)
    {

        $sql = "SELECT oc_customer.firstname, oc_customer.lastname, oc_customer.email, oc_customer.telephone as phone, oc_customer_group_description.name as group_name, COALESCE(sum(oc_order.total), 0) as total FROM oc_customer LEFT JOIN oc_order ON oc_customer.customer_id = oc_order.customer_id LEFT JOIN oc_customer_group_description ON oc_customer.customer_group_id = oc_customer_group_description.customer_group_id  and oc_customer_group_description.language_id = " . $language_id .
            " LEFT JOIN oc_order_product ON oc_order_product.order_id = oc_order.order_id LEFT JOIN oc_product ON oc_product.product_id = oc_order_product.product_id LEFT JOIN oc_product_to_category ON oc_product.product_id = oc_product_to_category.product_id ";

        if ($customer_group_id != null || $product_categories_id != null || $status_id != null || $manufacturer_id != null) {

            $sql = $sql . " WHERE ";

            $and = false;

            if ($customer_group_id != null) {
                $sql = $sql . " oc_customer.customer_group_id = " . $customer_group_id;
                $and = true;
            }

            if ($product_categories_id != null) {

                if ($and) {
                    $sql = $sql . " and";
                }

                $sql = $sql . " oc_product_to_category.category_id = " . $product_categories_id;
                $and = true;
            }

            if ($status_id != null) {

                if ($and) {
                    $sql = $sql . " and";
                }

                $sql = $sql . " oc_order.order_status_id = " . $status_id;
                $and = true;
            }

            if ($manufacturer_id != null) {

                if ($and) {
                    $sql = $sql . " and";
                }

                $sql = $sql . " oc_product.manufacturer_id = " . $manufacturer_id;
            }
        }


        $sql = $sql . " group by oc_customer.customer_id";

        if ($total_start != null) {
            $sql = $sql . " Having total >= " . $total_start;
            if ($total_end != null) {
                $sql = $sql . " and total <= " . $total_end;
            }
        } else {
            if ($total_end != null) {
                $sql = $sql . " Having total <= " . $total_end;
            }
        }

        $customers = $this->pdo->prepare($sql);

        $customers->execute();

        $result = $customers->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function get_groups($language_id)
    {
        $sql = "SELECT distinct oc_customer_group.customer_group_id as id,
		                        oc_customer_group_description.name as name
                FROM oc_customer_group
                LEFT JOIN oc_customer_group_description
                ON oc_customer_group.customer_group_id = oc_customer_group_description.customer_group_id
                where oc_customer_group_description.language_id = " . $language_id;
        $sth = $this->pdo->prepare($sql);

        $sth->execute();
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function get_manufacturer()
    {
        $manufacturer_list = "SELECT manufacturer_id as id , name FROM oc_manufacturer;";

        $sth = $this->pdo->prepare($manufacturer_list);

        $sth->execute();
        $manufacturer_list = $sth->fetchAll(PDO::FETCH_ASSOC);

        return $manufacturer_list;

    }

    public function get_order_status_list($language_id)
    {

        $oc_order_status = "SELECT order_status_id as id, name FROM oc_order_status where language_id = :language_id ORDER BY `order_status_id`;";

        $sth = $this->pdo->prepare($oc_order_status);

        $sth->execute(['language_id' => $language_id]);
        $oc_order_status = $sth->fetchAll(PDO::FETCH_ASSOC);

        return $oc_order_status;
    }

    public function get_categories($language_id)
    {
        $categories = "SELECT category_id as id, name FROM oc_category_description where language_id = " . $language_id;
        $sth = $this->pdo->prepare($categories);

        $sth->execute();
        $categories = $sth->fetchAll(PDO::FETCH_ASSOC);

        return $categories;
    }

    public function change_sigma_event_data($order_status_id, $event_type, $customer_event_status, $customer_msg_body, $admin_event_status, $admin_msg_body, $additional_settings)
    {
        if ($additional_settings != 'null' && $additional_settings != null && $additional_settings != '') {
            $additional_settings = json_encode($additional_settings);
        } else {
            $additional_settings = 'null';
        }

        if (count($this->get_event_data($order_status_id, $event_type))) {
            $stmt = $this->pdo->prepare("UPDATE `sigmamsg_events`
                                        SET `customer_msg_status` = :customer_msg_status,
                                            `customer_msg_body` = :customer_msg_body,
                                            `admin_msg_status` = :admin_msg_status,
                                            `admin_msg_body` = :admin_msg_body,
                                            `additional_settings` = :additional_settings
                                      where `order_status_id` = :order_status_id and event_type = :event_type");

            $stmt->bindParam(':order_status_id', $order_status_id);
            $stmt->bindParam(':event_type', $event_type);
            $stmt->bindParam(':customer_msg_status', $customer_event_status);
            $customer_msg_body = json_encode($customer_msg_body);
            $stmt->bindParam(':customer_msg_body', $customer_msg_body);
            $stmt->bindParam(':admin_msg_status', $admin_event_status);
            $admin_msg_body = json_encode($admin_msg_body);
            $stmt->bindParam(':admin_msg_body', $admin_msg_body);
            $stmt->bindParam(':additional_settings', $additional_settings);

            $stmt->execute();

            return ['message' => 'Шаблон успешно обновлен', 'status' => true];
        } else {
            $stmt = $this->pdo->prepare("INSERT INTO  `sigmamsg_events` ( `event_id`,
                                                                                `order_status_id`,
                                                                                `event_type`,
                                                                                `customer_msg_status`,
                                                                                `customer_msg_body`,
                                                                                `admin_msg_status`,
                                                                                `admin_msg_body`,
                                                                                `additional_settings`)VALUE(
                                                                                :event_id,
                                                                                :order_status_id,
                                                                                :event_type,
                                                                                :customer_msg_status,
                                                                                :customer_msg_body,
                                                                                :admin_msg_status,
                                                                                :admin_msg_body,
                                                                                :additional_settings)");

            if ($event_type == "new_customer") {
                $action = 'sigmamsg/events/newCustomerHook';
            } else {
                $action = "sigmamsg/events/OrderHook";
            }

            $event_id = $this->get_oc_event_id_by_action($action);

            if ($event_id) {
                $stmt->execute([
                    'event_id' => $event_id,
                    'order_status_id' => $order_status_id,
                    'event_type' => $event_type,
                    "customer_msg_status" => $customer_event_status,
                    'customer_msg_body' => json_encode($customer_msg_body),
                    "admin_msg_status" => $admin_event_status,
                    'admin_msg_body' => json_encode($admin_msg_body),
                    'additional_settings' => $additional_settings
                ]);

                return ['message' => 'Шаблон успешно создан', 'status' => true];

            } else {

                return ['message' => 'Ошибка со стороны сервера', 'status' => false, 'error' => 'OC_EVENT not found'];
            }
        }

    }

    public function get_oc_event_id_by_action($action)
    {
        $event_id = $this->pdo->prepare("SELECT event_id
                                            FROM oc_event
                                            where action = :action and code = :code
                                            ");
        $event_id->execute(['action' => $action, 'code' => "sigmamsg"]);

        $event_id = $event_id->fetchAll(PDO::FETCH_ASSOC);

        if ($event_id && isset($event_id[0]) && isset($event_id[0]['event_id'])) {
            return $event_id[0]['event_id'];
        } else {
            return false;
        }

    }

    public function get_event_data($id, $event_type)
    {

        $event_data = $this->pdo->prepare("SELECT sigmamsg_events.order_status_id as order_status_id,
                                                    sigmamsg_events.event_type as event_type,
                                                    customer_msg_status, customer_msg_body,
                                                   admin_msg_status, admin_msg_body,
                                                   oc_order_status.name,
                                                   additional_settings
                                            FROM sigmamsg_events
                                            left join oc_order_status
                                            on sigmamsg_events.order_status_id = oc_order_status.order_status_id
                                            where sigmamsg_events.order_status_id = :id and sigmamsg_events.event_type = :event_type
                                            ");

        $event_data->execute(['id' => $id, 'event_type' => $event_type]);

        $event_data = $event_data->fetchAll(PDO::FETCH_ASSOC);

        return $event_data;

    }

    public function set_sigma_user($login, $password, $token, $id)
    {
        $stmt = $this->pdo->query("select * from sigmamsg_user");
        $results = $stmt->fetch(PDO::FETCH_BOTH);
        if ($results) {
            $this->update_user($login, $password, $token, $id);
            return $results;
        } else {
            $stmt = $this->pdo->prepare("INSERT INTO sigmamsg_user(login, password, token, user_id) VALUES (:login,:password,:token, :user_id)");
            $stmt->execute(['login' => $login, 'password' => $password, 'token' => $token, 'user_id' => $id]);
            return $results;
        }
    }

    public function update_user($login, $password, $token, $id)
    {

        $stmt = $this->pdo->prepare("UPDATE `sigmamsg_user`
                                        SET `login` = :login,
                                            `password` = :password,
                                            `token` = :token,
                                            `user_id` = :user_id
                                      where `id` = :id");

        $stmt->execute(['id' => 1, 'login' => $login, 'password' => $password, 'token' => $token, 'user_id' => $id]);
        return true;
    }

    public function get_order_by_id($id)
    {

        $event_data = $this->pdo->prepare("SELECT oc_order.order_id as order_id , telephone,
                                                       firstname,
                                                       lastname,
                                                       email,
                                                       shipping_city as city,
                                                       shipping_country as country, 
                                                       shipping_address_1 as address_1, 
                                                       shipping_address_2 as address_2, 
                                                       oc_order.total as total,
                                                       oc_order.currency_code,
                                                       oc_order.order_status_id,
                                                       oc_order.date_added,
                                                       oc_order.date_modified
                                                FROM oc_order
                                                where oc_order.order_id = :order_id");

        $event_data->execute(['order_id' => $id]);

        $event_data = $event_data->fetchAll(PDO::FETCH_ASSOC);

        return $event_data[0];
    }

    public function get_order_products_by_order_id($id)
    {
        $product_data = $this->pdo->prepare("SELECT oc_order_product.name as product,
                                                          oc_product.quantity,
                                                          oc_product.product_id
                                                    FROM oc_order_product
                                                    LEFT JOIN oc_product
                                                    ON oc_product.product_id = oc_order_product.product_id
                                                    where oc_order_product.order_id = :order_id");
        $product_data->execute(['order_id' => $id]);

        $product_data = $product_data->fetchAll(PDO::FETCH_ASSOC);

        return $product_data;
    }

    public function get_timeout_notification($product_id)
    {
        $timeout_notification = $this->pdo->prepare("SELECT createdAt FROM `sigmamsg_notific_timeout` where product_id = :product_id");
        $timeout_notification->execute(['product_id' => $product_id]);
        $timeout_notification = $timeout_notification->fetchAll(PDO::FETCH_ASSOC);
        if ($timeout_notification) {
            $timeout_notification = $timeout_notification[0];
        }
        return $timeout_notification;
    }

    public function add_timeout_notification($product_id)
    {
        $add_timeout_notification = $this->pdo->prepare("INSERT INTO `sigmamsg_notific_timeout` (`id`, `product_id`, `createdAt`) VALUES (NULL, :product_id, CURRENT_TIMESTAMP);");
        $add_timeout_notification->execute(['product_id' => $product_id]);
        return true;
    }

    public function delete_timeout_notification($product_id)
    {
        $delete_timeout_notification = $this->pdo->prepare("Delete FROM `sigmamsg_notific_timeout` where product_id = :product_id");
        $delete_timeout_notification->execute(['product_id' => $product_id]);
        return true;
    }

    public function get_zoneName_by_id($id)
    {
        $zone_name = $this->pdo->prepare("SELECT name FROM `oc_zone` where zone_id = :zone_id");

        $zone_name->execute(['zone_id' => $id]);

        $zone_name = $zone_name->fetchAll(PDO::FETCH_ASSOC);

        return $zone_name[0];
    }

}
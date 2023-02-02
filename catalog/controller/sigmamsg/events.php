<?php

require_once DIR_SYSTEM . '/library/sigmamsg/Controller.php';
require_once DIR_SYSTEM . '/library/sigmamsg/Model.php';


class ControllerSigmamsgEvents extends Controller
{

    public function newCustomerHook(&$route, &$data, &$customer_id)
    {
        $modelsigmamsg = new ModelSigmaSMS();
        $sigmamsg = new SigmaSMS();
        $data = $data[0];

        $oc_zone = $modelsigmamsg->get_zoneName_by_id($data['zone_id']);
        $event_data = $modelsigmamsg->get_event_data('null', 'new_customer');
        $data['zone'] = $oc_zone['name'];
        if (count($event_data)) {
            $event_data = $event_data[0];
            $this->create_sending($sigmamsg, $modelsigmamsg, $data, $event_data, false);
        } else {
            $this->log->write("Незарегистрированный эвент: Новый Пользователь");
        }
    }

    public function OrderHook(&$route, &$data, &$output)
    {
        $order_id = $data[0];
        $modelsigmamsg = new ModelSigmaSMS();
        $sigmamsg = new SigmaSMS();

        $order_data = $modelsigmamsg->get_order_by_id($order_id);

        $event_data = $modelsigmamsg->get_event_data($order_data["order_status_id"], 'change_order_status');

        $products_data = $modelsigmamsg->get_order_products_by_order_id($order_id);

        $this->check_out_of_product($products_data, $modelsigmamsg, $sigmamsg, $order_data);

        if (count($event_data)) {
            $event_data = $event_data[0];
            $this->create_sending($sigmamsg, $modelsigmamsg, $order_data, $event_data, $products_data);
        } else {
            $this->log->write("Незарегистрированный order_status_id: " . $order_data["order_status_id"]);
        }
    }

    public function check_out_of_product($products_data, $modelsigmamsg, $sigmamsg, $order_data)
    {
        $event_data = ($modelsigmamsg->get_event_data("null", 'out_of_product'));
        if (count($event_data)) {
            $event_data = $event_data[0];
            if (intval($event_data["admin_msg_status"]) == 1) {
                $event_data['additional_settings'] = json_decode($event_data['additional_settings'], true);
                foreach ($products_data as $product) {
                    if ($product['quantity'] <= $event_data['additional_settings']['count_product']) {
                        $product_id = $product['product_id'];
                        $notification_data = $modelsigmamsg->get_timeout_notification($product_id);

                        if (count($notification_data)) {
                            if ((time() - strtotime($notification_data['createdAt'])) <= 24 * 60 * 60 * $event_data['additional_settings']['notification_timeout']) {
                                $this->log->write("Таймаут все еще актуален");
                            } else {
                                $this->log->write("Таймаут уже устарел");
                                $modelsigmamsg->delete_timeout_notification($product_id);
                                $this->log->write($product_id);
                                $modelsigmamsg->add_timeout_notification($product_id);
                                $this->create_sending_out_of_product($sigmamsg, $modelsigmamsg, $event_data, $product);
                            }
                        } else {
                            $this->log->write("Добавляем таймаут");
                            $modelsigmamsg->add_timeout_notification($product_id);
                            $this->create_sending_out_of_product($sigmamsg, $modelsigmamsg, $event_data, $product);
                        }
                    }
                }
            }
        }
    }

    public function create_sending_out_of_product($sigmamsg, $modelsigmamsg, $event_data, $product_data)
    {

        $admin_sending_body = json_decode($event_data['admin_msg_body'], true);

        $text = $admin_sending_body['payload']['text'];

        $text = $this->replace_out_of_product_text_varibale($text, $product_data);
        $admin_sending_body['payload']['text'] = $text;

        $sending = $sigmamsg->create_massSendings($admin_sending_body);

        if ($sending['error'] == 401) {
            $this->log->write("Refresh sigma token");

            $user_data = $modelsigmamsg->getUserDataByDb();

            $sign_in = $sigmamsg->sign_in($user_data['login'], $user_data['password']);

            $sending = $sigmamsg->create_massSendings($admin_sending_body);

        }

    }

    public function create_sending($sigmamsg, $modelsigmamsg, $order_data, $event_data, $products_data)
    {
        $phone = $sigmamsg->clear_phone($order_data['telephone']);

        $sending_body = json_decode($event_data['customer_msg_body'], true);
        $admin_sending_body = json_decode($event_data['admin_msg_body'], true);


        if ($event_data["customer_msg_status"] == 1) {

            $sending_body['recipient']['include'] = [$phone];

            $text = $sending_body['payload']['text'];

            $text = $this->check_variable($text, $order_data, $products_data);

            $sending_body['payload']['text'] = $text;


            if (isset($sending_body['payload']['image'])) {
                $img_title = $sending_body['payload']['image'];
            } else {
                $img_title = false;
            }

            if (isset($sending_body['fallbacks']) && isset($sending_body['fallbacks'][0]['payload']['image'])) {
                $fallbacks_img_title = $sending_body['fallbacks'][0]['payload']['image'];
            } else {
                $fallbacks_img_title = false;
            }


            $sending_body = $this->check_and_refresh_image($sigmamsg, $modelsigmamsg, $img_title, $fallbacks_img_title, $event_data, $sending_body);

            if ($sending_body['fallbacks']) {
                $text_fallbacks = $sending_body['fallbacks'][0]['payload']['text'];

                $text_fallbacks = $this->check_variable($text_fallbacks, $order_data, $products_data);


                $sending_body['fallbacks'][0]['payload']['text'] = $text_fallbacks;
            }


            $sending = $sigmamsg->create_massSendings($sending_body);

            if ($sending['error'] == 401) {
                $this->log->write("Refresh sigma token");

                $user_data = $modelsigmamsg->getUserDataByDb();

                $sign_in = $sigmamsg->sign_in($user_data['login'], $user_data['password']);

                $sending = $sigmamsg->create_massSendings($sending_body);

            }
            $this->log->write($sending);

        }


        if ($event_data["admin_msg_status"] == 1) {

            $text = $admin_sending_body['payload']['text'];

            $text = $this->check_variable($text, $order_data, $products_data);

            $admin_sending_body['payload']['text'] = $text;

            $sending = $sigmamsg->create_massSendings($admin_sending_body);

            if ($sending['error'] == 401) {
                $this->log->write("Refresh sigma token");

                $user_data = $modelsigmamsg->getUserDataByDb();

                $sign_in = $sigmamsg->sign_in($user_data['login'], $user_data['password']);

                $sending = $sigmamsg->create_massSendings($admin_sending_body);

            }

            $this->log->write($sending);

        }
    }

    private function check_and_refresh_image($sigmamsg, $modelsigmamsg, $img_title, $fallbacks_img_title, $event_data, $sending_body)
    {
        $file_route = __DIR__ . "/../../../admin/view/image/sigmamsg/upload/" . $img_title . ".jpg";
        $fallback_file_route = __DIR__ . "/../../../admin/view/image/sigmamsg/upload/" . $fallbacks_img_title . ".jpg";

        if ($img_title != false) {
            if (file_exists($file_route)) {
                $checkImg = $sigmamsg->checkImg($img_title);
                if (isset($checkImg['error'])) {
                    $this->log->write("Refresh img file by route " . $file_route);
                    $size = filesize($file_route);
                    $uploaded_file = $sigmamsg->upload_file($file_route, "storage", $img_title, "image/jpg", $size);

                    if (!isset($uploaded_file['error'])) {
                        $title = $uploaded_file['title'];
                        rename($file_route, __DIR__ . "/../../../admin/view/image/sigmamsg/upload/" . $title . ".jpg");

                        $sending_body['payload']['image'] = $title;

                        $modelsigmamsg->change_sigma_event_data(
                            $event_data['order_status_id'],
                            $event_data['event_type'],
                            $event_data['customer_msg_status'],
                            $sending_body,
                            $event_data['admin_msg_status'],
                            $sending_body,
                            json_decode($event_data['additional_settings'], true)
                        );

                    }
                }

            } else {
                $this->log->write("Img file not found by route " . $file_route);
            }
        }

        if ($fallbacks_img_title != false) {
            if (file_exists($fallback_file_route)) {

                $checkImg = $sigmamsg->checkImg($fallbacks_img_title);
                if (isset($checkImg['error'])) {
                    $this->log->write("Refresh img file by route " . $fallback_file_route);
                    $size = filesize($fallback_file_route);
                    $uploaded_file = $sigmamsg->upload_file($fallback_file_route, "storage", $fallbacks_img_title, "image/jpg", $size);

                    if (!isset($uploaded_file['error'])) {
                        $title = $uploaded_file['title'];
                        rename($fallback_file_route, __DIR__ . "/../../../admin/view/image/sigmamsg/upload/" . $title . ".jpg");

                        $sending_body['fallbacks'][0]['payload']['image'] = $title;

                        $modelsigmamsg->change_sigma_event_data(
                            $event_data['order_status_id'],
                            $event_data['event_type'],
                            $event_data['customer_msg_status'],
                            $sending_body,
                            $event_data['admin_msg_status'],
                            $sending_body,
                            json_decode($event_data['additional_settings'], true)
                        );

                    }
                }

            } else {
                $this->log->write("Img file in fallbacks not found by route " . $fallback_file_route);
            }
        }

        return $sending_body;
    }


    private function replace_variable($data_array, $key, $text)
    {
        if (isset($data_array[$key])) {
            $value = $data_array[$key];
            $text = preg_replace('/\#{' . $key . '}/', $value, $text);
        }
        return $text;
    }

    private function replace_out_of_product_text_varibale($text, $product_data)
    {
        if (preg_match('/\#{product}/', $text, $matches)) {
            $text = preg_replace('/\#{product}/', $product_data['product'], $text);
        }

        if (preg_match('/\#{quantity}/', $text, $matches)) {
            $text = preg_replace('/\#{quantity}/', $product_data['quantity'], $text);
        }

        return $text;
    }

    private function check_variable($text, $data_array, $products_data)
    {

        if (preg_match('/\#{order_id}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "order_id", $text);
        }

        if (preg_match('/\#{firstname}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "firstname", $text);
        }

        if (preg_match('/\#{lastname}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "lastname", $text);
        }

        if (preg_match('/\#{email}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "email", $text);
        }

        if (preg_match('/\#{city}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "city", $text);
        }

        if (preg_match('/\#{country}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "country", $text);
        }

        if ($products_data) {
            if (preg_match('/\#{products}/', $text, $matches)) {
                $strProducts = '';
                foreach ($products_data as $key => $product) {
                    if ($key + 1 != count($products_data)) {
                        $strProducts = $strProducts . $product['product'] . ", ";
                    } else {
                        $strProducts = $strProducts . $product['product'];
                    }
                }
                $text = preg_replace('/\#{products}/', $strProducts, $text);
            }
        }


        if (preg_match('/\#{total}/', $text, $matches)) {
            $currency_code = $data_array['currency_code'];
            $total = round($data_array['total'], 2) . " " . $currency_code;
            $text = preg_replace('/\#{total}/', $total, $text);
        }

        if (preg_match('/\#{phone}/', $text, $matches)) {
            $phone = $data_array['telephone'];
            $text = preg_replace('/\#{phone}/', $phone, $text);
        }

        if (preg_match('/\#{date_added}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "date_added", $text);
        }

        if (preg_match('/\#{date_modified}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "date_modified", $text);
        }

        if (preg_match('/\#{address_1}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "address_1", $text);
        }

        if (preg_match('/\#{address_2}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "address_2", $text);
        }

        if (preg_match('/\#{zone}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "zone", $text);
        }

        if (preg_match('/\#{company}/', $text, $matches)) {
            $text = $this->replace_variable($data_array, "company", $text);
        }

        return $text;
    }

}

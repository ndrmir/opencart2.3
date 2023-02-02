<?php
require_once DIR_SYSTEM . '/library/sigmamsg/Model.php';


class SigmaSMS
{

    private $api_url = 'https://online.sigmasms.ru/api/';
    private $docs_url = 'https://online.sigmasms.ru/docs/';

    public function push_file_with_customer($cusomer_list)
    {
        $csv_ontent = "phone;email;name;lastname;\n";

        foreach ($cusomer_list as $customer) {

            $phone = $this->clear_phone($customer['phone']);

            if (strlen($phone) == 11) {
                $row = $phone . ";" . $customer['email'] . ";" . $customer['firstname'] . ";" . $customer['lastname'] . ";\n";
            }
            $csv_ontent = $csv_ontent . $row;
        }

        $file_path = __DIR__ . "/csv_files/" . "customers.csv";

        file_put_contents($file_path, $csv_ontent);

        return $this->upload_file($file_path, "storage", "customers.csv", "text/csv", filesize($file_path));
    }

    public function upload_file($file, $route, $file_name, $file_type, $size)
    {
        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();

        if ($result != false) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $this->api_url . $route);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: " . $file_type, "Content-length: " . $size, "Authorization: " . $result['token']));
            if (isset($file['tmp_name'])) {

                curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents($file['tmp_name']));
            } else {

                curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents($file));
            }

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            $response = curl_exec($ch);
            curl_close($ch);
            return json_decode($response, true);
        } else {
            return $result;
        }
    }

    public function sign_up($login, $firstName, $lastname, $email, $phone, $password)
    {

        $modelsigma = new ModelSigmaSMS();

        $data = ['username' => $login, 'password' => $password, 'data' => ['phone' => $phone, 'email' => $email, 'firstName' => $firstName, 'lastName' => $lastname]];
        $curl = curl_init($this->api_url . 'registration');
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($curl);
        curl_close($curl);
        $curl_jason = json_decode($response, true);

        if (!isset($curl_jason['error'])) {
            $this->sign_in($login, $password);
            return $curl_jason;
        } else {
            return $curl_jason;
        }

    }

    public function addSenderName($comment, $name, $type)
    {

        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();

        if ($result != false) {
            $data = ["comment" => $comment, "name" => $name, "type" => $type, "meta" => ['comment' => $comment]];
            return $this->postmethod($data, "sendernames", $result['token']);
        } else {
            return $result;
        }
    }

    public function add_fund($sum, $url)
    {

        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();
        $data = [
            'amount' => $sum,
            'method' => 'v1.tinkoff',
            'urlSuccess' => $url,
            'urlFail' => $url,
        ];

        return $this->postmethod($data, "payments", $result['token']);
    }

    public function add_bill($requisiteId, $companyId, $sum)
    {

        $modelsigma = new ModelSigmaSMS();

        $result = $modelsigma->getUserDataByDb();

        $data = [
            'requisiteId' => $requisiteId,
            'companyId' => $companyId,
            'type' => 'invoice',
            'data[SERVICE_PRICE]' => $sum,
        ];

        return $this->getSigmaData('documentTemplates/generate', $data);
    }

    public function addRequisites($data)
    {

        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();
        $data['OwnerId'] = $result['user_id'];
        $data['isActive'] = true;
        return $this->postmethod($data, "requisites/", $result['token']);
    }

    public function updateRequisites($data, $id)
    {

        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();

        $data['OwnerId'] = $result['user_id'];
        $data['isActive'] = true;

        $updateRequisites = $this->editEntity($id, $data, "requisites");
        return $updateRequisites;
    }

    public function get_payment_offer()
    {
        return $this->getSigmaDoc('ru/misc/tinkoff-payment-offer.md');
    }

    public function get_companies($vat)
    {
        $modelsigma = new ModelSigmaSMS();
        $user_data_by_db = $modelsigma->getUserDataByDb();

        $params = [
            'var' => $vat,
            '$offset' => '0',
            '$limit' => '25',
            '$order[0][0]' => 'createdAt',
            '$order[0][1]' => 'desc',
            '$scope[0]' => 'documentTypes',
        ];

        return $this->getSigmaData('companies', $params);
    }

    public function getRequisites()
    {
        $modelsigma = new ModelSigmaSMS();
        $user_data_by_db = $modelsigma->getUserDataByDb();

        $params = [
            'OwnerId' => $user_data_by_db['id'],
            '$offset' => '0',
            '$limit' => '25',
            '$order[0][0]' => 'createdAt',
            '$order[0][1]' => 'desc',
        ];

        return $this->getSigmaData('requisites', $params);
    }

    public function postmethod($data, $route, $token)
    {
        $data = json_encode($data, JSON_UNESCAPED_UNICODE);
        $ch = curl_init($this->api_url . $route);
        $headers = array("Content-Type:application/json; charset=utf-8", "Authorization:" . $token);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response);
    }

    public function add_by_storage($ListId, $file_id)
    {

        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();

        $data = [];
        $data['ListId'] = $ListId;
        $data['from'] = ['key' => $file_id];

        $data = json_encode($data, JSON_UNESCAPED_UNICODE);

        $curl = curl_init($this->api_url . 'contacts');
        $headers = array("Content-Type:application/json", "Authorization:" . $result['token']);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

        $response = curl_exec($curl);
        curl_close($curl);
        $curl_jason = json_decode($response, true);

        return $curl_jason;
    }

    public function create_massSendings($data)
    {
        $modelsigma = new ModelSigmaSMS();

        $result = $modelsigma->getUserDataByDb();

        if ($result != false) {
            $data = json_encode($data, JSON_UNESCAPED_UNICODE);
            $ch = curl_init($this->api_url . "sendings");
            $headers = array("Content-Type:application/json", "Authorization:" . $result['token']);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch);
            if (isset($response['error'])) {
                return false;
            } else {
                return json_decode($response, true);
            }
        } else {
            return $result;
        }
    }

    public function create_template($body)
    {
        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();
        $body['OwnerId'] = $result['user_id'];

        return $this->postmethod($body, "templates", $result['token']);
    }

    public function update_template($body)
    {
        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();
        $body['OwnerId'] = $result['user_id'];

        return $this->editEntity($body['id'], $body, 'templates');
    }

    public function add_entity($data, $route)
    {

        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();

        if ($result != false) {
            $data = json_encode($data, JSON_UNESCAPED_UNICODE);
            $ch = curl_init($this->api_url . $route);
            $headers = array("Content-Type:application/json", "Authorization:" . $result['token']);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch);
            if (isset($response['error'])) {
                return false;
            } else {
                return $response;
            }
        } else {
            return $result;
        }
    }

    public function editEntity($id, $data, $route)
    {

        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();

        if ($result != false) {

            $data = json_encode($data, JSON_UNESCAPED_UNICODE);

            $curl = curl_init($this->api_url . $route . '/' . $id);
            $headers = array("Content-Type:application/json", "Authorization:" . $result['token']);
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

            $response = curl_exec($curl);
            $response = json_decode($response, true);

            return $response;
        }

    }

    public function getSigmaData($route, $params = '')
    {
        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();

        if ($result != false) {
            if ($params == '') {
                $url = $this->api_url . $route;
                $ch = curl_init($url);
            } else {
                $ch = curl_init($this->api_url . $route . "?" . http_build_query($params));
            }

            $headers = array("Content-Type:application/json", "Authorization:" . $result['token']);

            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_HTTPGET, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            $response = json_decode($response, true);

            if (isset($response['error']) && $response['error'] == 401) {
                $this->sign_in($result['login'], $result['password']);
                $this->getSigmaData($route, $params);
            } else {
                return $response;
            }
        } else {
            return $result;
        }
    }

    public function getSigmaDoc($route )
    {
        $ch = curl_init($this->docs_url . $route);

        curl_setopt($ch, CURLOPT_HTTPGET, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);

        return $response;

    }

    public function checkImg($id)
    {

        $params = ['return' => 'meta'];

        $ch = curl_init($this->api_url . "storage/" . $id . "?" . http_build_query($params));

        $headers = array("Content-Type:application/json");

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_HTTPGET, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $response = json_decode($response, true);

        return $response;

    }

    public function get_balance()
    {

        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();

        if ($result != false) {
            $url = $this->api_url . "billings/balance/" . $result['user_id'];
            $ch = curl_init($url);

            $headers = array("Content-Type:application/json", "Authorization:" . $result['token']);

            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
            curl_setopt($ch, CURLOPT_HTTPGET, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            $response = json_decode($response, true);

            return $response;

        } else {

            return $result;
        }

    }

    public function deleteEntity($id, $route)
    {
        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();

        if ($result != false) {
            $url = $this->api_url . $route . '/' . $id;
            $ch = curl_init($url);

            $headers = array("Content-Type:application/json", "Authorization:" . $result['token']);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            $response = json_decode($response, true);

            return $response;
        }
    }

    public function getReports($created_lt, $created_gt)
    {
        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();

        if ($result != false) {

            $url = $this->api_url . "/reports";
            $params = ['createdAt[$lt]' => trim($created_lt), 'createdAt[$gt]' => trim($created_gt), '$preset' => 'billings.group001'];
            $params = http_build_query($params);
            $ch = curl_init($url . "?" . $params);
            $headers = array("Content-Type:application/json", "Authorization:" . $result['token']);

            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_HTTPGET, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            $response = json_decode($response, true);

            if (isset($response['error']) && $response['error'] == 401) {
                return false;
            } else {
                return $response;
            }

        } else {

            return $result;
        }
    }

    public function sign_in($login, $password)
    {
        $modelsigma = new ModelSigmaSMS();

        $data = ['username' => $login, 'password' => $password];
        $curl = curl_init($this->api_url . 'login');
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($curl);
        curl_close($curl);
        $curl_jason = json_decode($response, true);

        if (isset($curl_jason['token'])) {
          $modelsigma->set_sigma_user($login,$password, $curl_jason['token'], $curl_jason['id'] );
            return true;
        } else {
            return $curl_jason;
        }
    }

    public function get_user_data()
    {
        $modelsigma = new ModelSigmaSMS();
        $result = $modelsigma->getUserDataByDb();

        if ($result != false) {
            $params = ['$scope[0]' => "full"];
            $params = http_build_query($params);
            $url = $this->api_url . "users/" . $result['user_id'];
            $ch = curl_init($url . "?" . $params);

            $headers = array("Content-Type:application/json", "Authorization:" . $result['token']);

            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
            curl_setopt($ch, CURLOPT_HTTPGET, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            $response = json_decode($response, true);

            return $response;

        } else {

            return $result;
        }

    }

    public function change_user_data($login, $email, $first_name, $last_name, $phone, $old_password = '', $password = '')
    {
        $modelsigma = new ModelSigmaSMS();

        $user_data = $modelsigma->getUserDataByDb();

        if ($password != '') {
            if ($user_data['password'] == $old_password) {
                $data = ['username' => $login, 'data' => ['phone' => $phone, 'email' => $email, 'firstName' => $first_name, 'lastName' => $last_name], 'password' => $password];
            } else {
                $data = ['error' => 'Пароли не совпадают'];
                return $data;
            }
        } else {
            $data = ['username' => $login, 'data' => ['phone' => $phone, 'email' => $email, 'firstName' => $first_name, 'lastName' => $last_name]];
        }

        $change_user_data = $this->editEntity($user_data['id'], $data, 'users');


        if (!isset($change_user_data['error'])) {
            $modelsigma->update_user($login, $password, $user_data['token'], $user_data['user_id']);
        }

        return $change_user_data;

    }

    function clear_phone($phone)
    {
        $phone = preg_replace('/[+() -]+/', '', $phone);
        if (preg_match('/8\d{10}\b/', $phone)) {
            $phone = preg_replace('/8(?=\d{10}\b)/', "+7", $phone);
        }
        return $phone;
    }

}

<?php

require_once DIR_SYSTEM . '/library/sigmamsg/Controller.php';
require_once DIR_SYSTEM . '/library/sigmamsg/Model.php';
require_once DIR_SYSTEM . '/library/sigmamsg/parsedown-master/Parsedown.php';

class ControllerSigmaMsgProfile extends Controller
{

    private $module_name = 'sigmamsg';


    public function index()
    {

        $sigmamsg = new SigmaSMS();
        $modelsigmamsg = new ModelSigmaSMS();

        if (isset($_GET)) {
            if (isset($_REQUEST['method'])) {
                if ($_REQUEST['method'] == "get_user_data") {

                    if (isset($this->session->data['user_data']) && isset($this->session->data['user_data']['id'])) {
                        $data = $this->session->data['user_data'];
                    } else {
                        $data = $sigmamsg->get_user_data();
                        $this->session->data['user_data'] = $data;
                    }

                    if (isset($data['error']) && $data['error'] == 401) {
                        $this->log->write("Refresh sigma token");

                        $user_data = $modelsigmamsg->getUserDataByDb();

                        $sigmamsg->sign_in($user_data['login'], $user_data['password']);

                        $data = $sigmamsg->get_user_data();
                        $this->session->data['user_data'] = $data;
                    }
                    echo json_encode($data);
                }

                if($_REQUEST['method'] == "get_payment_offer"){
                    $Parsedown = new Parsedown();
                    $payment_offer = $sigmamsg->get_payment_offer();

                    echo json_encode($Parsedown->text($payment_offer));
                }

                if($_REQUEST['method'] == "get_companies"){

                    $companies = $sigmamsg->get_companies($_REQUEST['vat']);

                    echo json_encode($companies);
                }

                if($_REQUEST['method'] == "getRequisites"){
                    $requsites = $sigmamsg->getRequisites();
                    echo json_encode($requsites);
                }

                if ($_REQUEST['method'] == "refresh_balance") {

                    if (!isset($this->session->data['user_data'])) {
                        $this->session->data['user_data'] = $sigmamsg->get_user_data();
                    } else {
                        $data = $sigmamsg->get_balance();

                        if (isset($data['error']) && $data['error'] == 401) {
                            $this->log->write("Refresh sigma token");

                            $user_data = $modelsigmamsg->getUserDataByDb();

                            $sigmamsg->sign_in($user_data['login'], $user_data['password']);

                            $data = $sigmamsg->get_user_data();
                            $this->session->data['user_data'] = $data;
                        } else {
                            $this->session->data['user_data']['balance'] = $data['result'];
                        }

                        echo json_encode($this->session->data['user_data']['balance']);
                    }
                }

            } else {
                $this->generate_view();
            }
        }

        if (isset($_POST)) {
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($_REQUEST['method'])) {

                if ($_REQUEST['method'] == "signin") {
                    $sign_in = $sigmamsg->sign_in($data['login'], $data['password']);
                    echo json_encode($sign_in);
                }

                if($_REQUEST['method'] == "set_requisites"){
                    $addRequisites = $sigmamsg->addRequisites($data);
                    echo json_encode($addRequisites);
                }

                if($_REQUEST['method'] == "update_requisites"){

                    $update_requisites = $sigmamsg->updateRequisites($data['body'], $data['id']);

                    echo json_encode($update_requisites);
                }

                if($_REQUEST['method'] == "update_user_data"){

                    $update_user_data = $sigmamsg->change_user_data($data['login'], $data['email'], $data['firstname'], $data['secondname'], $data['phone']);

//                    $this->session->data['user_data'] = $sigmamsg->get_user_data();

                    echo json_encode($update_user_data);

                }

                if($_REQUEST['method'] == "delete_requisites"){

                    $delete_requisites = $sigmamsg->deleteEntity($data['id'], "requisites");

                    echo json_encode($delete_requisites);
                }

                if($_REQUEST['method'] == 'add_fund'){

                    $add_fund = $sigmamsg->add_fund($data['sum'], $data['url']);

                    echo json_encode($add_fund);
                }

                if($_REQUEST['method'] == 'add_bill'){

                    $add_bill = $sigmamsg->add_bill($data['requisiteId'], $data['companyId'], $data['sum']);

                    echo json_encode($add_bill);
                }

                if ($_REQUEST['method'] == "signup") {

                    if (!isset($data['email'])) {
                        echo json_encode(['error' => '400', 'message' => 'Поле email обязательно']);
                    }

                    if (!isset($data['firstName'])) {
                        echo json_encode(['error' => '400', 'message' => 'Поле Имя обязательно']);
                    }

                    if (!isset($data['last_name'])) {
                        echo json_encode(['error' => '400', 'message' => 'Поле Фамилия обязательно']);
                    }

                    if (!isset($data['login'])) {
                        echo json_encode(['error' => '400', 'message' => 'Поле login обязательно']);
                    }

                    if (!isset($data['phone'])) {
                        echo json_encode(['error' => '400', 'message' => 'Поле номер телефона обязательно']);
                    }

                    if (!isset($data['password'])) {
                        echo json_encode(['error' => '400', 'message' => 'Поле пароль обязательно']);
                    }

                    if (!isset($data['repeat_password'])) {
                        echo json_encode(['error' => '400', 'message' => 'Поле повторения пароля обязательно']);
                    }

                    if ($data['password'] != $data['repeat_password']) {
                        echo json_encode(['error' => '400', 'message' => 'Пароли не совпадают']);
                    }

                    $sign_up = $sigmamsg->sign_up($data['login'], $data['firstName'], $data['last_name'], $data['email'], $data['phone'], $data['password']);

                    echo json_encode($sign_up);
                }

                if ($_REQUEST['method'] == "change_pasword") {
                    $change_pasword = $this->change_pasword($data);
                    echo $change_pasword;
                }

                if($_REQUEST['method'] == "logout"){
                    $this->session->data['user_data'] = '';
                    $modelsigmamsg->logout();
                    $this->response->redirect($this->url->link('sigmamsg/profile', 'token=' . $this->session->data['token'], true));
                }

            }
        }


    }

    private function change_pasword($data)
    {
        $this->response->addHeader('Content-Type: application/json');

        if (isset($data['login']) && isset($data['phone']) && isset($data['email']) && isset($data['old_password']) && isset($data['new_password']) && isset($data['repeat_password']) && ($data['new_password'] == $data['repeat_password'])) {

            $SigmaSms = new SigmaSMS();

            if (isset($data['firstName'])) {
                $first_name = $data['firstName'];
            } else {
                $first_name = "";
            }

            if (isset($data['lastName'])) {
                $last_name = $data['lastName'];
            } else {
                $last_name = "";
            }

            $change_password = $SigmaSms->change_user_data($data['login'], $data['email'], $first_name, $last_name, $data['phone'], $data['old_password'], $data['new_password']);

            return json_encode($change_password);
        } else {
            return "inviled data";
        }
    }

    public function generate_view()
    {
        $this->load->language('extension/module/SigmaMsg');

        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/style.css');
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/bootstrap/bootstrap.min.css');
        $this->document->addScript('view/javascript/' . $this->module_name . '/common/header.js');
        $this->document->addScript('view/javascript/' . $this->module_name . '/profile.js');
        $this->document->setTitle($this->language->get('heading_title'));

        $data = [];


        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');
        $data['sigmamsg_header'] = $this->load->view('sigmamsg/common/header', ['user_cab_link' => $this->url->link('sigmamsg/profile', 'token=' . $this->session->data['token'], true)]);


        $this->response->setOutput($this->load->view('sigmamsg/profile', $data));
    }


}



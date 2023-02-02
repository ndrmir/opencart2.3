<?php

require_once DIR_SYSTEM . '/library/sigmamsg/Controller.php';
require_once DIR_SYSTEM . '/library/sigmamsg/Model.php';


// перенести refresh img на бэкенд


class ControllerSigmaMsgSendingByEvents extends Controller
{
    private $module_name = 'sigmamsg';

    public function index()
    {
        if (isset($_GET)) {
            if (isset($_REQUEST['method'])) {
                $modelsigmamsg = new ModelSigmaSMS();
                $sigmamsg = new SigmaSMS();

                if ($_REQUEST['method'] == 'get_event_data') {
                    $event_data = $modelsigmamsg->get_event_data($_REQUEST['order_status_id'], $_REQUEST['event_type']);

                    if($event_data){
                        $event_data = $event_data[0];

                        $event_data['customer_msg_body'] = json_decode($event_data['customer_msg_body'], true);
                        $event_data['admin_msg_body'] = json_decode($event_data['admin_msg_body'], true);
                        $event_data['additional_settings'] = json_decode($event_data['additional_settings'], true);

                        echo json_encode($event_data);
                    }else{
                        http_response_code(404);
                        echo json_encode('template not found');
                    }
                }

                if($_REQUEST['method'] == 'check_img'){
                    $test = $sigmamsg->checkImg($_REQUEST['id']);
                    echo json_encode($test);
                }

                if($_REQUEST['method'] == 'get_statuses_list'){
                    $language_id = $this->config->get('config_language_id');
                    $statuses_list = $modelsigmamsg->get_order_status_list($language_id);
                    echo json_encode($statuses_list);
                }

            } else {
                $this->generate_view();
            }
        }

        if (isset($_POST)) {
            if (isset($_REQUEST['method'])) {
                $sigmamsg = new SigmaSMS();
                $modelsigmamsg = new ModelSigmaSMS();
                $data = json_decode(file_get_contents('php://input'), true);
                if ($_REQUEST['method'] == 'upload_file') {
                    $name = $_FILES[key($_FILES)]['name'];
                    $type = $_FILES[key($_FILES)]['type'];
                    $size = $_FILES[key($_FILES)]['size'];
                    $tmp_name = $_FILES["file"]["tmp_name"];
                    $uploaded_file = $sigmamsg->upload_file($_FILES[key($_FILES)], "storage", $name, $type, $size);
                    move_uploaded_file($tmp_name, __DIR__ . "/../../view/image/sigmamsg/upload/" . $uploaded_file['title'] . ".jpg");
                    echo json_encode($uploaded_file);
                } else if ($_REQUEST['method'] == 'change_event_data') {
                    $change_event_data = $modelsigmamsg->change_sigma_event_data($data['order_status_id'],
                                                                                 $data['event_type'],
                                                                                 $data['customer_event_status'],
                                                                                 $data['customer_msg_body'],
                                                                                 $data['admin_event_status'],
                                                                                 $data['admin_msg_body'],
                                                                                 $data['additional_settings']
                                                                                 );
                    if( isset($change_event_data['status']) && $change_event_data['status'] == false){
                        if(isset($change_event_data['error'])){
                            $this->log->write($change_event_data['error']);
                        }
                    }

                    echo json_encode($change_event_data);
                }else if($_REQUEST['method'] == 'refresh_image'){
                    $name = $data['id'];
                    $file_route = __DIR__ . "/../../view/image/sigmamsg/upload/" . $name .".jpg";
                    $size = filesize($file_route);
                    $uploaded_file = $sigmamsg->upload_file($file_route, "storage", $name, "image/jpg", $size);

                    if(!isset($uploaded_file['error'])){
                        $title = $uploaded_file['title'];
                        rename($file_route, __DIR__ . "/../../view/image/sigmamsg/upload/". $title . ".jpg");

                        if($data['isfallbacks'] == false){
                            $this->log->write("refresh main img");
                                $event_data = $modelsigmamsg->get_event_data($data['order_id'], $data['event_type']);
                                $event_data = $event_data[0];
                                $event_data['customer_msg_body'] = json_decode($event_data['customer_msg_body'], true);
                                $event_data['admin_msg_body'] = json_decode($event_data['admin_msg_body'], true);
                                $event_data['additional_settings'] = json_decode($event_data['additional_settings'], true);
                                $event_data['customer_msg_body']['payload']['image'] = $title;


                            $change_event_data = $modelsigmamsg->change_sigma_event_data($data['order_id'],
                                                                                            $data['event_type'],
                                                                                            $event_data['customer_msg_status'],
                                                                                            $event_data['customer_msg_body'],
                                                                                            $event_data['admin_msg_status'],
                                                                                            $event_data['admin_msg_body'],
                                                                                            $event_data['additional_settings']
                                                                                        );
                            echo json_encode($title);
                        }else{
                            $this->log->write("refresh fallbacks img");

                            $event_data = $modelsigmamsg->get_event_data($data['order_id'], $data['event_type']);
                            $event_data = $event_data[0];
                            $event_data['customer_msg_body'] = json_decode($event_data['customer_msg_body'], true);
                            $event_data['admin_msg_body'] = json_decode($event_data['admin_msg_body'], true);
                            $event_data['additional_settings'] = json_decode($event_data['additional_settings'], true);
                            $event_data['customer_msg_body']['fallbacks']['payload']['image'] = $title;


                            $change_event_data = $modelsigmamsg->change_sigma_event_data($data['order_id'],
                                $data['event_type'],
                                $event_data['customer_msg_status'],
                                $event_data['customer_msg_body'],
                                $event_data['admin_msg_status'],
                                $event_data['admin_msg_body'],
                                $event_data['additional_settings']
                            );

                            echo json_encode($title);
                        }

                    }


                }
            }
        }
    }


    public function generate_view()
    {
        $this->load->language('extension/module/SigmaMsg');
        $this->document->setTitle($this->language->get('heading_title'));

        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/style.css');
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/bootstrap/bootstrap.min.css');
        $this->document->addScript('view/javascript/' . $this->module_name . '/common/header.js');
        $this->document->addScript('view/javascript/' . $this->module_name . '/sending_by_events/script.js');
        $this->document->addScript('view/javascript/' . $this->module_name . '/sending_by_events/preview_msg.js');
        $this->document->addScript('view/javascript/' . $this->module_name . '/sending_by_events/api_functions.js');

        $data = [];
        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');
        $data['sigmamsg_header'] = $this->load->view('sigmamsg/common/header', ['user_cab_link' => $this->url->link('sigmamsg/profile', 'token=' . $this->session->data['token'], true)]);

        $this->response->setOutput($this->load->view('sigmamsg/sending_by_events', $data));
    }
}
<?php

require_once DIR_SYSTEM . '/library/sigmamsg/Controller.php';
require_once DIR_SYSTEM . '/library/sigmamsg/Model.php';

class ControllerSigmaMsgMassSending extends Controller
{
    private $module_name = 'sigmamsg';
    
    public function index()
    {
        if (isset($_GET)) {
            if (isset($_REQUEST['method'])) {
                $sigmamsg = new SigmaSMS();
                if ($_REQUEST['method'] == 'getSenderNames') {
                    $params = ['$scope[0]' =>"full", '$scope[1]' => "attached"];
                    $sendernames = $sigmamsg->getSigmaData("sendernames", $params);
                    echo json_encode($sendernames['data']);
                }
                if ($_REQUEST['method'] == 'getTemplates') {
                    $templates = $sigmamsg->getSigmaData('templates');
                    echo json_encode($templates['data']);
                }
            } else {
                $this->generate_view();
            }
        }
        if(isset($_POST)){
            $sigmamsg = new SigmaSMS();
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($_REQUEST['method'])) {
                if ($_REQUEST['method'] == 'create_template') {

                    $create_template = $sigmamsg->create_template($data);
//
//                    $create_template = $sigmamsg->create_template($data['title_template'], $data['type'], $data['exclude'],
//                                                                  $data['include'], $data['sender'], $data['text'],
//                                                                  $data['button_describe'], $data['button_link'], $data['image']);
                    echo json_encode($create_template);

                }else if ($_REQUEST['method'] == 'update_template'){
                    $update_template = $sigmamsg->update_template($data);
                    echo json_encode($update_template);
                }else if ($_REQUEST['method'] == "delete_template"){
                    $delete_template = $sigmamsg->deleteEntity($data['id'], "templates");
                    echo json_encode($delete_template);
                } else if ($_REQUEST['method'] == 'sendings') {
                    $create_massSendings = $sigmamsg->create_massSendings($data);
                    echo json_encode($create_massSendings);
                }else if($_REQUEST['method'] == "addSenderName"){
                    $add_sender_name = $sigmamsg->addSenderName($data['comment'], $data['name'], $data['type']);
                    echo json_encode($add_sender_name);
                }else if ($_REQUEST['method'] == 'upload_file') {
                    $name = $_FILES[key($_FILES)]['name'];
                    $type = $_FILES[key($_FILES)]['type'];
                    $size = $_FILES[key($_FILES)]['size'];
                    $upload_file = $sigmamsg->upload_file($_FILES[key($_FILES)], "storage", $name, $type, $size);
                    echo json_encode($upload_file['id']);

                }
            }
        }
    }

    public function generate_view(){
        
        $this->load->language('extension/module/SigmaMsg');
        $this->document->setTitle($this->language->get('heading_title'));
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/style.css');
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/bootstrap/bootstrap.min.css');
        $this->document->addStyle('view/stylesheet/bootstrap.css');
        
        $this->document->addScript('view/javascript/' . $this->module_name . '/common/header.js');
        $this->document->addScript('view/javascript/' . $this->module_name . '/mass_sending.js');

        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/datepicker/daterangepicker-bs2.css');
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/datepicker/daterangepicker-bs3.css');
        $this->document->addScript('view/javascript/' . $this->module_name . '/datepicker/daterangepicker.js');

        $data = [];
        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');
        $data['sigmamsg_header'] = $this->load->view('sigmamsg/common/header', ['user_cab_link' => $this->url->link('sigmamsg/profile', 'token=' . $this->session->data['token'], true)]);

        $this->response->setOutput($this->load->view('sigmamsg/mass_sending', $data));
    }
}
    ?>

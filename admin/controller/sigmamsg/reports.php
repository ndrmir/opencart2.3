<?php

require_once DIR_SYSTEM . '/library/sigmamsg/Controller.php';

class ControllerSigmaMsgReports extends Controller
{
    private $module_name = 'sigmamsg';

    public function index(){

        if (isset($_GET)) {
            if (isset($_REQUEST['method'])) {
                if ($_REQUEST['method'] == "getReports") {
                    $SigmaSms = new SigmaSMS();
                    $data = $SigmaSms->getReports(urldecode($_REQUEST['createdAt_lt']), urldecode($_REQUEST['createdAt_gt']));
                    echo json_encode($data);
                }

                if($_REQUEST['method'] == 'getSendings'){
                    $sigmamsg = new SigmaSMS();
                    $params =['$offset'=> '0',
                        '$limit'=> '25',
                        '$order[0][0]'=> 'createdAt',
                        '$order[0][1]'=> 'desc',
                        '$scope[0]'=> 'full',
                        'createdAt[$lt]'=> $_REQUEST['createdAt_lt'],
                        'createdAt[$gt]' => $_REQUEST['createdAt_gt']
                    ];

                    $templates = $sigmamsg->getSigmaData('sendings', $params);
                    echo json_encode($templates);
                }
            }else{
                $this->generate_view();
            }
        }
        if(isset($_POST)){
            if(isset($_REQUEST['method'])){
                if($_REQUEST['method'] == 'download_csv'){

                    $data = json_decode(file_get_contents('php://input'));
                    $file = __DIR__ . '/report.csv';

                    if(isset($data->text)){
                        $data = strval($data->text);
                        file_put_contents($file, $data);
                    }

                    header('Content-Description: File Transfer');
                    header('Content-Type: application/octet-stream');
                    header('Content-Disposition: attachment; filename=' . basename($file));
                    header('Content-Transfer-Encoding: binary');
                    header('Expires: 0');
                    header('Cache-Control: must-revalidate');
                    header('Pragma: public');
                    header('Content-Length: ' . filesize($file));
                    readfile($file);
                    return true;
                }
            }
        }


    }

    public function generate_view(){
        $this->load->language('extension/module/SigmaMsg');

        $this->document->setTitle($this->language->get('heading_title'));
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/style.css');
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/bootstrap/bootstrap.min.css');
        $this->document->addScript('view/javascript/' . $this->module_name . '/common/header.js');
        $this->document->addScript('view/javascript/' . $this->module_name . '/reports.js');

        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/datepicker/daterangepicker-bs2.css');
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/datepicker/daterangepicker-bs3.css');
        $this->document->addScript('view/javascript/' . $this->module_name . '/datepicker/daterangepicker.js');
        $this->document->addScript('view/javascript/' . $this->module_name . '/datepicker/moment.min.js');

        $data = [];
        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');
        $data['sigmamsg_header'] = $this->load->view('sigmamsg/common/header', ['user_cab_link' => $this->url->link('sigmamsg/profile', 'token=' . $this->session->data['token'], true)]);

        $this->response->setOutput($this->load->view('sigmamsg/reports', $data));
    }


}
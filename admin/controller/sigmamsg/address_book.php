<?php

require_once DIR_SYSTEM . '/library/sigmamsg/Controller.php';
require_once DIR_SYSTEM . '/library/sigmamsg/Model.php';

class ControllerSigmaMsgAddressBook extends Controller
{
    private $module_name = 'sigmamsg';

    public function index()
    {

        if (isset($_GET)) {
            $sigmamsg = new SigmaSMS();
            $modelsigmamsg = new ModelSigmaSMS();
            $language_id = $this->config->get('config_language_id');
            if (isset($_REQUEST['method'])) {
                if ($_REQUEST['method'] == 'getContactLists') {
                    $contactLists = $sigmamsg->getSigmaData("contactLists");
                    echo json_encode($contactLists['data']);
                }

                if($_REQUEST['method'] == 'getGroupList'){
                    $groupList = $modelsigmamsg->get_groups($language_id);
                    echo json_encode($groupList);
                }

                if($_REQUEST['method'] == 'getCategories'){
                    $categories = $modelsigmamsg->get_categories($language_id);
                    echo json_encode($categories);
                }

                if($_REQUEST['method'] == 'SelectMaxOrderSumm'){
                    $max_order_sum = $modelsigmamsg->SelectMaxOrderSumm();
                    echo json_encode($max_order_sum);
                }

                if ($_REQUEST['method'] == 'getUsers') {
                    $params = ["ListId" => $_REQUEST['id']];
                    $contactLists = $sigmamsg->getSigmaData("contacts", $params);
                    echo json_encode($contactLists);
                }

                if($_REQUEST['method'] == 'getManufacturer'){
                    $manufacturer_list = $modelsigmamsg->get_manufacturer();
                    echo json_encode($manufacturer_list);
                }

                if($_REQUEST['method'] == "getCustomers"){

                    if(isset($_REQUEST['status_id']) && $_REQUEST['status_id']!='' && $_REQUEST['status_id']!= 'undefined'){
                        $status_id = trim($_REQUEST['status_id']);
                    }else{
                        $status_id = null;
                    }

                    if(isset($_REQUEST['total_start']) && $_REQUEST['total_start']!='' && $_REQUEST['total_start']!='undefined'){
                        $total_start = trim($_REQUEST['total_start']);
                    }else{
                        $total_start = null;
                    }

                    if(isset($_REQUEST['total_end']) && $_REQUEST['total_end']!='' && $_REQUEST['total_end']!='undefined'){
                        $total_end = trim($_REQUEST['total_end']);
                    }else{
                        $total_end = null;
                    }

                    if(isset($_REQUEST['customer_group_id']) && $_REQUEST['customer_group_id']!='' && $_REQUEST['customer_group_id']!='undefined'){
                        $customer_group_id = trim($_REQUEST['customer_group_id']);
                    }else{
                        $customer_group_id = null;
                    }

                    if(isset($_REQUEST['manufacturer_id']) && $_REQUEST['manufacturer_id']!='' && $_REQUEST['manufacturer_id']!='undefined'){
                        $manufacturer_id = trim($_REQUEST['manufacturer_id']);
                    }else{
                        $manufacturer_id = null;
                    }

                    if(isset($_REQUEST['product_categories_id']) && $_REQUEST['product_categories_id']!='' && $_REQUEST['product_categories_id']!='undefined'){
                        $product_categories_id = trim($_REQUEST['product_categories_id']);
                    }else{
                        $product_categories_id = null;
                    }



                    $customers = $modelsigmamsg->get_customers($status_id, $total_start, $total_end, $language_id, $manufacturer_id, $customer_group_id, $product_categories_id);

                    echo json_encode($customers);
                }

            } else {

                $this->generate_view();
            }
        }

        if (isset($_POST)) {
            if (isset($_REQUEST['method'])) {

                if ($_REQUEST['method'] == 'addCustomersInExistBook') {
                    $cusomer_list = json_decode(file_get_contents('php://input'), true);
                    $book_id = $_REQUEST['book_id'];
                    $push_customer = $sigmamsg->push_file_with_customer($cusomer_list);
                    $add_by_storage = $sigmamsg->add_by_storage($book_id, $push_customer['id']);
                    print_r( json_encode($add_by_storage));
                }

                if ($_REQUEST['method'] == 'add_user') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    $add_user = $sigmamsg->add_entity($data, 'contacts');
                    echo $add_user;
                }

                if ($_REQUEST['method'] == 'delete_user') {
                    $delete_user = $sigmamsg->deleteEntity($_REQUEST['id'], "contacts");
                    echo json_encode($delete_user);
                }

                if ($_REQUEST['method'] == 'delete_book') {
                    $deleteContactList = $sigmamsg->deleteEntity($_REQUEST['id'], "contactLists");
                    echo json_encode($deleteContactList);
                }

                if ($_REQUEST['method'] == 'add_book') {
                    $data = json_decode(file_get_contents('php://input'));
                    $add_book = $sigmamsg->add_entity(['title' => $data->name, 'isActive' => true, "type" => "regular"], 'contactLists');
                    echo json_encode($add_book);
                }

                if ($_REQUEST['method'] == 'change_book_name') {
                    $data = json_decode(file_get_contents('php://input'));
                    $change_data = $sigmamsg->editEntity($_REQUEST['id'], $data, 'contactLists');
                    echo json_encode($change_data);
                }

                if ($_REQUEST['method'] == 'change_user_data') {
                    $data = json_decode(file_get_contents('php://input'));
                    $change_data = $sigmamsg->editEntity($_REQUEST['id'], $data, 'contacts');
                    echo json_encode($change_data);
                }

                if ($_REQUEST['method'] == 'upload_file') {
                    $name = $_FILES[key($_FILES)]['name'];
                    $type = $_FILES[key($_FILES)]['type'];
                    $size = $_FILES[key($_FILES)]['size'];
                    $upload_file = $sigmamsg->upload_file($_FILES[key($_FILES)], "storage", $name, $type, $size);
                    $add_by_storage = $sigmamsg->add_by_storage($_REQUEST['id'], $upload_file['id']);
                    echo json_encode($add_by_storage);

                }
            }
        }
    }

    public function generate_view()
    {
        $this->load->language('extension/module/SigmaMsg');

        $this->document->setTitle($this->language->get('heading_title'));
        $this->document->addStyle('view/stylesheet/sigmamsg/style.css');
        $this->document->addScript('view/javascript/' . $this->module_name . '/common/header.js');
        $this->document->addScript('view/javascript/' . $this->module_name . '/address_book.js');

        $this->document->addStyle('view/stylesheet/bootstrap.css');
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/bootstrap/bootstrap.min.css');
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/datatables/datatables.min.css');
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/style.css');


        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/datepicker/daterangepicker-bs2.css');
        $this->document->addStyle('view/stylesheet/' . $this->module_name . '/datepicker/daterangepicker-bs3.css');
        $this->document->addScript('view/javascript/' . $this->module_name . '/datepicker/daterangepicker.js');
        $this->document->addScript('view/javascript/' . $this->module_name . '/datepicker/moment.min.js');

        $this->document->addScript('view/javascript/' . $this->module_name . '/common/customer_by_store_modal.js');
        $this->document->addScript('view/javascript/' . $this->module_name . '/common/add_user_modal.js');

        $this->document->addScript('view/javascript/' . $this->module_name . '/datatables/datatables.min.js');


        $data = [];

        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');
        $data['sigmamsg_header'] = $this->load->view('sigmamsg/common/header', ['user_cab_link' => $this->url->link('sigmamsg/profile', 'token=' . $this->session->data['token'], true)]);
        $data['customer_by_store_modal'] = $this->load->view('sigmamsg/common/customer_by_store_modal');
        $data['modal_add_user'] = $this->load->view('sigmamsg/common/add_user_modal');

        $this->response->setOutput($this->load->view('sigmamsg/address_book', $data));
    }

}
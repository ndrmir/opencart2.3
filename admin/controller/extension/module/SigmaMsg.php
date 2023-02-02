<?php

require_once DIR_APPLICATION . "controller/extension/modification.php";

/**
 * @property \Document $document
 * @property \Response $response
 * @property Cart\User $user
 * @property ModelUserUserGroup $model_user_user_group
 * @property \ModelExtensionEvent $model_extension_event
 */

class ControllerExtensionModuleSigmaMsg extends Controller
{

    public function install()
    {

        $this->load->model('user/user_group');

        $this->model_extension_event->deleteEvent('sigmamsg');


        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'access', 'sigmamsg/address_book');
        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'access', 'sigmamsg/common/header');
        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'access', 'sigmamsg/mass_sending');
        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'access', 'sigmamsg/profile');
        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'access', 'sigmamsg/reports');
        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'access', 'sigmamsg/sending_by_events');
        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'modify', 'sigmamsg/address_book');
        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'modify', 'sigmamsg/common/header');
        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'modify', 'sigmamsg/mass_sending');
        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'modify', 'sigmamsg/profile');
        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'modify', 'sigmamsg/reports');
        $this->model_user_user_group->addPermission($this->user->getGroupId(), 'modify', 'sigmamsg/sending_by_events');

        $this->model_extension_event->addEvent('sigmamsg', 'catalog/model/account/customer/addCustomer/after', 'sigmamsg/events/newCustomerHook');
        $this->model_extension_event->addEvent('sigmamsg', 'catalog/model/checkout/order/addOrderHistory/after', 'sigmamsg/events/OrderHook');


        // Проверка на наличие и добавление доп.колонок в таблицу БД
        $this->db->query("ALTER TABLE `" . DB_PREFIX . "modification` CHANGE `xml` `xml` MEDIUMTEXT NOT NULL");
        $chk = $this->db->query("SHOW COLUMNS FROM `" . DB_PREFIX . "modification` WHERE `field` = 'date_modified'");
        if (!$chk->num_rows) {
            $this->db->query("ALTER TABLE `" . DB_PREFIX . "modification` ADD COLUMN  `date_modified` datetime NOT NULL");
            $this->db->query("UPDATE `" . DB_PREFIX . "modification` SET `date_modified` = `date_added` WHERE `date_modified` = '0000-00-00 00:00:00'");
        }
    }

    public function uninstall()
    {
        $this->load->model('extension/event');
        $this->load->model('user/user_group');


        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'access', 'sigmamsg/address_book');
        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'access', 'sigmamsg/common/header');
        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'access', 'sigmamsg/mass_sending');
        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'access', 'sigmamsg/profile');
        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'access', 'sigmamsg/reports');
        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'access', 'sigmamsg/sending_by_events');
        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'modify', 'sigmamsg/address_book');
        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'modify', 'sigmamsg/common/header');
        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'modify', 'sigmamsg/mass_sending');
        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'modify', 'sigmamsg/profile');
        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'modify', 'sigmamsg/reports');
        $this->model_user_user_group->removePermission($this->user->getGroupId(), 'modify', 'sigmamsg/sending_by_events');

        $this->model_extension_event->uninstall('module', 'sigmamsg');

    }


}

?>

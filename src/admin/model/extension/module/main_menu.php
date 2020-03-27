<?php
class ModelExtensionModuleMainMenu extends Model {

    public function getItems() {
        $result = $this->db->query("SELECT * FROM " . DB_PREFIX ."main_menu");

    }

    public function createItem($data = array()) {
        $this->db->query("INSERT INTO " . DB_PREFIX . "menu VALUES(" .
            $data['id']
        . ")");
    }
}

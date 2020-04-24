<?php
class ModelExtensionModuleMainMenu extends Model {
    /**
     *
     */
    public function addItem($data) {
        $sort_order = (int)$data['sort_order'];

        $this->db->query("
            INSERT
            INTO " . DB_PREFIX . "main_menu SET
                title = '{$this->db->escape((string)$data['title'])}',
                href = '{$this->db->escape($data['href'])}',
                sort_order = $sort_order,
                status = {$data['status']},
                sub_items = '{$this->db->escape(json_encode($data['sub_items'] ?? array()))}'
        ");

        return $this->db->getLastId();
    }

    /**
     *
     */
    public function editItem($item_id, $data) {
        $title = $this->db->escape($data['title']);
        $sort_order = (int)$data['sort_order'];

        $this->db->query("
            UPDATE " . DB_PREFIX . "main_menu SET
            title = '$title',
            href = '{$this->db->escape($data['href'])}',
            sort_order = $sort_order,
            status = {$data['status']},
            sub_items = '{$this->db->escape(json_encode($data['sub_items']))}'
            WHERE item_id = {$item_id}
        ");
    }

    public function deleteItem($item_id) {
        $this->db->query("
            DELETE
            FROM " . DB_PREFIX . "main_menu
            WHERE item_id = {$item_id}
        ");
    }

    /**
     *
     */
    public function getItem($item_id) {
        $result = $this->db->query("
            SELECT *
            FROM " . DB_PREFIX . "main_menu
            WHERE item_id = $item_id
        ");

        return [
            'title' => $result->row['title'],
            'href' => $result->row['href'],
            'sort_order'=> $result->row['sort_order'],
            'status' => $result->row['status'],
            'sub_items' => json_decode($result->row['sub_items'], true),
        ];
    }

    /**
     *
     */
    public function getItems() {
        $result = $this->db->query("SELECT * FROM " . DB_PREFIX ."main_menu");
        return $result->rows;
    }

    public function installDB() {
        $this->db->query("CREATE TABLE IF NOT EXISTS `" . DB_PREFIX . "main_menu` (
                `item_id` int(11) NOT NULL,
                `title` varchar(64),
                `href` varchar(64) CHARACTER SET utf8 NOT NULL,
                `sort_order` tinyint(4) NOT NULL DEFAULT 0,
                `status` tinyint(4) NOT NULL,
                `sub_items` text CHARACTER SET utf8 NOT NULL
            ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;");
    }

    public function uninstallDB() {
        $this->db->query("DROP TABLE " . DB_PREFIX . "main_menu");
    }

}

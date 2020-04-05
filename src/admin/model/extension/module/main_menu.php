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
        $sort_order = (int)$data['sort_order'];

        $this->db->query("
            UPDATE " . DB_PREFIX . "main_menu SET
            title = '{$this->db->escape($data['title'])}',
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

}

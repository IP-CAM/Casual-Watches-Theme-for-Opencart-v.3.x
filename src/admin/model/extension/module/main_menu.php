<?php
class ModelExtensionModuleMainMenu extends Model {

    /**
     *
     */
    public function get_items() {
        $result = $this->db->query("SELECT * FROM " . DB_PREFIX ."main_menu");
        return $result->rows;
    }

    /**
     *
     */
    private function item_decode($item_serialized) {
        return [
            'caption' => $item_serialized['caption'],
            'link' => $item_serialized['link'],
            'subitems' => json_decode($item_serialized['subitems'], true),
        ];
    }

    /**
     *
     */
    public function get_item($id) {

        $result = $this->db->query("
            SELECT *
            FROM " . DB_PREFIX . "main_menu
            WHERE id = $id
        ");

        return $this->item_decode($result->row);
    }

    /**
     *
     */
    public function create_item($data = array()) {
        $this->db->query("
            INSERT
            INTO " . DB_PREFIX . "main_menu(
                caption,
                link,
                subitems
            )
            VALUES(
                '{$this->db->escape($data['caption'])}',
                '{$this->db->escape($data['link'])}',
                '{$this->db->escape(json_encode($data['subitems']))}'
            )
        ");
    }

    public function update_item($item_id, $data = array()) {
        $this->db->query("
            UPDATE " . DB_PREFIX . "main_menu SET
            caption = '{$this->db->escape($data['caption'])}',
            link = '{$this->db->escape($data['link'])}',
            subitems = '{$this->db->escape(json_encode($data['subitems']))}'
            WHERE id = $item_id
        ");
    }
}

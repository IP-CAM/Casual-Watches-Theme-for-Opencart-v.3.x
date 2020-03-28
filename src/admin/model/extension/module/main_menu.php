<?php
class ModelExtensionModuleMainMenu extends Model {

    public function get_items() {
        $result = $this->db->query("SELECT * FROM " . DB_PREFIX ."main_menu");
        return $result->rows;
    }


    /**
     *
     */
    private function item_decode($item_serialized) {
        return [
            'caption' => json_decode($item_serialized['caption'], true),
            'link' => $item_serialized['link'],
            'subitems' => json_decode($item_serialized['subitems'], true),
        ];
    }



    public function create_item($data = array()) {
        $this->db->query("
            INSERT
            INTO " . DB_PREFIX . "main_menu(
                caption,
                link,
                subitems
            )
            VALUES(
                '{$this->db->escape(json_encode($data['caption'], true))}',
                '{$this->db->escape($data['link'])}',
                '{$this->db->escape(json_encode($data['subitems'], true))}'
            )
        ");
    }

    public function get_item($item_id) {

        $result = $this->db->query("
            SELECT *
            FROM " . DB_PREFIX . "main_menu
            WHERE id=$item_id
        ");

        return $this->item_decode($result->row);
    }
}

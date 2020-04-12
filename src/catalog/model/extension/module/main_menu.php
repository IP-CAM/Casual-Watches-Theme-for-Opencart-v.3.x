<?php
class ModelExtensionModuleMainMenu extends Model {

    /**
     *
     */
    public function getItems() {
        $query = $this->db->query("SELECT * FROM " . DB_PREFIX ."main_menu");

        $result = array();

        foreach ($query->rows as $row) {
            $result[] = [
                'title' => $row['title'],
                'href' => $row['href'],
                'sort_order'=> $row['sort_order'],
                'status' => $row['status'],
                'sub_items' => json_decode($row['sub_items'], true),
            ];
        }

        return $result;
    }
}

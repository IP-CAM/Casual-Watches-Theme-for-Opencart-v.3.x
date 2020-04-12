<?php
class ControllerExtensionModuleMainMenu extends Controller {

    public function index($setting = null) {
        $this->load->model('extension/module/main_menu');

        $data['items'] = $this->model_extension_module_main_menu->getItems();

        return $this->load->view('extension/module/main_menu', $data);
    }
}

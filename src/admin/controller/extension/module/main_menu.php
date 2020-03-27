<?php
class ControllerExtensionModuleMainMenu extends Controller {

    private $error = array();

    /**
     *
     */
    public function index() {

		$this->load->language('extension/module/main_menu');

		$this->document->setTitle($this->language->get('heading_title'));

		$this->load->model('setting/setting');

		if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validate()) {

            $this->model_setting_setting->editSetting('module_main_menu', ['module_main_menu_status' => 1]);
			$this->session->data['success'] = $this->language->get('text_success');

            $this->response->redirect($this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=shipping'));
		}

		if (isset($this->error['warning'])) {
			$data['error_warning'] = $this->error['warning'];
		} else {
			$data['error_warning'] = '';
		}

		$data['breadcrumbs'] = array();
		$data['breadcrumbs'][] = array('text' => $this->language->get('text_home'), 'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], 'SSL'));
		$data['breadcrumbs'][] = array('text' => $this->language->get('text_module'), 'href' => $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'], 'SSL'));
		$data['breadcrumbs'][] = array('text' => $this->language->get('heading_title'), 'href' => $this->url->link('extension/module/custom_main_menu', 'user_token=' . $this->session->data['user_token'], 'SSL'));

        //Form action, cancel link
        $data['action'] = $this->url->link('extension/module/custom_main_menu', 'user_token=' . $this->session->data['user_token'], 'SSL');
		$data['cancel'] = $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true);

        //Data
        $this->load->model('extension/module/main_menu');

        $data['items'] = $this->model_extension_module_main_menu->getItems();

        print_r($data['items']);

        //$data['user_token'] = $this->session->data['user_token'];

        $data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');

        $this->response->setOutput($this->load->view('extension/module/main_menu/main_menu_list', $data));
	}

    /**
     *
     */
    private function renderItemEditor() {
        $this->document->setTitle($this->language->get('heading_title'));

        //Languages
        $this->load->model('localisation/language');
        $languages = $this->model_localisation_language->getLanguages();
        $data['languages'] = $languages;

        //Form action, cancel link
        $data['action'] = $this->url->link('extension/module/custom_main_menu/editItem', 'user_token=' . $this->session->data['user_token'] . '&menu_item_id=' . $item_id, true);
        $data['cancel'] = $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true);

        //Common controllers
        $data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');

        $this->response->setOutput($this->load->view('extension/module/main_menu/main_menu_item', $data));
    }

    /**
     *
     */
    private function saveItem() {

    }

    private function updateItem() {

    }

    /**
     *
     */
    public function item_editor() {
        $this->load->language('extension/module/custom_main_menu');


		if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validate()) {

            //echo 'EditItem method';
            //print_r($this->request->post);


            //$this->session->data['success'] = $this->language->get('text_success');

            //$this->response->redirect($this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module'));
        }


        //Language variablse
        //...


        //Warnings
        //...

        //Breadcrumbs
        //...


        //Module status
        if (isset($this->request->post['custom_main_menu_status'])) {
            $data['custom_main_menu_status'] = $this->request->post['custom_main_menu_status'];
        } else {
            $data['custom_main_menu_status'] = $this->config->get('custom_main_menu_status');
        }

        //Data
        if (isset($this->request->get['menu_item_id'])) {
            $item_id = $this->request->get['menu_item_id'];
        }

        $data['item_id'] = $item_id;


        //Response
        $this->renderEditor();
    }

	protected function validate() {
		if (!$this->user->hasPermission('modify', 'extension/module/custom_main_menu')) {
			$this->error['warning'] = $this->language->get('error_permission');
		}

		return !$this->error;
	}

    public function install() {
        $this->load->model('setting/setting');
        $this->model_setting_setting->editSetting('module_custom_main_menu', ['module_custom_main_menu' => 1]);
    }

    public function uninstall() {
        $this->load->model('setting/setting');
        $this->model_setting_setting->deleteSetting('module_custom_main_menu');
    }
}

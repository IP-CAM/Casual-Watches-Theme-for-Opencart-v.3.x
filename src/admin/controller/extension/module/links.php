<?php
class ControllerExtensionModuleLinks extends Controller {
	const DEFAULT_MODULE_SETTINGS = [
        'name' => 'Links',
		'status' => 1
	];

    private $error = array();

    public function index() {
        if (!isset($this->request->get['module_id'])) {
            $module_id = $this->addModule();
            $this->response->redirect($this->url->link('extension/module/links','&user_token=' . $this->session->data['user_token'] . '&module_id=' . $module_id));
        } else {
            $this->editModule($this->request->get['module_id']);
        }
    }

    private function addModule() {
        $this->load->model('setting/module');

        $this->model_setting_module->addModule('links', self::DEFAULT_MODULE_SETTINGS);

        return $this->db->getLastId();
	}

	protected function editModule($module_id) {
        $this->load->model('setting/module');

        $this->load->language('extension/module/links');

        $this->document->setTitle($this->language->get('heading_title'));

        if ($this->request->server['REQUEST_METHOD'] == 'POST' && $this->validate()) {
            $this->model_setting_module->editModule($this->request->get['module_id'], $this->request->post);

			$this->session->data['success'] = $this->language->get('text_success');

			$this->response->redirect($this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true));
        }

        $data = array();

        //Breadcrumbs
        $data['breadcrumbs'] = array();

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_home'),
			'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true)
		);

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_extension'),
			'href' => $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true)
		);

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('heading_title'),
			'href' => $this->url->link('extension/module/links', 'user_token=' . $this->session->data['user_token'], true)
        );

        //Module settings
        $module_setting = $this->model_setting_module->getModule($module_id);

        foreach ($module_setting as $key => $value) {
            $data[$key] = $value;
        }

        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');

        $data['action']['cancel'] = $this->url->link('marketplace/extension', 'user_token='.$this->session->data['user_token'].'&type=module');
        $data['action']['save'] = "";

        $this->response->setOutput($this->load->view('extension/module/links', $data));
	}

    public function validate() {
        if (!$this->user->hasPermission('modify', 'extension/module/links')) {
			$this->error['permission'] = true;
		}

		if (!utf8_strlen($this->request->post['name'])) {
			$this->error['name'] = true;
        }

        return !$this->error;
    }

    public function install() {
        $this->load->model('setting/setting');
        $this->model_setting_setting->editSetting('module_links', ['module_links_status' => 1]);
    }

    public function uninstall() {
        $this->load->model('setting/setting');
        $this->model_setting_setting->deleteSetting(‘module_links’);
    }
}

<?php
class ControllerExtensionModuleMainMenu extends Controller {

    private $error = array();

    /**
     *
     */
    public function index() {
        $this->load->language('extension/module/main_menu');

        $this->document->setTitle($this->language->get('heading_title'));

        $this->load->model('extension/module/main_menu');

        $this->getList();
	}

    /**
     *
     */
    public function add() {
        $this->load->language('extension/module/main_menu');

        $this->document->setTitle($this->language->get('heading_title'));

        $this->load->model('extension/module/main_menu');

        if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validateForm()) {
            $this->model_extension_module_main_menu->addItem($this->request->post);

            $this->session->data['success'] = $this->language->get('text_success');

            $this->response->redirect($this->url->link('extension/module/main_menu', 'user_token=' . $this->session->data['user_token']));
        }

        $this->getForm();
    }


    /**
     *
     */
    public function edit() {
        $this->load->language('extension/module/main_menu');

        $this->document->setTitle($this->language->get('heading_title'));

        $this->load->model('extension/module/main_menu');

        if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validateForm()) {
            $this->model_extension_module_main_menu->editItem($this->request->get['item_id'], $this->request->post);

            $this->session->data['success'] = $this->language->get('text_success');

            $this->response->redirect($this->url->link('extension/module/main_menu', 'user_token=' . $this->session->data['user_token']));
        }

        $this->getForm();
    }

    /**
     *
     */
    public function delete() {
        $this->load->language('extension/module/main_menu');

        $this->document->setTitle($this->language->get('heading_title'));

        $this->load->model('extension/module/main_menu');

        if ($this->validateDelete()) {
            $this->model_extension_module_main_menu->deleteItem($this->request->get['item_id']);

            $this->session->data['success'] = $this->language->get('text_success');

            $this->response->redirect($this->url->link('extension/module/main_menu', 'user_token=' . $this->session->data['user_token']));
        }

        $this->getList();
    }

    /**
     *
     */
    protected function getList() {
        $data['breadcrumbs'] = array();

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_home'),
            'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'])
        );

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('heading_title'),
            'href' => $this->url->link('extension/module/main_menu', 'user_token=' . $this->session->data['user_token'])
        );

        $data['add'] = $this->url->link('extension/module/main_menu/add', 'user_token=' . $this->session->data['user_token']);

        //Items
        $results = $this->model_extension_module_main_menu->getItems();
        foreach ($results as $result) {
            $data['items'][] = [
                'title' => $result['title'],
                'status' => $result['status'] ? $this->language->get('text_enabled') : $this->language->get('text_disabled'),
                'sort_order' => $result['sort_order'],
                'edit' => $this->url->link('extension/module/main_menu/edit', 'user_token=' . $this->session->data['user_token'] . '&item_id=' . $result['item_id']),
                'delete' => $this->url->link('extension/module/main_menu/delete', 'user_token=' . $this->session->data['user_token'] . '&item_id=' . $result['item_id'])
            ];
        }

        if (isset($this->error['warning'])) {
            $data['error_warning'] = $this->error['warning'];
        } else {
            $data['error_warning'] = '';
        }

        if (isset($this->session->data['success'])) {
            $data['success'] = $this->session->data['success'];

            unset($this->session->data['success']);
        } else {
            $data['success'] = '';
        }

        $data['user_token'] = $this->session->data['user_token'];
        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');

        $this->response->setOutput($this->load->view('extension/module/main_menu/list', $data));
    }

    /**
     *
     */
    protected function getForm() {
        //Warnings
        if (isset($this->error['warning'])) {
            $data['error_warning'] = $this->error['warning'];
        } else {
            $data['error_warning'] = '';
        }
        //...

        //Breadcrumbs
        $data['breadcrumbs'] = array();

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_home'),
            'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'])
        );

        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('heading_title'),
            'href' => $this->url->link('extension/module/main_menu', 'user_token=' . $this->session->data['user_token'])
        );

        //Form action
        if (!isset($this->request->get['item_id'])) {
            $data['action'] = $this->url->link('extension/module/main_menu/add', 'user_token=' . $this->session->data['user_token']);
        } else {
            $data['action'] = $this->url->link('extension/module/main_menu/edit', 'user_token=' . $this->session->data['user_token'] . '&item_id=' . $this->request->get['item_id']);
        }
        $data['cancel'] = $this->url->link('extension/module/main_menu', 'user_token=' . $this->session->data['user_token'], true);

        //Load item
        if (isset($this->request->get['item_id']) && ($this->request->server['REQUEST_METHOD'] != 'POST')) {
            $item_info = $this->model_extension_module_main_menu->getItem($this->request->get['item_id']);
        }

        $data['user_token'] = $this->session->data['user_token'];

        if (isset($this->request->post['title'])) {
            $data['title'] = $this->request->post['title'];
        } elseif (!empty($item_info)) {
            $data['title'] = $item_info['title'];
        } else {
            $data['title'] = '';
        }

        if (isset($this->request->post['href'])) {
            $data['href'] = $this->request->post['href'];
        } elseif (!empty($item_info)) {
            $data['href'] = $item_info['href'];
        } else {
            $data['href'] = '';
        }

        if (isset($this->request->post['sort_order'])) {
            $data['sort_order'] = $this->request->post['sort_order'];
        } elseif (!empty($item_info)) {
            $data['sort_order'] = $item_info['sort_order'];
        } else {
            $data['sort_order'] = true;
        }


        if (isset($this->request->post['status'])) {
            $data['status'] = $this->request->post['status'];
        } elseif (!empty($item_info)) {
            $data['status'] = $item_info['status'];
        } else {
            $data['status'] = true;
        }

        //$this->load->model('localisation/language');
        //$data['languages'] = $this->model_localisation_language->getLanguages();
        //...

        $data['sub_items'] = $item_info['sub_items'] ?? array();

        //Common controllers
        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');

        $this->response->setOutput($this->load->view('extension/module/main_menu/form', $data));
    }

    /**
     *
     */
    protected function validateForm() {
        if (!$this->user->hasPermission('modify', 'extension/module/main_menu')) {
            $this->error['warning'] = $this->language->get('error_permission');
        }

        return !$this->error;
    }

    protected function validateDelete() {
        if (!$this->user->hasPermission('modify', 'extension/module/main_menu')) {
            $this->error['warning'] = $this->language->get('error_permission');
        }

        return !$this->error;
    }

    /**
     *
     */
    public function install() {
        $this->load->model('setting/setting');
        $this->model_setting_setting->editSetting('module_main_menu', ['module_main_menu' => 1]);

        $this->load->model('extension/module/main_menu');
		$this->model_extension_main_menu->installDB();
    }

    public function uninstall() {
        $this->load->model('setting/setting');
        $this->model_setting_setting->deleteSetting('module_main_menu');

        $this->load->model('extension/module/main_menu');
		$this->model_extension_main_menu->uninstallDB();
    }
}

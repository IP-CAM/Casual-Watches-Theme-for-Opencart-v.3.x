<?php
class ControllerExtensionModuleLinks extends Controller {

    public function index($setting = null) {

        if ($setting && $setting['status']) {
            $data = array();

            $data['class'] = $setting['class'];
            $data['links'] = $setting['links'];

            return $this->load->view('extension/module/links', $data);
        }
    }
}

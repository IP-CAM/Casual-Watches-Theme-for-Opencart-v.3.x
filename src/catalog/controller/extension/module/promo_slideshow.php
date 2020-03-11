<?php
class ControllerExtensionModulePromoSlideshow extends Controller {
	public function index($setting) {
		static $module = 0;

		$this->load->model('design/banner');
		$this->load->model('tool/image');

        $this->document->addStyle('catalog/view/theme/cw/vendors/swiper/css/swiper.min.css');
        $this->document->addScript('catalog/view/theme/cw/vendors/swiper/js/swiper.min.js');

        $this->document->addStyle('catalog/view/theme/cw/vendors/slick-carousel/slick/slick.css');
        $this->document->addStyle('catalog/view/theme/cw/vendors/slick-carousel/slick/slick-theme.css');
        $this->document->addScript('catalog/view/theme/cw/vendors/slick-carousel/slick/slick.min.js');

        $this->document->addStyle('catalog/view/theme/cw/vendors/@glidejs/glide/dist/css/glide.core.min.css');
        $this->document->addStyle('catalog/view/theme/cw/vendors/@glidejs/glide/dist/css/glide.theme.min.css');
        $this->document->addScript('catalog/view/theme/cw/vendors/@glidejs/glide/dist/glide.min.js');


		$data['banners'] = array();

		$results = $this->model_design_banner->getBanner($setting['banner_id']);

		foreach ($results as $result) {
			if (is_file(DIR_IMAGE . $result['image'])) {
				$data['banners'][] = array(
					'title' => $result['title'],
					'link'  => $result['link'],
					'image' => $this->model_tool_image->resize(html_entity_decode($result['image'], ENT_QUOTES, 'UTF-8'), $setting['width'], $setting['height'])
				);
			}
		}

		$data['module'] = $module++;

		return $this->load->view('extension/module/promo_slideshow', $data);
	}
}

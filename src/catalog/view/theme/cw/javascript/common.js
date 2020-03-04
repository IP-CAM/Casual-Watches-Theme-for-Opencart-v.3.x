//On DOM ready
$(() => {
    //Header
    $(window).scroll(function() {
        if ($(this).scrollTop() > 0) {
            console.log($(this).scrollTop())
            $('.header').addClass('header_compact')
        } else {
            $('.header').removeClass('header_compact')
        }
    })

    //Search
    $('.search__submit').on('click', () => {
        let url = `${$('base').attr('href')}index.php?route=product/search`
		const value = $('.search__input').val()

		if (value) {
			url += `&search= ${encodeURIComponent(value)}`
            location = url
        }
	})

	$('.search__input').on('keydown', e => {
		if (e.keyCode == 13) {
			$('.search__submit').trigger('click');
		}
    })

    //
})

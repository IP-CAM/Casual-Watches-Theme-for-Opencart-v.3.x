//On DOM ready
$(() => {


    //Search box
    const searchBox = $('.search-box')
    const searchBoxToggler = $('.search-box-toggler')
    const searchBoxInput = $('.search-box__input')

    searchBoxToggler.on('click', () => {
        searchBoxToggler.hide()
        searchBox.removeClass('search-box_state_hidden')
        searchBoxInput.focus()
    })

    searchBoxInput.on('focusout', function() {
        searchBox.addClass('search-box_state_hidden')
        searchBoxToggler.show()
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
})

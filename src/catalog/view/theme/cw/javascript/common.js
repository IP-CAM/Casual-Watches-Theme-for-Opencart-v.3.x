//Helpers
const ajaxErrorHandler = (xhr, ajaxOptions, thrownError) => {
    console.error(`${thrownError}\r\n${xhr.responseText}`)
}

const updateCartCount = () => {
    const cartButton = $('#cart')

    $.get('index.php?route=common/cart/info', (html) => {
        cartButton.replaceWith(html)
    })
}

const updateWishlistCount = (count) => {
    // ...
}

const getURLVar = (key) => {
    const value = []
    const query = String(document.location).split('?')

    if (query[1]) {
        const part = query[1].split('&')

        part.forEach((el) => {
            const data = el.split('=')

            if (data[0] && data[1]) {
                value[data[0]] = data[1]
            }
        })

        return value[key] || ''
    }
}

/**
 * Displays a notification
 * @param {string} text
 * @param {object} options
 */
const pushAlert = (text, options) => {
    const classNames = ['alert', 'alert-dismissible']

    if (options.view) classNames.push(`alert_vew_${options.view}`)

    const html = `<div class="${classNames.join(' ')}">${text}</div>`
    $('.alerts').append(html)
}

//Cart
const addProductToCart = (product_id, quantity) => {
    $.ajax({
        url: 'index.php?route=checkout/cart/add',
        type: 'post',
        data: `product_id=${product_id}&quantity=${
            typeof quantity != undefined ? quantity : 1
        }`,
        dataType: 'json',
        beforeSend: () => {},
        complete: () => {},
        success: addToCartResponseHandler,
        error: ajaxErrorHandler
    })
}

const addToCartResponseHandler = (json) => {
    if (json['redirect']) {
        location = json['redirect']
    }

    if (json['success']) {
        pushAlert(json['success'], { view: 'success' })
        updateCartCount()
    }
}

const updateProductInCart = (key, quantity) => {
    $.ajax({
        url: 'index.php?route=checkout/cart/edit',
        type: 'post',
        data: '',
        dataType: 'json',
        beforeSend: () => {},
        complete: () => {},
        success: updateCartResponseHandler,
        error: ajaxErrorHandler
    })
}

const removeProductFromCart = (key) => {
    $.ajax({
        url: 'index.php?route=checkout/cart/remove',
        type: 'post',
        data: `key=${key}`,
        dataType: 'json',
        beforeSend: () => {},
        complete: () => {},
        success: updateCartResponseHandler,
        error: ajaxErrorHandler
    })
}

const updateCartResponseHandler = (json) => {
    if (
        getURLVar('route') == 'checkout/cart' ||
        getURLVar('route') == 'checkout/checkout'
    ) {
        location = 'index.php?route=checkout/cart'
    } else {
        updateCartWidget()
    }
}

const cart = {
    add: addProductToCart,
    update: updateProductInCart,
    remove: removeProductFromCart
}

// Voucher

// ...

//Whishlist
const whishlist = {
    add: addProductToWhishlist
}

const addProductToWhishlist = () => {
    $.ajax({
        url: 'index.php?route=account/wishlist/add',
        type: 'post',
        data: `product_id=${product_id}`,
        dataType: 'json',
        beforeSend: () => {},
        complete: () => {},
        success: addToWhishlistResponseHander,
        error: ajaxErrorHandler
    })
}

const addToWhishlistResponseHander = (json) => {
    if (json['redirect']) {
        location = json['redirect']
    }

    if (json['success']) {
        pushAlert(json['success'], { view: 'success' })
    }

    $('.alerts').append(html)
    updateWishlistCount(json['total'])
}

//Compare
const compare = {
    add: addProductToCompare
}

const addProductToCompare = () => {
    $.ajax({
        url: 'index.php?route=account/compare/add',
        type: 'post',
        data: `product_id=${product_id}`,
        dataType: 'json',
        beforeSend: () => {},
        complete: () => {},
        success: addToWhishlistResponseHander,
        error: ajaxErrorHandler
    })
}

const addToCompareResponseHander = (json) => {
    if (json['redirect']) {
        location = json['redirect']
    }

    if (json['success']) {
        pushAlert(json['success'], { view: 'success' })
    }

    $('.alerts').append(html)
    updateWishlistCount(json['total'])
}

//On DOM ready
$(() => {
    //Modals
    const closeModal = function () {
        $(this).parents('.modal-wrapper').addClass('modal-wrapper_state_hidden')
    }

    $('.modal-close').on('click', closeModal)

    //Auth
    const showAuthModal = () => {
        $('.auth')
            .parents('.modal-wrapper')
            .removeClass('modal-wrapper_state_hidden')
    }

    $('.auth-show').on('click', showAuthModal)

    const authRequest = () => {
        $.ajax({
            url: 'index.php?route=account/quick_login',
            type: 'post',
            data: $('.auth__form input'),
            dataType: 'json',
            beforeSend: () => {
                $('.auth__error').remove()
            },
            success: authRequestResponseHandler,
            error: ajaxErrorHandler
        })
    }

    const authRequestResponseHandler = (json) => {
        //location.reload();
        console.log(json)
    }

    const authFormSubmitHandler = (event) => {
        event.preventDefault()
        authRequest()
    }

    $('.auth__form').on('submit', authFormSubmitHandler)

    //Callback
    const showCallbackModal = () => {
        $('.callback')
            .parents('.modal-wrapper')
            .removeClass('modal-wrapper_state_hidden')
    }

    $('.callback-show').on('click', showCallbackModal)

    const callbackFormSubmitHandler = (event) => {
        event.preventDefault()
    }

    //Search box
    const searchBox = $('.search-box')
    const searchBoxToggler = $('.search-box-toggler')
    const searchBoxInput = $('.search-box__input')

    searchBoxToggler.on('click', () => {
        searchBoxToggler.hide()
        searchBox.removeClass('search-box_state_hidden')
        searchBoxInput.focus()
    })

    searchBoxInput.on('focusout', function () {
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

    $('.search__input').on('keydown', (e) => {
        if (e.keyCode == 13) {
            $('.search__submit').trigger('click')
        }
    })
})

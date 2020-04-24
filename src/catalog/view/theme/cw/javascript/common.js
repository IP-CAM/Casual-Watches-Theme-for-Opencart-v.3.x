//Helpers
const initSlick = (selector, options) => {
    $(selector).slick(options)
}

const ajaxErrorHandler = (xhr, ajaxOptions, thrownError) => {
    console.error(`${thrownError}\r\n${xhr.responseText}`)
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

//Toasts
const toastPush = (text) => {
    const html = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">
                ${text}
            </div>
        </div>
    `
    const toast = $(html)
    $('.toasts').append(toast)

    toast.toast({ delay: 5000 })
    toast.toast('show')
}

//Cart
const addProductToCart = (productId, quantity) => {
    $.ajax({
        url: 'index.php?route=checkout/cart/add',
        type: 'post',
        data: `product_id=${productId}&quantity=${
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
        toastPush(json['success'], { view: 'success' })
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

const updateCartCount = () => {
    const cartButton = $('#cart')

    $.get('index.php?route=common/cart/info', (html) => {
        cartButton.replaceWith(html)
    })
}

const cart = {
    add: addProductToCart,
    update: updateProductInCart,
    remove: removeProductFromCart
}

// Voucher

// ...

//Whishlist
const addProductToWhishlist = (productId) => {
    $.ajax({
        url: 'index.php?route=account/wishlist/add',
        type: 'post',
        data: `product_id=${productId}`,
        dataType: 'json',
        beforeSend: () => {},
        complete: () => {},
        success: addToWhishlistResponseHander,
        error: ajaxErrorHandler
    })
}

const addToWhishlistResponseHander = (json) => {
    console.log(json)

    if (json['redirect']) {
        location = json['redirect']
    }

    if (json['success']) {
        toastPush(json['success'])
        updateWishlistCount(json['total'])
    }
}

const updateWishlistCount = (count) => {
    $('#wishlist').find('.button__badge').innerHtml = count
}

const whishlist = {
    add: addProductToWhishlist
}

//Compare
const compare = {
    add: function () {
        $.ajax({
            url: 'index.php?route=account/compare/add',
            type: 'post',
            data: `product_id=${product_id}`,
            dataType: 'json',
            beforeSend: () => {},
            complete: () => {},
            success: function () {
                if (json['redirect']) {
                    location = json['redirect']
                }

                if (json['success']) {
                    toastPush(json['success'])
                }

                updateWishlistCount(json['total'])
            },
            error: ajaxErrorHandler
        })
    }
}

//Modals
$.fn.modal = function (options) {
    const el = this
    const settings = $.extend(
        {
            closeEl: '.modal-close',
            formEl: 'form',
            triggerEl: null,
            onSubmit: () => {}
        },
        options
    )

    const toggle = () => {
        $(el).parents('.modal-wrapper').toggleClass('modal-wrapper_visible')
    }

    el.wrapAll('<div class="modal-wrapper"><div class="modal-container">')
    el.find(settings.closeEl).on('click', toggle)
    el.find(settings.formEl).on('submit', settings.onSubmit.bind(el))
    $(settings.triggerEl).on('click', toggle)

    return {
        toggle
    }
}

//Callback
function callbackFormSubmitHandler(event) {
    event.preventDefault()

    const html = `<div class="modal-message">Благодарим за проявленный интерес! Наш менеджер свяжется с вами в ближайшее время</div>`

    this.find('.modal__body').hide()
    this.find('.modal__messages').empty().append(html)
}

const callbackModal = $('.callback').modal({
    triggerEl: '.callback-show',
    onSubmit: callbackFormSubmitHandler
})

//Auth
function authFormSubmitHandler(event) {
    event.preventDefault()

    $.ajax({
        context: this,
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

function authRequestResponseHandler(json) {
    if (!json.warning) {
        location.reload()
    } else {
        const html = `<div class="modal-message">${json.warning}</div>`
        this.find('.modal__messages').empty().append(html)
    }
}

const authModal = $('.auth').modal({
    onSubmit: authFormSubmitHandler
})

authModal.toggle()

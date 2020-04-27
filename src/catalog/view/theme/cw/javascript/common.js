console.log('common.js')

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

;(function ($) {
    const common = (function () {
        return {
            init: function () {
                this.toasts.init()
                this.cart.init()
                this.home.init()
            },

            //Toasts
            toasts: {
                init: function () {
                    window.toasts = {
                        push: this.push
                    }
                },

                push: (text) => {
                    const html = `
                    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-body">
                            ${text}
                        </div>
                    </div>`

                    const toast = $(html)
                    $('.toasts').append(toast)

                    toast.toast({ delay: 5000 })
                    toast.toast('show')
                }
            },

            //Cart
            cart: {
                init: function () {
                    window.cart = {
                        add: this.add.bind(this),
                        remove: this.remove.bind(this)
                    }
                },
                add: function (productId, quantity) {
                    quantity = quantity || 1

                    $.ajax({
                        context: this,
                        url: 'index.php?route=checkout/cart/add',
                        type: 'post',
                        data: `product_id=${productId}&quantity=${quantity}`,
                        dataType: 'json',
                        beforeSend: () => {},
                        complete: () => {},
                        success: function (json) {
                            if (json['redirect']) {
                                location = json['redirect']
                            }

                            if (json['success']) {
                                toasts.push(json['success'])

                                this.updateCounter()
                            }
                        },
                        error: ajaxErrorHandler
                    })
                },
                remove: (key) => {
                    $.ajax({
                        url: 'index.php?route=checkout/cart/remove',
                        type: 'post',
                        data: `key=${key}`,
                        dataType: 'json',
                        beforeSend: () => {},
                        complete: () => {},
                        success: cart.updateCounter,
                        error: ajaxErrorHandler
                    })
                },
                updateCounter: () => {
                    $.get('index.php?route=common/cart/info', (html) => {
                        $('#cart').replaceWith(html)
                    })
                }
            },

            //Wishlist
            wishlist: {
                init: function () {
                    window.wishlist = {
                        add: this.add.bind(this)
                    }
                },
                add: (productId) => {
                    $.ajax({
                        url: 'index.php?route=account/wishlist/add',
                        type: 'post',
                        data: `product_id=${productId}`,
                        dataType: 'json',
                        beforeSend: () => {},
                        complete: () => {},
                        success: (json) => {
                            if (json['redirect']) {
                                location = json['redirect']
                            }

                            if (json['success']) {
                                toasts.push(json['success'])
                                //upd count
                            }
                        },
                        error: ajaxErrorHandler
                    })
                },
                updateCounter: (count) => {
                    // ...
                }
            },

            //Voushcer
            //TODO: ...
            voucher: {},

            //Home
            home: {
                init: function () {
                    //Brands carousel
                    $('.carousel').slick({
                        slidesToShow: 7,
                        slidesToScroll: 5,
                        autoplay: true,
                        autoplaySpeed: 5000,
                        speed: 1600
                    })

                    //Slideshow
                    $('.slideshow').slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        arrows: false,
                        autoplay: true,
                        autoplaySpeed: 3000,
                        speed: 900
                    })

                    //Featured
                    $('.featured-carousel').slick({
                        infinite: true,
                        slidesToShow: 4,
                        slidesToScroll: 3,
                        centerPadding: 30
                    })
                }
            },

            //Product
            product: {}
        }
    })()
    common.init()
})(jQuery)

const ajaxErrorHandler = (xhr, ajaxOptions, thrownError) => {
    console.error(`${thrownError}\r\n${xhr.responseText}`)
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

    console.log('fn.modal')

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

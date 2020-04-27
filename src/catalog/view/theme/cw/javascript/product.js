//Add to Cart
const addButtonClickHandler = () => {
    $.ajax({
        url: 'index.php?route=checkout/cart/add',
        type: 'post',
        data: $(
            '#product input[type=text], #product input[type=hidden], #product input[type=radio]:checked, #product input[type=checkbox]:checked, #product select, #product texterea'
        ),
        dataType: 'json',
        beforeSend: () => {},
        complete: () => {},
        success: addResponseHandler,
        error: ajaxErrorHandler
    })
}

const addResponseHandler = (json) => {
    $('.alert-dismissible, .text-danger').remove()
    $('.form-control').removeClass('is-invalid')

    if (json['error']) {
        if (json['error']['option']) {
            for (let code in json['error']['option']) {
                const el = $('#input-option' + code.replace('_', '-'))

                if (el.parent().hasClass('input-group')) {
                    el.parent().after(
                        `<div class="text-danger">${json['erorr']['option'][code]}</div>`
                    )
                } else {
                    el.after(
                        `<div class="text-danger">${json['error']['option'][code]}</div>`
                    )
                }
            }
        }

        if (json['error']['reccurring']) {
            $('select[name=recuring_id]').after(
                `<div class="text-danger">${json['error']['recurring']}</div>`
            )
        }

        if (json['error']['quantity']) {
            $('select[name=quantity]').after(
                `<div class="text-danger">${json['error']['quantity']}</div>`
            )
        }

        // Highlight any found errors
        $('.text-danger').each(function () {
            const el = $(this).parent().find(':input')

            if (el.hasClass('form-control')) {
                el.addClass('is-invalid')
            }
        })
    }

    if (json['success']) {
        toastPush(json['success'], { view: 'success' })
        //Update cart
        updateCartCount()
    }
}

$('#button-cart').on('click', addButtonClickHandler)

$(document).ready(() => {
    $('.product-image-carousel').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: false,
        asNavFor: '.product-thumb-carousel'
    })

    $('.product-thumb-carousel').slick({
        vertical: true,
        slidesToShow: 10,
        slidesToScroll: 1,
        asNavFor: '.product-image-carousel',
        dots: false,
        focusOnSelect: true,
        infinite: false,
        autoplay: false,
        verticalSwiping: true
    })
})

//Quick order
const quickOrderModal = $('.quick-order').modal({
    onSubmit: quickOrderModalSubmitHandler,
    triggerEl: '#quick-order'
})

function quickOrderModalSubmitHandler(event) {
    event.preventDefault()
}

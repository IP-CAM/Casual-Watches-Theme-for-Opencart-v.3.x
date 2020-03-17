//Add to Cart
const addButtonClickHandler = () => {
    $.ajax({
        url: 'index.php?route=checkout/cart/add',
        type: 'post',
        data: $('#product input[type=text], #product input[type=hidden], #product input[type=radio]:checked, #product input[type=checkbox]:checked, #product select, #product texterea'),
        dataType: 'json',
        beforeSend: () => {},
        complete: () => {},
        success: addSuccessHandler,
        error: (xhr, ajaxOptions, thrownError) => {
            console.error(`${thrownError}\r\n${xhr.responseText}`)
        }
    })
}

const addSuccessHandler = json => {
    $('.alert-dismissible, .text-danger').remove()
    $('.form-control').removeClass('is-invalid')

    if (json['error']) {

        if (json['error']['option']) {

            for (code in json['error']['option']) {
                const el = $('#input-option' + code.replace('_', '-'))

                if (el.parent().hasClass('input-group')) {
                    el.parent().after(`<div class="text-danger">${json['erorr']['option'][code]}</div>`)
                } else {
                    el.after(`<div class="text-danger">${json['error']['option'][code]}</div>`)
                }
            }
        }

        if (json['error']['reccurring']) {
            $('select[name=recuring_id]').after(`<div class="text-danger">${json['error']['recurring']}</div>`)
        }

        if (json['error']['quantity']) {
            $('select[name=quantity]').after(`<div class="text-danger">${json['error']['quantity']}</div>`)
        }

        // Highlight any found errors
        $('.text-danger').each(function() {
            const el = $(this).parent().find(':input')

            if (el.hasClass('form-control')) {
                el.addClass('is-invalid')
            }
        })

        //$('.invalid-tooltip').show();
    }

    if (json['success']) {
        const html = `
            <div class="toast"id="toast">
                <div class="toast-header">
                    <strong class="mr-auto">
                        <i class="fas fa-shopping-cart"></i>Shopping Cart
                    </strong>
                    <button class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                </div>
                <div class="toast-body">${json['success']}</div>
            </div>
        `

        $('body').append(html)

        $('#toast').toast({ delay: 3000 })
        $('#toast').toast('show')

        //Update cart
        $('#cart').parent().load('index.php?route=common/cart/info')
    }
}

$('#button-cart').on('click', addButtonClickHandler)

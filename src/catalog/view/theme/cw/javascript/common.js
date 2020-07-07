;(function ($) {
    const common = (function () {
        return {
            init: function () {
                this.toasts.init()
                this.cart.init()
                this.modals.init()
                this.product.init()
                this.menu.init()
                this.search.init()
                this.wishlist.init()
            },

            //Menu
            menu: {
                init: function () {
                    $('.menu-item')
                        .on('mouseenter', this.show)
                        .on('mouseleave', this.hide)
                },
                show: function () {
                    $(this).addClass('menu-item_active').find('.submenu').show()
                },
                hide: function () {
                    $(this)
                        .removeClass('menu-item_active')
                        .find('.submenu')
                        .hide()
                }
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

            //Modals
            modals: {
                init: function () {
                    this.callback.init()
                    this.auth.init()
                },

                //Callback modal
                callback: {
                    init: function () {
                        $('#callbackForm').on('submit', this.onSubmit)
                    },
                    onSubmit: (e) => {
                        e.preventDefault()

                        const callbackModal = $('#callbackModal')

                        callbackModal
                            .find('.modal-body, .modal-footer')
                            .remove()

                        const html = `<div class="modal-message">Благодарим за проявленный интерес, наш менеджер свяжется с вами в ближайшее время</div>`

                        callbackModal
                            .find('.modal-messages')
                            .empty()
                            .append(html)
                    }
                },

                //Auth modal
                auth: {
                    init: function () {
                        $('#authForm').on('submit', this.handleSubmit)
                    },
                    handleSubmit: function (event) {
                        event.preventDefault()

                        $.ajax({
                            url: 'index.php?route=account/quick_login',
                            type: 'post',
                            data: $('#authForm input'),
                            dataType: 'json',
                            beforeSend: () => {
                                /** ... */
                            },
                            success: (json) => {
                                if (!json.warning) {
                                    location.reload()
                                } else {
                                    const html = `<div class="modal-message">${json.warning}</div>`

                                    $('#authModal')
                                        .find('.modal-messages')
                                        .empty()
                                        .append(html)
                                }
                            },
                            error: ajaxErrorHandler
                        })
                    }
                },

                //Quick order modal
                quickOrder: {}
            },

            //Cart
            cart: {
                init: function () {
                    window.cart = {
                        add: (productId, quantity) =>
                            this.add(productId, quantity),
                        remove: (key) => this.remove(key),
                        reload: () => this.reload()
                    }
                },
                add: function (productId, quantity) {
                    quantity = quantity || 1

                    $.ajax({
                        url: 'index.php?route=checkout/cart/add',
                        type: 'post',
                        data: `product_id=${productId}&quantity=${quantity}`,
                        dataType: 'json',
                        beforeSend: () => {},
                        complete: () => {},
                        success: (json) => {
                            if (json['redirect']) {
                                location = json['redirect']
                            }

                            if (json['success']) {
                                toasts.push(json['success'])
                                this.reload()
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
                        success: this.reload,
                        error: ajaxErrorHandler
                    })
                },
                reload: () => {
                    $.get('index.php?route=common/cart/info', (html) => {
                        $('#widgetCart').replaceWith(html)
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
                add: function (productId) {
                    $.ajax({
                        url: 'index.php?route=account/wishlist/add',
                        type: 'post',
                        data: `product_id=${productId}`,
                        dataType: 'json',
                        context: this,
                        beforeSend: () => {},
                        complete: () => {},
                        success: function (json) {
                            if (json['redirect']) {
                                location = json['redirect']
                            }

                            if (json['success']) {
                                toasts.push(json['success'])
                                this.update(json['total'])
                            }
                        },
                        error: ajaxErrorHandler
                    })
                },
                update: (total) => {
                    $('#badgeWishlist').html(total)
                }
            },

            //Voushcer
            //TODO: ...
            voucher: {},

            //Compare
            //TODO: ...
            compare: {},

            //Product
            product: {
                init: function () {
                    this.slider()
                    this.buttonCart.init()
                    this.tabs.init()
                },
                slider: function () {
                    $('.product-photo-slider').each(function () {
                        $(this).slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: false,
                            autoplay: false,
                            dots: false,
                            asNavFor: '.product-photo-carousel',
                            infinite: false
                        })

                        $('.product-photo-carousel').slick({
                            vertical: true,
                            slidesToShow: 5,
                            slidesToScroll:
                                $('.product-photo-carousel__item').length > 5
                                    ? 1
                                    : 5,
                            asNavFor: '.product-photo-slider',
                            dots: false,
                            focusOnSelect: true,
                            infinite: false,
                            autoplay: false,
                            verticalSwiping: true
                        })
                    })
                },
                buttonCart: {
                    init: function () {
                        $('#buttonCart').click(() => this.clickHandler())
                    },
                    clickHandler: function () {
                        $.ajax({
                            url: 'index.php?route=checkout/cart/add',
                            type: 'post',
                            data: $(
                                `#product input[type=text],
                                 #product input[type=hidden],
                                 #product input[type=radio]:checked,
                                 #product input[type=checkbox]:checked,
                                 #product select,
                                 #product texterea`
                            ),
                            dataType: 'json',
                            beforeSend: () => {},
                            complete: () => {},
                            success: (json) => this.ajaxResponseHandler(json),
                            error: ajaxErrorHandler
                        })
                    },
                    ajaxResponseHandler: (json) => {
                        $('.alert-dismissible, .text-danger').remove()
                        $('.form-control').removeClass('is-invalid')

                        if (json['error']) {
                            if (json['error']['option']) {
                                for (let code in json['error']['option']) {
                                    const el = $(
                                        '#input-option' + code.replace('_', '-')
                                    )

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
                            toasts.push(json['success'])
                            cart.reload()
                        }
                    }
                },
                tabs: {
                    init: () => {
                        $('.tab').click(function () {
                            const tabId = $(this).attr('data-tab')

                            $('.tab').removeClass('tab_current')
                            $('.tab-content').removeClass('tab-content_current')

                            $(this).addClass('tab_current')
                            $(`#${tabId}`).addClass('tab-content_current')
                        })
                    }
                }
            },

            //Search
            search: {
                init: function () {
                    this.liveSearch(liveSearchOptions)
                    this.searchBox()
                },
                searchBox: function () {
                    $('#buttonSearch').on('click', () => {
                        $('.search-box').show().find('input').focus()
                    })

                    $('.search-box').focusout(() => {
                        $('.search-box').hide()
                    })
                },
                liveSearch: function (options) {
                    // prettier-ignore
                    const live_search = {
                        selector: "#search input[name='search']",
                        text_no_matches: options.text_empty,
                        height: '50px'
                    }

                    $(live_search.selector).autocomplete({
                        source: function (request, response) {
                            const filter_name = $(live_search.selector).val()
                            const cat_id = 0
                            const live_search_min_length =
                                options.module_live_search_min_length

                            if (filter_name.length < live_search_min_length) {
                                $('.live-search').css('display', 'none')
                            } else {
                                let live_search_href =
                                    'index.php?route=extension/module/live_search&filter_name='
                                let all_search_href =
                                    'index.php?route=product/search&search='
                                if (cat_id > 0) {
                                    live_search_href +=
                                        encodeURIComponent(filter_name) +
                                        '&cat_id=' +
                                        Math.abs(cat_id)
                                    all_search_href =
                                        all_search_href +
                                        encodeURIComponent(filter_name) +
                                        '&category_id=' +
                                        Math.abs(cat_id)
                                } else {
                                    live_search_href += encodeURIComponent(
                                        filter_name
                                    )
                                    all_search_href += encodeURIComponent(
                                        filter_name
                                    )
                                }

                                let html = `
                                    <li>
                                        <img class="loading" src="catalog/view/theme/cw/image/ajax-loader.gif" />
                                    </li>`

                                $('.live-search ul').html(html)
                                $('.live-search').css('display', 'block')

                                $.ajax({
                                    url: live_search_href,
                                    dataType: 'json',
                                    success: function (result) {
                                        const products = result.products

                                        $('.live-search ul li').remove()
                                        $('.result-text').html('')

                                        if (!$.isEmptyObject(products)) {
                                            const show_image = Number(
                                                options.module_live_search_show_image
                                            )
                                            const show_price = Number(
                                                options.module_live_search_show_price
                                            )
                                            const show_description = Number(
                                                options.module_live_search_show_description
                                            )
                                            const show_add_button = Number(
                                                options.module_live_search_show_add_button
                                            )

                                            $('.result-text').html(
                                                `<a href="${all_search_href}" class="view-all-results">
                                                    ${options.text_view_all_results}(${result.total})
                                                </a>`
                                            )

                                            $.each(products, function (
                                                index,
                                                product
                                            ) {
                                                let html = '<li>'

                                                // show_add_button
                                                if (show_add_button === 1) {
                                                    html += `
                                                        <div class="product-add-cart">
                                                            <a href="javascript:;" onclick="cart.add('${product.product_id}', '${product.minimum}')" class="button button_view_plain">
                                                                +
                                                            </a>
                                                        </div>`
                                                }
                                                html += `
                                                    <div>
                                                        <a href="${product.url}" title="${product.name}">
                                                `

                                                // show image
                                                if (
                                                    product.image &&
                                                    show_image === 1
                                                ) {
                                                    html += `<div class="product-image"><img alt="${product.name}" src="${product.image}" /></div>`
                                                }

                                                // show name & extra_info
                                                html += `<div class="product-name">${product.name}`

                                                if (show_description === 1) {
                                                    html += `<p>${product.extra_info}</p>`
                                                }

                                                html += '</div>'

                                                // show price & special price
                                                if (show_price === 1) {
                                                    if (product.special) {
                                                        html += `
                                                            <div class="product-price">
                                                                <span class="special">${product.price}</span>
                                                                <span class="price">${product.special}</span>
                                                            </div>`
                                                    } else {
                                                        html += `
                                                            <div class="product-price">
                                                                <span class="price">${product.price}</span>
                                                            </div>`
                                                    }
                                                }
                                                html += '</a></div></li>'

                                                $('.live-search ul').append(
                                                    html
                                                )
                                            })
                                        } else {
                                            let html = `<li>${live_search.text_no_matches}</li>`

                                            $('.live-search ul').html(html)
                                        }

                                        // $('.live-search ul li').css('height',live_search.height);
                                        $('.live-search').css(
                                            'display',
                                            'block'
                                        )

                                        return false
                                    }
                                })
                            }
                        },
                        select: function (product) {
                            $(live_search.selector).val(product.name)
                        }
                    })

                    $(document).bind('mouseup touchend', function (e) {
                        var container = $('.live-search')
                        if (
                            !container.is(e.target) &&
                            container.has(e.target).length === 0
                        ) {
                            container.hide()
                        }
                    })
                }
            }
        }
    })()
    common.init()
})(jQuery)

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

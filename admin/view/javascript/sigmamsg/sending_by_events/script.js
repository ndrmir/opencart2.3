document.addEventListener('DOMContentLoaded', async function () {

    var statuses_list = await getData(url, token, "get_statuses_list", 'sigmamsg/sending_by_events');
    var senderNames = await getData(url, token, "getSenderNames", 'sigmamsg/mass_sending');

    var current_open_event = [];
    var admin_numbers = [];
    set_statuses_list(statuses_list);

    function set_statuses_list(statuses_list) {
        var $ul = document.querySelector(".custom_menu .change_order_status ul");
        statuses_list.forEach((status) => {
            var $li = document.createElement("li");
            $li.setAttribute("name", status.id)
            $li.innerHTML = "<label>" + status.name + "<input type='radio' value='" + status.id + "' name='event_type' ></label>";
            $ul.appendChild($li);
        })
    }

    $(".custom_menu li .parent").on("click", function () {
        var $ul = $(this)[0].parentElement.querySelector("ul");

        if ($ul.style.display != 'none') {
            $ul.style.display = 'none';
            $(this)[0].querySelector(".menu_switch").className = "glyphicon glyphicon-menu-down menu_switch";
        } else {
            document.querySelectorAll(".custom_menu li ul").forEach((item) => {
                item.style.display = 'none';
                item.parentElement.querySelector(".parent .menu_switch").className = "glyphicon glyphicon-menu-down menu_switch";
            })
            $ul.style.display = 'block';
            $(this)[0].querySelector(".menu_switch").className = "glyphicon glyphicon-menu-right menu_switch";
        }
    });

    $(".sending_by_events__event__msg_body_type div label input[name='msg_type']").on('change', function () {
        var element = $(this)[0];
        document.querySelectorAll(".sending_by_events__event__msg_body_type>div").forEach((item) => {
            item.className = "col-lg-6 col-md-6 col-xs-6";
        })

        if (element.value == "customer") {
            document.querySelector(".sending_by_events__msg-preview").style.display = 'inline-block';
        } else {
            document.querySelector(".sending_by_events__msg-preview").style.display = 'none';
        }

        element.parentElement.parentElement.className = "col-lg-6 col-md-6 col-xs-6 active";

        document.querySelectorAll(".sending_by_events__event__msg_body_content>div").forEach((item) => {
            item.style.display = 'none';
        });

        document.querySelector("." + element.value + "_body").style.display = 'inline-block';
        document.querySelector(".sending_by_events__event__button-group").style.display = 'flex';
    })

    $("body").on("change", ".custom_menu li ul li label input[name='event_type']", async function () {
        var value = $(this)[0].value;

        document.querySelectorAll(".custom_menu li ul li").forEach((item) => {
            if (item.getAttribute("name") == value) {
                item.className = 'active';
            } else {
                item.className = '';
            }
        })

        if (findElement_by_id(statuses_list, value)) {
            var order_id = value;
            var event_type = "change_order_status";
        } else {
            var order_id = "null";
            var event_type = value;
        }

        current_open_event = await getEventData(url, token, order_id, event_type);

        set_event_body(current_open_event, event_type, order_id);

        if (event_type == 'out_of_product') {
            document.querySelector('.customer_body .sending_status .sending_customer_status label input').checked = false;
            document.querySelector(".out_of_product_option").style.display = 'block';
            document.querySelector('.sending_by_events__event__msg_body_type #customer_msg_type_div').style.display = 'none'
            $('.sending_by_events__event__msg_body_type div label .admin_type').click();
            document.querySelector('.sending_by_events__event__msg_body_type #admin_msg_type_div').className = "col-lg-12 col-md-12 col-xs-12 active";
        } else {
            document.querySelector(".out_of_product_option").style.display = 'none';
            document.querySelector('.sending_by_events__event__msg_body_type #customer_msg_type_div').style.display = 'block';
            document.querySelector('.sending_by_events__event__msg_body_type #admin_msg_type_div').className = "col-lg-6 col-md-6 col-xs-6";
        }

    })

    $('input[name="switch_display"]').on('change', function () {

        if (this.checked) {
            document.querySelector("." + this.value + "_msg_content").style.display = 'block';
            if (this.value == 'customer') {
                document.querySelector(".save_event_sendings_body .sending_by_events__msg-preview .preview__main-msg").style.display = 'block';
            }
        } else {
            if (this.value == 'customer') {
                document.querySelector(".save_event_sendings_body .sending_by_events__msg-preview .preview__main-msg").style.display = 'none';
            }
            document.querySelector("." + this.value + "_msg_content").style.display = 'none';
        }
    })

    function set_event_body(eventData, event_type, order_id) {
        clear_create_sendings_form();
        set_customer_msg_body(eventData, event_type, order_id);

        set_admin_msg_body(eventData.admin_msg_body, eventData.admin_msg_status, eventData.additional_settings)
    }

    function findElement(arr, id) {
        const element = arr.find((el) => el.id === id);
        if (element) {
            return element;
        } else {
            return false
        }
    }

    function set_admin_msg_body(admin_msg_body, admin_msg_status, additional_settings) {
        if (admin_msg_body) {

            var include = admin_msg_body.recipient.include;
            admin_numbers = include;
            var selected_item = document.querySelector(".admin_msg_content .admin_msg__includeAddresses div div div");

            include.forEach((phone) => {
                add_pill_in_sigma_input(phone, selected_item)
            })

            $(".admin_msg_content .sending_by_events__channels ." + admin_msg_body.type + "_checkbox").click();
            document.querySelector(".admin_msg_content .sending_by_events__senderName .senderName_list ").value = admin_msg_body.payload.sender;
            document.querySelector(".admin_msg_content .sending_by_events__msgText .msg_content").value = admin_msg_body.payload.text;

            var $details = document.querySelector(".admin_msg_content .sending_by_events__msgText .text_field_details")
            if (admin_msg_body.type == 'sms') {
                var calculate = calculateSmsStats(admin_msg_body.payload.text);
                $details.querySelector(".symbol_count").innerHTML = calculate.characters;
                $details.querySelector(".piece_count").innerHTML = calculate.segments;
            } else {
                var text_length = admin_msg_body.payload.text.length;
                if (text_length >= 1) {
                    $details.querySelector(".symbol_count").innerHTML = text_length;
                    $details.querySelector(".piece_count").innerHTML = Math.ceil(text_length / 1000);
                }
            }
        }
        if (additional_settings != null) {
            document.querySelector(".out_of_product_option .out_of_product_quantity input").value = additional_settings.count_product;
            document.querySelector(".out_of_product_option .sending_timeout select").value = additional_settings.notification_timeout;
        }
        set_sending_status(admin_msg_status, "admin");
    }

    function set_customer_msg_body(eventData, event_type, order_id) {

        var customer_msg_body = eventData.customer_msg_body;
        var customer_msg_status = eventData.customer_msg_status;
        if (event_type == 'new_customer') {
            var dropDown_content = '<li><a name="#{firstname}">Имя</a></li>' +
                '<li><a name="#{lastname}">Фамилия</a></li>' +
                '<li><a name="#{phone}">Телефон</a></li>' +
                '<li><a name="#{email}">E-mail</a></li>' +
                '<li><a name="#{city}">Город</a></li>' +
                '<li><a name="#{address_1}">Адрес 1</a></li>' +
                '<li><a name="#{address_2}">Адрес 2</a></li>' +
                '<li><a name="#{zone}">Область</a></li>' +
                '<li><a name="#{company}">Компания</a></li>'
        } else if (event_type == 'out_of_product') {
            var dropDown_content = '<li><a name="#{product}">Товар</a></li>' +
                '<li><a name="#{quantity}">Количество</a></li>'
        } else {
            var dropDown_content = '<li><a name="#{firstname}">Имя</a></li>' +
                '<li><a name="#{lastname}">Фамилия</a></li>' +
                '<li><a name="#{phone}">Телефон</a></li>' +
                '<li><a name="#{email}">E-mail</a></li>' +
                '<li><a name="#{city}">Город</a></li>' +
                '<li><a name="#{country}">Страна</a></li>' +
                '<li><a name="#{products}">Список товаров</a></li>' +
                '<li><a name="#{date_added}">Дата добавления</a></li>' +
                '<li><a name="#{date_modified}">Дата изменения</a></li>' +
                '<li><a name="#{total}">Сумма заказа</a></li>' +
                '<li><a name="#{order_id}">ID заказа</a></li>';
        }

        document.querySelector(".customer_body .customer_msg_content .sending_by_events__msgText .dropdown ul").innerHTML = dropDown_content;
        document.querySelector(".customer_body .sending_by_events__create-resend .create-resend__msg_conten-div .dropdown ul").innerHTML = dropDown_content;
        document.querySelector(".admin_body .admin_msg_content .sending_by_events__msgText .dropdown ul").innerHTML = dropDown_content;

        if (customer_msg_body) {
            $(".customer_msg_content .sending_by_events__channels ." + customer_msg_body.type + "_checkbox").click();

            document.querySelector(".customer_msg_content .sending_by_events__senderName .senderName_list ").value = customer_msg_body.payload.sender;
            document.querySelector(".customer_msg_content .sending_by_events__msgText .msg_content").value = customer_msg_body.payload.text;

            set_msg_preview(customer_msg_body.payload.sender, customer_msg_body.payload.text, customer_msg_body.type, ".preview__main-msg");

            var $details = document.querySelector(".customer_msg_content .sending_by_events__msgText .text_field_details")
            if (customer_msg_body.type == 'sms') {
                var calculate = calculateSmsStats(customer_msg_body.payload.text);
                $details.querySelector(".symbol_count").innerHTML = calculate.characters;
                $details.querySelector(".piece_count").innerHTML = calculate.segments;
            } else {
                var text_length = customer_msg_body.payload.text.length;
                if (text_length >= 1) {
                    $details.querySelector(".symbol_count").innerHTML = text_length;
                    $details.querySelector(".piece_count").innerHTML = Math.ceil(text_length / 1000);
                }
            }

            if (customer_msg_body.type == 'viber') {
                set_img_group_by_template(customer_msg_body, order_id, event_type);
            }

            set_fallbacks(customer_msg_body, order_id, event_type);
            set_sending_status(customer_msg_status, "customer");
        }
    }

    function set_fallbacks(customer_msg_body, order_id, event_type) {
        var fallbacks = customer_msg_body.fallbacks;
        if (fallbacks.length && fallbacks[0].payload) {
            fallbacks = fallbacks[0];

            $(".sending_by_events__add_cascade #add_cascade_input").click();
            $(".resend_channels ." + fallbacks.type + "_checkbox").click();

            document.querySelector(".create-resend__senderName .senderName_list ").value = fallbacks.payload.sender;
            document.querySelector(".create-resend__msg_conten-div .msg_content").value = fallbacks.payload.text;

            var $details = document.querySelector(".customer_msg_content .create-resend__msg_conten-div .text_field_details")
            if (fallbacks.type == 'sms') {
                var calculate = calculateSmsStats(fallbacks.payload.text);
                $details.querySelector(".symbol_count").innerHTML = calculate.characters;
                $details.querySelector(".piece_count").innerHTML = calculate.segments;
            } else {
                var text_length = fallbacks.payload.text.length;
                if (text_length >= 1) {
                    $details.querySelector(".symbol_count").innerHTML = text_length;
                    $details.querySelector(".piece_count").innerHTML = Math.ceil(text_length / 1000);
                }
            }

            if (fallbacks.type == 'viber') {
                set_fallbacks_img_group_by_template(customer_msg_body, order_id, event_type);
            }
        }
    }

    function set_sending_status(msg_status, type_status) {
        if (msg_status == '1') {
            document.querySelector('.' + type_status + '_body .sending_status div .switch input').checked = true;
            document.querySelector("." + type_status + "_msg_content").style.display = 'block';
        } else {
            document.querySelector('.' + type_status + '_body .sending_status div .switch input').checked = false;
            document.querySelector("." + type_status + "_msg_content").style.display = 'none';
        }
    }

    function clear_create_sendings_form() {
        document.querySelector(".sending_by_events__msg_body").style.display = 'block';
        clear_main_msg_preview(".preview__main-msg");
        admin_numbers = [];
        $('.customer_msg_content .sending_by_events__channels .check_block label .sms_checkbox').click();
        $('.customer_msg_content .resend_channels .check_block label .sms_checkbox').click();
        $('.admin_msg_content .sending_by_events__channels .check_block label .sms_checkbox').click();

        $('.sending_by_events__event__msg_body_type div label .customer_type').click();

        document.querySelector(".customer_msg_content textarea.msg_content").value = "";
        set_preview_img("", ".preview__main-msg");
        document.querySelector(".admin_msg_content textarea.msg_content").value = "";

        var admin_number_pills = document.querySelectorAll(".admin_msg_content .admin_msg__includeAddresses div .sigma_input div span");

        if (admin_number_pills.length) {
            admin_number_pills.forEach((pill) => {
                pill.remove();
            });
        }

        document.querySelector('.sending_by_events__messenger-button div .add_file_div .img_file').value = '';
        document.querySelector('.sending_by_events__messenger-button div .add_file_div .file_name').innerHTML = '';
        document.querySelector(".sending_by_events__messenger-button .add_file__img").style.display = 'none';
        document.querySelector(".sending_by_events__messenger-button .button_link").value = '';
        document.querySelector(".sending_by_events__messenger-button .button_describe").value = '';

        document.querySelector(".sending_by_events__create-resend").style.display = 'none';
        document.querySelector('.additional-settings .sending_by_events__add_cascade #add_cascade_input').checked = false;
        document.querySelector('.customer_body .sending_status .sending_customer_status label input').checked = false;
        document.querySelector('.customer_body .customer_msg_content ').style.display = "none";

        document.querySelector('.sending_by_events__create-resend div .add_file_div .img_file').value = '';
        document.querySelector('.sending_by_events__create-resend div .add_file_div .file_name').innerHTML = '';
        document.querySelector(".sending_by_events__create-resend .add_file__img").style.display = 'none';
        document.querySelector(".sending_by_events__create-resend").style.display = 'none';
        document.querySelector(".sending_by_events__create-resend .button_link").value = '';
        document.querySelector(".sending_by_events__create-resend .button_describe").value = '';

        set_preview_button("", "", ".preview__main-msg");

        document.querySelector('.sending_by_events__create-resend .msg_content').value = '';

        var $details = document.querySelectorAll(".text_field_details")
        $details.forEach(($item) => {
            $item.querySelector(".symbol_count").innerHTML = 0;
            $item.querySelector(".piece_count").innerHTML = 0;
        })
    }

    async function set_img_group_by_template(customer_msg_body, order_id, event_type) {
        var group_class = ".customer_msg_content .sending_by_events__messenger-button";
        var payload = customer_msg_body.payload;
        if (payload.image) {
            var $img = document.querySelector(group_class + " .add_file__img");
            var check_image = await check_img(payload.image);
            if (check_image.error != 404) {
                $img.setAttribute("src", "/admin/view/image/sigmamsg/upload/" + payload.image + ".jpg");
                set_preview_img(payload.image, ".preview__main-msg");
                $img.style.display = 'block';
                document.querySelector(group_class + " .file_name").innerHTML = payload.image;
                document.querySelector(group_class + " .file_name").setAttribute("name", payload.image);
            } else {
                var refresh_img = await refresh_image(url, token, payload.image, order_id, event_type, false);
                $img.setAttribute("src", "/admin/view/image/sigmamsg/upload/" + refresh_img + ".jpg");
                set_preview_img(refresh_img, ".preview__main-msg");
                $img.style.display = 'block';
                document.querySelector(group_class + " .file_name").innerHTML = refresh_img;
                document.querySelector(group_class + " .file_name").setAttribute("name", refresh_img);
            }
        }

        document.querySelector(group_class).style.display = 'block';
        document.querySelector(group_class + " .button_link").value = payload.button.url;
        document.querySelector(group_class + " .button_describe").value = payload.button.text;

        set_preview_button(payload.button.text, payload.button.url, ".preview__main-msg");
    }

    async function set_fallbacks_img_group_by_template(customer_msg_body, order_id, event_type) {
        var group_class = ".customer_msg_content .sending_by_events__create-resend .create-resend__messenger-button";
        var payload = customer_msg_body.fallbacks[0].payload;
        if (payload.image) {
            var $img = document.querySelector(group_class + " .add_file__img");
            var check_image = await check_img(payload.image);
            if (check_image.error != 404) {
                $img.setAttribute("src", "/admin/view/image/sigmamsg/upload/" + payload.image + ".jpg");
                $img.style.display = 'block';
                document.querySelector(group_class + " .file_name").innerHTML = payload.image;
                document.querySelector(group_class + " .file_name").setAttribute("name", payload.image);
            } else {
                var refresh_img = await refresh_image(url, token, payload.image, order_id, event_type, true);
                $img.setAttribute("src", "/admin/view/image/sigmamsg/upload/" + refresh_img + ".jpg");
                $img.style.display = 'block';
                document.querySelector(group_class + " .file_name").innerHTML = refresh_img;
                document.querySelector(group_class + " .file_name").setAttribute("name", refresh_img);
            }
        }
        document.querySelector(group_class).style.display = 'block';
        document.querySelector(group_class + " .button_link").value = payload.button.url;
        document.querySelector(group_class + " .button_describe").value = payload.button.text;

    }


    $("body").on("click", ".dropdown .dropdown-menu li a", function () {

        var element = $(this)[0];

        var text_area = element.parentElement.parentElement.parentElement.parentElement.querySelector('.msg_content');
        var text = text_area.value;

        var first_part = text.substring(0, text_area.selectionStart) + element.getAttribute("name");
        var last_part = text.substring(text_area.selectionStart);

        text_area.value = first_part + last_part;

        text_area.focus();
    });

    $("body").on('change', ".customer_msg_content .sending_by_events__channels .check_block input[name='channels[]']", function () {
        var element = $(this)[0]

        if (element.value == 'viber') {
            document.querySelector(".customer_msg_content .sending_by_events__messenger-button").style.display = 'flex';
        } else {
            document.querySelector(".customer_msg_content .sending_by_events__messenger-button").style.display = 'none'
            document.querySelector('.sending_by_events__messenger-button div .add_file_div .img_file').value = '';
            document.querySelector('.sending_by_events__messenger-button div .add_file_div .add_file__img').setAttribute('src', '#');
            document.querySelector('.sending_by_events__messenger-button div .add_file_div .add_file__img').style.display = 'none';
            document.querySelector('.sending_by_events__messenger-button div .add_file_div .file_name').innerHTML = '';
            document.querySelector('.sending_by_events__messenger-button .button_text_field .button_link').value = '';
            document.querySelector('.sending_by_events__messenger-button .button_text_field .button_describe').value = '';
        }

        set_main_senderNames(senderNames, element.value);
    });

    function set_main_senderNames(senderNames, type_channel) {
        var $select = document.querySelector(".customer_msg_content .sending_by_events__senderName .senderName_list");
        $select.innerHTML = '<option selected value="">Выбрать</option>';
        var set_value = false;
        senderNames.forEach((item) => {
            if (item.type == type_channel && item.moderation == "approved") {
                let option = document.createElement('option');
                option.value = item.name;
                option.innerHTML = item.name;
                $select.append(option);
                if (!set_value) {
                    $select.value = item.name;

                    set_preview_channelType(item.type, ".preview__main-msg");
                    set_main_preview_sendername(item.name.substr(0, 1).toUpperCase(), item.name.toUpperCase(), ".preview__main-msg");
                    set_value = true;
                }
            }
        })
    }

    $("body").on('change', "input[name='resend_channels[]']", function () {
        var element = $(this)[0]

        if (element.value == 'viber') {
            document.querySelector(".create-resend__msg_conten-div .create-resend__messenger-button").style.display = 'block'
        } else {
            document.querySelector(".create-resend__msg_conten-div .create-resend__messenger-button").style.display = 'none'

            document.querySelector('.create-resend__messenger-button div .add_file_div .img_file').value = '';
            document.querySelector('.create-resend__messenger-button div .add_file_div .add_file__img').setAttribute('src', '#');
            document.querySelector('.create-resend__messenger-button div .add_file_div .add_file__img').style.display = 'none';
            document.querySelector('.create-resend__messenger-button div .add_file_div .file_name').innerHTML = '';
            document.querySelector('.create-resend__messenger-button .button_text_field .button_link').value = '';
            document.querySelector('.create-resend__messenger-button .button_text_field .button_describe').value = '';
        }


        set_cascade_senderNames(senderNames, element.value)
    });

    function set_cascade_senderNames(senderNames, type_channel) {
        var $select = document.querySelector(".customer_msg_content .create-resend__senderName .senderName_list");
        $select.innerHTML = '<option selected value="">Выбрать</option>';
        var set_value = false;
        senderNames.forEach((item) => {
            if (item.type == type_channel && item.moderation == "approved") {
                let option = document.createElement('option');
                option.value = item.name;
                option.innerHTML = item.name;
                $select.append(option);
                if (!set_value) {
                    $select.value = item.name;
                    set_value = true;
                }
            }
        })
    }

    $("body").on('change', "input[name='admin_channels[]']", function () {
        var element = $(this)[0]
        var $select = document.querySelector(".admin_msg_content .sending_by_events__senderName .senderName_list");
        set_senderNames(senderNames, element.value, $select)
    });

    $(".customer_msg_content .sending_by_events__msgText .img_file").on('change', function () {
        var $input = $(this)[0];

        if ($input.files && $input.files[0]) {
            var file_name = $input.value.split(/\\/)[2];
            document.querySelector(".sending_by_events__messenger-button .add_file__img").style.display = 'block';
            var $span = document.querySelector(".sending_by_events__messenger-button .file_name")
            var $img = document.querySelector('.sending_by_events__messenger-button div .add_file_div .add_file__img');
            var $span = document.querySelector(".sending_by_events__messenger-button .file_name");
            set_img($input, $img, $span, file_name)
            set_main_img_by_input($input);
        }
    });

    $(".customer_msg_content .sending_by_events__create-resend .img_file").on('change', function () {
        var $input = $(this)[0];
        var file_name = event.currentTarget.value.split(/\\/)[2];
        if ($input.files && $input.files[0]) {
            var $img = document.querySelector(".create-resend__messenger-button .add_file__img");
            var $span = document.querySelector(".create-resend__messenger-button .file_name");
            set_img($input, $img, $span, file_name);
        }
    });

    $(".sigma_input#address").click(() => {
        var element = $(this)[0];
        $(element).find(".admin_msg__includeAddresses div div div input").focus()
    })

    $(".admin_msg__includeAddresses div div div input").on("focusout", function () {
        var phone = validate_phonNum($(this)[0].value, admin_numbers);
        if (phone) {
            admin_numbers.push(phone);
            var selected_item = $(this)[0].parentElement;
            add_pill_in_sigma_input(phone, selected_item)
        }
        $(this)[0].value = '';
    })

    $("body").on("keydown", ".admin_msg__includeAddresses div div div input", function (e) {
        if (e.keyCode === 13) {
            var phone = validate_phonNum($(this)[0].value, admin_numbers);
            if (phone) {
                admin_numbers.push(phone);
                var selected_item = $(this)[0].parentElement;
                add_pill_in_sigma_input(phone, selected_item)
            }
            $(this)[0].value = '';
        }
    })

    $("body").on("click", ".del_item", function () {
        var span = $(this)[0].parentElement;
        var phone = span.getAttribute('name');
        var selected_item = $(this)[0].parentElement.parentElement;
        admin_numbers.splice(admin_numbers.indexOf(phone), 1);
        selected_item.querySelector("span[name='" + phone + "']").remove();
    });

    function validate_phonNum(phone, admin_numbers) {
        if (phone.match(/(\+[7|8]|[7|8])([8|9][0-9]{9})\b/)) {
            phone = phone.replace(/\b([7|8])(?=[8|9][0-9]{9})/, "+7");
            if (admin_numbers.indexOf(phone) == -1) {
                return phone;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    function add_pill_in_sigma_input(phone, selected_item) {
        let span = document.createElement('span');
        span.setAttribute('name', phone);
        span.innerHTML = phone + "<small class='del_item' >x</small>";
        $(selected_item).prepend(span);
    }

    $("#add_cascade_input").click(function () {
        if ($(this)[0].checked) {
            document.querySelector(".sending_by_events__create-resend").style.display = 'block';
        } else {
            document.querySelector(".sending_by_events__create-resend").style.display = 'none';
        }
    });

    $(" .sending_by_events__event__msg_body_content .sending_by_events__event__button-group .save_event").on("click", async () => {

        var event_type = document.querySelector('.sending_by_events__event-type-menu .custom_menu li ul li label input[name="event_type"]:checked').value;


        if (document.querySelector('.customer_body .sending_status .sending_customer_status label input').checked) {

            var sender = document.querySelector('.customer_msg_content .sending_by_events__senderName .senderName_list').value;

            var text = document.querySelector('.customer_msg_content .sending_by_events__msgText .msg_content').value;

            if (document.querySelector(".customer_msg_content .sending_by_events__msgText .translit_div .switch #translit").checked) {

                text = translit_words(text);

            }

            var channel_type = document.querySelector('.customer_msg_content .sending_by_events__channels .check_block input[name="channels[]"]:checked').value;

            var customer_event_status = 1;

            if (!validation_body_fields(sender, text)) {
                return false;
            }

            var customer_msg_body = await make_customer_body(channel_type, sender, text);

            if (!customer_msg_body) {
                return false;
            }


        } else {
            var customer_event_status = 0;
            var customer_msg_body = null;
        }

        if (findElement_by_id(statuses_list, event_type)) {
            var order_status_id = event_type;
            var event_type = "change_order_status";
        } else {
            var order_status_id = "null";
        }

        if (document.querySelector('.admin_body .sending_status .sending_admin_status label input').checked) {
            var admin_event_status = 1;

            var admin_sender = document.querySelector('.admin_msg_content .sending_by_events__senderName .senderName_list').value
            var admin_text = document.querySelector('.admin_msg_content .sending_by_events__msgText .msg_content').value;
            var admin_channel_type = document.querySelector('.admin_msg_content .sending_by_events__channels .check_block input[name="admin_channels[]"]:checked').value;

            if (!validation_body_fields(admin_sender, admin_text)) {
                return false;
            }

            if (!admin_numbers.length) {
                alert("Введите не менее одного номера для отправки сообщения администратору, либо отключите отправку сообщения для администратора!");
                return false;
            }

            var admin_msg_body = await make_admin_body(admin_sender, admin_text, admin_channel_type, admin_numbers);

        } else {
            var admin_event_status = 0;
            var admin_msg_body = null;
        }

        var additional_settings = null;


        if (event_type == "out_of_product") {
            var count_product = document.querySelector(".out_of_product_option .out_of_product_quantity input").value;
            var notification_timeout = document.querySelector(".out_of_product_option .sending_timeout select").value;
            additional_settings = {count_product: count_product, notification_timeout: notification_timeout};
        }

        var body = {
            customer_msg_body: customer_msg_body,
            admin_msg_body: admin_msg_body,
            order_status_id: order_status_id,
            event_type: event_type,
            customer_event_status: customer_event_status,
            admin_event_status: admin_event_status,
            additional_settings: additional_settings
        };

        var change_event_data = await push_data(url, token, body, "change_event_data");
        alert(change_event_data.message);
    })

    async function make_admin_body(admin_sender, admin_text, admin_channel_type, admin_numbers) {

        var body = {
            "fallbacks": {},
            "payload": {
                "sender": admin_sender,
                "text": admin_text
            },
            "recipient": {'include': admin_numbers},
            "schedule": {'delay': 0},
            'type': admin_channel_type
        }
        return body;
    }

    async function make_customer_body(type, sender, text) {

        var payload = await create_payload(type, sender, text, ".customer_body");
        var fallbacks = [];

        if (document.querySelector(".customer_body .additional-settings .sending_by_events__add_cascade .switch #add_cascade_input").checked) {
            var fall = await create_fallbacks();

            if (fall == false) {
                return false
            }
            fallbacks.push(fall);
        }

        var body = {
            "fallbacks": fallbacks,
            "payload": payload,
            "recipient": {include: ''},
            "schedule": {'delay': 0},
            'type': type
        }

        return body;

    }

    async function create_payload(type, sender, text, parent_class) {
        if (type == 'viber') {
            var file = document.querySelector(parent_class + " .img_file").files;
            var url = document.querySelector(parent_class + " .button_link").value;
            var button_text = document.querySelector(parent_class + " .button_describe").value;
            var image = '';

            if (file.length != 0) {

                var file_name = file[0]['name'];
                var data = new FormData();

                $.each(file, function (key, value) {
                    data.append("file", value);
                });

                image = await upload_file(data, token);
            } else {
                image = document.querySelector(parent_class + " .file_name").getAttribute("name");
            }

            if (image != "undefined" && image != null && image != undefined && image != "null") {
                var payload = {
                    'button':
                        {
                            'text': button_text,
                            'url': url
                        },
                    'image': image,
                    "sender": sender,
                    "text": text
                }

            } else {
                var payload = {
                    'button':
                        {
                            'text': button_text,
                            'url': url
                        },
                    "sender": sender,
                    "text": text
                }
            }


        } else {
            var payload = {
                "sender": sender,
                "text": text
            }
        }
        return payload;
    }

    async function upload_file(data, token) {
        var title = '';
        await $.ajax({
            url: url + "?" + new URLSearchParams({
                route: 'sigmamsg/sending_by_events',
                token: token,
                method: 'upload_file'
            }),
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: (res, status) => {
                title = res.title;
            }
        });
        return title;
    }

    function findElement_by_id(arr, id) {
        const element = arr.find((el) => el.id === id);
        if (element) {
            return element;
        } else {
            return false
        }
    }

    async function create_fallbacks() {

        var cascade_sendername = document.querySelector('.sending_by_events__create-resend .create-resend__senderName div .senderName_list').value;
        var cascade_text = document.querySelector('.sending_by_events__create-resend .msg_content').value;

        if (document.querySelector(".customer_msg_content .sending_by_events__create-resend .create-resend__msg_conten-div .translit_div .switch #translit").checked) {
            cascade_text = translit_words(cascade_text);
        }

        var cascade_type = document.querySelector('.sending_by_events__create-resend .resend_channels .check_block input[name="resend_channels[]"]:checked').value;

        if (!validation_cascade(cascade_sendername, cascade_text)) {
            return false;
        }

        var cascade_payload = await create_payload(cascade_type, cascade_sendername, cascade_text, ".sending_by_events__create-resend");

        return {
            "$options": {
                "onIncomingPayload": {"text": ""},
                "onStatus": ["failed"],
                "onTimeout": {
                    "except": ['delivered', "seen"],
                    "timeout": 50
                }
            },
            "payload": cascade_payload,
            "type": cascade_type
        }
    }

    function validation_cascade(sendername, text) {
        if (document.querySelector("#add_cascade_input").checked) {
            if (!sendername || sendername == '') {
                alert("Вы не выбрали имя отправителя для Переотправки")
                return false;
            }
            if (!text) {
                alert("Введите текст сообщения для Переотправки")
                return false;
            }
        }
        return true;
    }

    function validation_body_fields(sender_name, text) {

        if (!sender_name) {
            alert("Вы не выбрали имя отправителя")
            return false;
        }

        if (!text) {
            alert("Введите текст сообщения")
            return false;
        }
        return true;
    }

    function set_img($input, $img, $span, file_name) {
        $img.style.display = 'block';
        $span.innerHTML = file_name;
        var reader = new FileReader();
        reader.onload = function (e) {
            $img.setAttribute("src", e.target.result);
        };
        reader.readAsDataURL($input.files[0]);
    };

    function set_senderNames(senderNames, type_channel, $select) {
        $select.innerHTML = '<option selected value="">Выбрать</option>';
        senderNames.forEach((item) => {
            if (item.type == type_channel && item.moderation == "approved") {
                let option = document.createElement('option');
                option.value = item.name;
                option.innerHTML = item.name;
                $select.append(option);
            }
        })

    };

    function show_resolved_channels() {
        user_data.RoutingGroups.forEach((channel) => {
            document.querySelectorAll("." + channel.type + "_label").forEach((channel_check) => {
                channel_check.style.display = 'flex'
            })
        })
    };

    setTimeout(() => {
        show_resolved_channels();
    }, 100);

})

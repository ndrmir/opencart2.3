document.addEventListener('DOMContentLoaded', async () => {

    var $includeBook = document.querySelector(".mass_sending__includeAddresses div div div");
    var $excludeBook = document.querySelector(".mass_sending__excludeAddresses div div div");
    var $senderNameList = document.querySelector(".mass_sending__senderName .senderName_list");

    var address_book = await getData(url, token, "getContactLists", 'sigmamsg/address_book');
    var senderNames = await getData(url, token, "getSenderNames", 'sigmamsg/mass_sending');
    var templates = await getData(url, token, "getTemplates", 'sigmamsg/mass_sending');
    var include_addresses = [];
    var exclude_addresses = [];
    var close_timeout;
    var last_opened_template = '';

    set_custom_menu(templates);

    function set_custom_menu(templates) {
        var $ul = document.querySelector(".custom_menu .mass_sending__template ul");
        templates.forEach((status) => {
            var $li = document.createElement("li");
            $li.setAttribute("name", status.id)
            $li.innerHTML = "<label>" + status.title + "<input type='radio' value='" + status.id + "' name='template_item' ></label>";
            $ul.prepend($li);
        })
    }

    set_address_list(address_book, '.mass_sending__includeAddresses .include_addresses', "include_item");
    set_address_list(address_book, '.mass_sending__excludeAddresses .exclude_addresses', "exclude_item");

    $(".sigma_input#address").click((event) => {
        const screenWidth = window.screen.width
            clearTimeout(close_timeout);
            var element = event.currentTarget;
            var dropList = element.querySelector(".drop-List");
            $(element).find(".add_phone").focus()
            close_dropLists();
            dropList.style.display = 'block';
    });

    $(document).on("click", ".template_menu_title", function(){
        var menu_switch = document.querySelector(".template_menu_title .menu_switch");
        if(menu_switch.className.match(/glyphicon-menu-down/)){
            menu_switch.className = 'glyphicon glyphicon-menu-up menu_switch'
            document.querySelector(".mass_sending__template ul").style.display = "none";
        }else{
            menu_switch.className = 'glyphicon glyphicon-menu-down menu_switch'
            document.querySelector(".mass_sending__template ul").style.display = "block";
        }
    })

    $("body").on("focusout", ".add_phone", function () {
        close_timeout = setTimeout(() => {
            var sigma_input = $(this)[0].parentElement.parentElement;
            var dropList = sigma_input.querySelector(".drop-List");
            var selected_item = sigma_input.querySelector(".selected_item");
            var value = validate_phonNum($(this)[0].value, exclude_addresses, include_addresses);
            if (value) {
                if ($(this)[0].getAttribute("name").match(/include/)) {
                    include_addresses.push(value);
                    add_pill_in_sigma_input(value, value, selected_item, "phone", "include");
                } else {
                    exclude_addresses.push(value);
                    add_pill_in_sigma_input(value, value, selected_item, "phone", "exclude");
                }
                $(this)[0].value = '';
            } else {
                $(this)[0].value = '';
            }
            dropList.style.display = 'none';
        }, 150)
    });

    $("body").on("keydown", ".add_phone", function (e) {
        if(e.keyCode === 13) {
            close_timeout = setTimeout(() => {
                var sigma_input = $(this)[0].parentElement.parentElement;
                var dropList = sigma_input.querySelector(".drop-List");
                var selected_item = sigma_input.querySelector(".selected_item");
                var value = validate_phonNum($(this)[0].value, exclude_addresses, include_addresses);
                if (value) {
                    if ($(this)[0].getAttribute("name").match(/include/)) {
                        include_addresses.push(value);
                        add_pill_in_sigma_input(value, value, selected_item, "phone", "include");
                    } else {
                        exclude_addresses.push(value);
                        add_pill_in_sigma_input(value, value, selected_item, "phone", "exclude");
                    }
                    $(this)[0].value = '';
                } else {
                    $(this)[0].value = '';
                }
                dropList.style.display = 'none';
            }, 150)
        }
    });

    $("body").on('click', '.book_check', function () {
        clearTimeout(close_timeout);
        var element = $(this)[0];
        var sigma_input = element.parentElement.parentElement.parentElement.parentElement;
        var selected_item = sigma_input.querySelector(".selected_item");
        var dropList = sigma_input.querySelector(".drop-List");
        var boock_id = element.getAttribute('name');
        var boock_name = element.id;

        if (element.checked) {
            if (exclude_addresses.indexOf(boock_id) == -1 && include_addresses.indexOf(boock_id) == -1) {
                if (element.parentElement.className.match(/include_item/)) {
                    include_addresses.push(boock_id);
                    add_pill_in_sigma_input(boock_id, boock_name, selected_item, "book", "include")
                } else {
                    exclude_addresses.push(boock_id);
                    add_pill_in_sigma_input(boock_id, boock_name, selected_item, "book", "exclude")
                }
            } else {
                event.preventDefault();
            }
        } else {

            if (element.parentElement.className.match(/include_item/)) {
                include_addresses.splice(include_addresses.indexOf(boock_id), 1);
                delete_book_input(dropList, selected_item, boock_id)
            } else {
                exclude_addresses.splice(exclude_addresses.indexOf(boock_id), 1);
                delete_book_input(dropList, selected_item, boock_id)
            }

        }
    });

    function add_pill_in_sigma_input(value1, value2, selected_item, item_type, adress_type) {
        let span = document.createElement('span');
        span.id = adress_type;
        span.setAttribute('name', value1);
        span.className = item_type;
        span.innerHTML = value2 + "<small class='del_book' >x</small>";
        $(selected_item).prepend(span);
    }

    function validate_phonNum(phone, exclude_addresses, include_addresses) {
        if (phone.match(/(\+[7|8]|[7|8])([8|9][0-9]{9})\b/)) {
            phone = phone.replace(/\b([7|8])(?=[8|9][0-9]{9})/, "+7");
            if (exclude_addresses.indexOf(phone) == -1 && include_addresses.indexOf(phone) == -1) {
                return phone;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    $("body").on("focusout", ".book_check", function () {
        close_timeout = setTimeout(() => {
            var element = $(this)[0].parentElement.parentElement.parentElement;
            element.style.display = 'none';
        }, 150)
    });

    $("body").on("click", ".del_book", function () {
        var span = $(this)[0].parentElement;
        var selected_item = $(this)[0].parentElement.parentElement;
        var id = span.getAttribute("name");

        if (span.id == 'include') {
            include_addresses.splice(include_addresses.indexOf(id), 1);
        } else {
            exclude_addresses.splice(exclude_addresses.indexOf(id), 1);
        }

        if (span.className == "book") {
            var dropList = span.parentElement.parentElement.querySelector(".drop-List");
        } else {
            var dropList = false;
        }
        delete_book_input(dropList, selected_item, id)

    });

    show_resolved_channels();

    set_senderLists();

    $('#datetimepicker1').datetimepicker();

    $("input#sending_time").on("change", function() {
        var element = $(this)[0];
        if (element.checked) {
            document.querySelector(".datetimepicker_div .form-group").style.display = 'block';
        } else {
            document.querySelector(".mass_sending__sendingTime .datetimepicker_div input").value = '';
            document.querySelector(".datetimepicker_div .form-group").style.display = 'none';
        }
    });

    $("body").on('change', 'input[name="template_item"]', function () {

        var id = $(this)[0].value;
        last_opened_template = id;

        clear_massSending_form();

        document.querySelector(".preview__main-msg").style.display = 'block';

        if(id){
            document.querySelectorAll(".custom_menu li ul li").forEach((item)=>{
                item.className = "";
            })
            $(this)[0].parentElement.parentElement.className = "active";

            if(id!='new_template'){
            var template = findElement(templates, id);
            include_addresses = template.recipient.include;
            exclude_addresses = template.recipient.exclude;
            set_template($excludeBook, $includeBook, address_book, template, senderNames);
            }
        }
    });

    $("body").on("click",".update_template", async function(){
        var sender = document.querySelector('.mass_sending__senderName .senderName_list').value
        var text = document.querySelector('.mass_sending__msgText .msg_content').value;
        var type = document.querySelector('.mass_sending__form .check_block input[name="channels[]"]:checked').value;


        if (!validation_mass_sending(include_addresses, sender, text)) {
            return false;
        }

        var body = await make_body(include_addresses , exclude_addresses, type, sender, text, 0);
        body["title"] = findElement(templates, last_opened_template).title;
        body["id"] = last_opened_template;

        var update_template = await push_data(url, token, body, "update_template");

        if (update_template.createdAt) {
            alert("шаблон успешно обновлен");
            document.querySelector(".create-template").style.display = 'none';
        } else {
            alert("Ошибка со стороны сервера");
        }

    })

    $(".create-template__form").submit(() => {
        var title = document.querySelector(".create-template__form .template_name").value;
        save_template(title, include_addresses, exclude_addresses);
    });

    $(".push_mass_sending").on("click", function() {
        if(!create_mass_sending(include_addresses, exclude_addresses)){
            return false;
        }
    });

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

    function clear_massSending_form() {
        include_addresses = [];
        exclude_addresses = [];

        document.querySelector(".mass_sending__sendingTime .switch input ").checked = false;
        document.querySelector(".mass_sending__sendingTime .datetimepicker_div .form-group").style.display = "none";
        document.querySelector(".mass_sending__sendingTime .datetimepicker_div input").value = '';

        document.querySelector(".mass_sending__form .senderName_list").value = "";
        document.querySelector(".mass_sending__form .msg_content").value = "";
        $excludeBook.innerHTML = '<input type="text" class="add_phone" name="exclude">';
        $includeBook.innerHTML = '<input type="text" class="add_phone" name="include" >';

        var include_check = document.querySelectorAll(".include_addresses .dropList_item label input");

        include_check.forEach((item) => {
            item.checked = false;
        })

        var exclude_check = document.querySelectorAll(".exclude_addresses .dropList_item label input");

        exclude_check.forEach((item) => {
            item.checked = false;
        })

        document.querySelector('.mass_sending__channels .check_block input.sms_checkbox').checked = true;

        clear_main_msg_preview(".preview__main-msg");

        set_senderLists();

        document.querySelector(".mass_sending__messenger-button").style.display = 'none';
        document.querySelector('.mass_sending__messenger-button div .add_file_div .img_file').value = '';
        document.querySelector('.mass_sending__messenger-button div .add_file_div .file_name').innerHTML = '';
        document.querySelector(".mass_sending__messenger-button .add_file__img").style.display = 'none';
        document.querySelector(".mass_sending__messenger-button .button_link").value = '';
        document.querySelector(".mass_sending__messenger-button .button_describe").value = '';

        document.querySelector(".mass_sending__create-resend").style.display = 'none';
        document.querySelector('.mass_sending__add_cascade #add_cascade_input').checked = false;
        document.querySelector('.mass_sending__create-resend .resend_channels .check_block input.sms_checkbox').checked = true;
        document.querySelector('.create-resend__messenger-button div .add_file_div .img_file').value = '';
        document.querySelector('.create-resend__messenger-button div .add_file_div .file_name').innerHTML = '';
        document.querySelector(".create-resend__messenger-button .add_file__img").style.display = 'none';
        document.querySelector(".create-resend__messenger-button").style.display = 'none';
        document.querySelector(".create-resend__messenger-button .button_link").value = '';
        document.querySelector(".create-resend__messenger-button .button_describe").value = '';

        document.querySelector('.mass_sending__button-group .update_template').style.display = 'none';
        document.querySelector('.mass_sending__button-group .delete_template').style.display = 'none';

        document.querySelector('.create-resend__senderName div .senderName_list').value = '';
        document.querySelector('.create-resend__msg_conten-div .msg_content').value = '';

        var $details = document.querySelectorAll(".text_field_details")
        $details.forEach(($item)=>{
            $item.querySelector(".symbol_count").innerHTML = 0;
            $item.querySelector(".piece_count").innerHTML = 0;
        })

    }

    $(".mass_sending__button-group .delete_template").on("click", async function(){
        if(last_opened_template){
            if(confirm("Удалить шаблон?")){
                var body = {"id": last_opened_template};
                var delete_template = await push_data(url, token, body, "delete_template");
                if(delete_template.error){
                    alert(delete_template.message)
                }else{
                    if (delete_template.id) {
                        document.querySelector(".custom_menu li ul li[name='" + delete_template.id + "']").remove();
                        clear_massSending_form();
                        alert("Шаблон успешно удален")
                    }
                }
            }
        }
    })

    async function create_mass_sending(include_addresses, exclude_addresses) {
        var sender = document.querySelector('.mass_sending__senderName .senderName_list').value
        var text = document.querySelector('.mass_sending__msgText .msg_content').value;
        var type = document.querySelector('.mass_sending__form .check_block input[name="channels[]"]:checked').value;

        if (!validation_mass_sending(include_addresses, sender, text)) {
            return false;
        }

        if (document.querySelector(".mass_sending__msg_body .mass_sending__msgText .translit_div .switch #translit").checked) {
            text = translit_words(text);
        }

        var delay = get_delay();
        var body = await make_body(include_addresses , exclude_addresses, type, sender, text, delay);
        var sendings = await push_data(url, token, body, "sendings");

        if(sendings.error){
            alert(sendings.message);
        }else{
            alert("Массовая рассылка успешно выполнена.");
        }

    }

    async function create_fallbacks() {

        var cascade_sendername = document.querySelector('.mass_sending__create-resend .create-resend__senderName div .senderName_list').value;
        var cascade_text = document.querySelector('.mass_sending__create-resend .create-resend__msg_conten-div .msg_content').value;
        var cascade_timeout = 50;
        var cascade_type = document.querySelector('.mass_sending__create-resend .resend_channels .check_block input[name="resend_channels[]"]:checked').value;

        if (document.querySelector(".mass_sending__msg_body div .mass_sending__create-resend .create-resend__msg_conten-div .translit_div .switch #translit").checked) {
            cascade_text = translit_words(cascade_text);
        }

        if (!validation_cascade(cascade_sendername, cascade_text, cascade_timeout)) {
            return false;
        }

        var cascade_payload = await create_payload(cascade_type, cascade_sendername, cascade_text, ".mass_sending__create-resend");

        return {
            "$options": {
                "onIncomingPayload": {"text": ""},
                "onStatus": ["failed"],
                "onTimeout": {
                    "except": ['delivered', "seen"],
                    "timeout": cascade_timeout
                }
            },
            "payload": cascade_payload,
            "type": cascade_type
        }
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
            }else{
                image = document.querySelector(parent_class + " .file_name").getAttribute("name");
            }
            if(image && image!='undefined'){
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
            }else{
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

    function get_delay() {
        if (!document.querySelector('.mass_sending__sendingTime .switch input').checked) {
            var delay = 0;
        } else {
            var sending_time = document.querySelector('.mass_sending__sendingTime .datetimepicker_div input').value;
            var split_date = sending_time.split(" ");
            var date = split_date[0].split(".");
            var time = split_date[1].split(":");

            var year = date[2];
            var month = date[1] - 1;
            var day = date[0];

            var hours = time[0];
            var min = time[1];
            var delay = (new Date(year, month, day, hours, min, 0)).toISOString();
        }
        return delay;
    }

    function delete_book_input(dropList, selected_item, value) {
        if (dropList) {
            var check_box = dropList.querySelector("input[name='" + value + "']");
            check_box.checked = false;
        }
        selected_item.querySelector("span[name='" + value + "']").remove();
    }

    function set_template($excludeBook, $includeBook, address_book, template, senderNames) {

        var selected_include = document.querySelector(".mass_sending__includeAddresses .selected_item");
        template.recipient.include.forEach((include) => {
            if (include.match(/(\+[7|8]|[7|8])([8|9][0-9]{9})\b/)) {
                add_pill_in_sigma_input(include, include, selected_include, "phone", "include");
            } else {
                var book = findElement(address_book, include);
                if(book){
                    document.querySelector(".mass_sending__includeAddresses .drop-List input[name='" + include + "']").checked = true;
                    add_pill_in_sigma_input(include, book.title, selected_include, "book", "include")
                }else{
                    include_addresses.splice(include_addresses.indexOf(include), 1);
                }
            }
        })

        var selected_exclude = document.querySelector(".mass_sending__excludeAddresses .selected_item");
        template.recipient.exclude.forEach((exclude) => {
            if (exclude.match(/(\+[7|8]|[7|8])([8|9][0-9]{9})\b/)) {
                add_pill_in_sigma_input(exclude, exclude, selected_exclude, "phone", "exclude");
            } else {
                var book = findElement(address_book, exclude);
                if(book){
                    document.querySelector(".mass_sending__excludeAddresses div div .drop-List div label input[name='" + exclude + "']").checked = true;
                    add_pill_in_sigma_input(exclude, book.title, selected_exclude, "book", "exclude")
                }else{
                    exclude_addresses.splice(exclude_addresses.indexOf(exclude), 1);
                }
            }
        })


        var $select = document.querySelector(".mass_sending__senderName div .senderName_list");
        set_senderNames(senderNames, template.type, $select);
        document.querySelector(".mass_sending__form ." + template.type + "_checkbox").checked = true;
        set_preview_channelType(template.type, ".preview__main-msg");
        document.querySelector(".mass_sending__form .senderName_list ").value = template.payload.sender;

        set_main_preview_sendername(template.payload.sender.substr(0, 1).toUpperCase(), template.payload.sender.toUpperCase(), ".preview__main-msg");
        document.querySelector(".mass_sending__msgText .msg_content").value = template.payload.text;

        document.querySelector(".mass_sending__msg-preview .preview__main-msg .msg_block .msg_contant .msg_txt p").innerHTML = template.payload.text;

        var $details = document.querySelector(".mass_sending__msgText .text_field_details")

        if(template.type == 'sms'){
            var calculate = calculateSmsStats(template.payload.text);
            $details.querySelector(".symbol_count").innerHTML = calculate.characters;
            $details.querySelector(".piece_count").innerHTML = calculate.segments;
        }else{
            var text_length = template.payload.text.length;
            if(text_length >=1 ){
                $details.querySelector(".symbol_count").innerHTML = text_length;
                $details.querySelector(".piece_count").innerHTML = Math.ceil(text_length/1000);
            }
        }



        document.querySelector('.mass_sending__button-group .update_template').style.display = 'block';
        document.querySelector('.mass_sending__button-group .delete_template').style.display = 'block';

        if (template.type == 'viber') {
            set_img_group_by_template(".mass_sending__messenger-button", template);

        }

        if (template.fallbacks.length) {
            $(".mass_sending__add_cascade #add_cascade_input").click();
            var cascade = template.fallbacks[0];

            $(".resend_channels ." + cascade.type + "_checkbox").click();
            document.querySelector(".create-resend__senderName .senderName_list ").value = cascade.payload.sender;
            document.querySelector(".create-resend__msg_conten-div .msg_content").value = cascade.payload.text;

            var $cascade_details = document.querySelector(".mass_sending__create-resend .text_field_details");
            if(cascade.type == 'sms'){
                var calculate = calculateSmsStats(cascade.payload.text);
                $cascade_details.querySelector(".symbol_count").innerHTML = calculate.characters;
                $cascade_details.querySelector(".piece_count").innerHTML = calculate.segments;
            }else{
                var text_length = cascade.payload.text.length;
                if(text_length >=1 ){
                    $cascade_details.querySelector(".symbol_count").innerHTML = text_length;
                    $cascade_details.querySelector(".piece_count").innerHTML = Math.ceil(text_length/1000);
                }
            }

            if (cascade.type == 'viber') {
                set_img_group_by_template(".create-resend__messenger-button", cascade);
            }

        }
    }

    function set_img_group_by_template(group_class, template){
        if(template.payload.image && template.payload.image!='null'){
            var $img = document.querySelector(group_class + " .add_file__img");
            $img.style.display = 'block';
            $img.setAttribute("src", "https://online.sigmasms.ru/api/storage/" + template.payload.image);

            set_preview_img(template.payload.image, ".preview__main-msg");
        }

        document.querySelector(group_class).style.display = 'block';


        if(template.payload.button.url){
            document.querySelector(group_class + " .button_link").value = template.payload.button.url;
        }

        if(template.payload.button.text){
            document.querySelector(group_class + " .button_describe").value = template.payload.button.text;
        }

        if(template.payload.button.text && template.payload.button.url){
            set_preview_button(template.payload.button.text, template.payload.button.url, ".preview__main-msg");
        }

        if(template.payload.image){
            document.querySelector(group_class + " .file_name").innerHTML = template.payload.image;
            document.querySelector(group_class + " .file_name").setAttribute("name", template.payload.image);
        }
    }

    $(".open_create-template").click(() => {
        document.querySelector(".create-template").style.display = 'block';
    });

    function findElement(arr, id) {
        const element = arr.find((el) => el.id === id);
        if (element) {
            return element;
        } else {
            return false
        }
    }

    function set_address_list(address_list, class_input, item_class) {
        var dropList = document.querySelector(class_input)
        address_list.forEach((address) => {
            let div = document.createElement('div');
            div.className = "dropList_item";
            div.innerHTML = '<label class="' + item_class + '">' +
                '<input name="' + address.id + '" id="' + address.title + '" class="book_check" type="checkbox" >' +
                '<strong>' + address.title + '</strong>' +
                '</label>';

            dropList.append(div);
        })
    }

    function getData(url, token, method, route) {
        return fetch(url + "?" + new URLSearchParams({
            route: route,
            token: token,
            method: method
        }), {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
            .then((response) => response.json())
    }
    
    async function make_body(include_addresses , exclude_addresses, type, sender, text, delay){
        var recipient = {'include': include_addresses, 'exclude': exclude_addresses};
        var payload = await create_payload(type, sender, text, ".mass_sending__msg_body");

        if (document.querySelector(".mass_sending__add_cascade input").checked) {
            var fallbacks = [await create_fallbacks()];
        } else {
            var fallbacks = [];
        }

        var body = {
            "fallbacks": fallbacks,
            "payload": payload,
            "recipient": recipient,
            "schedule": {'delay': delay},
            'type': type
        }

        return body;

    }

    async function save_template(title_template, include_addresses, exclude_addresses) {
        var sender = document.querySelector('.mass_sending__senderName .senderName_list').value
        var text = document.querySelector('.mass_sending__msgText .msg_content').value;
        var type = document.querySelector('.mass_sending__form .check_block input[name="channels[]"]:checked').value;

        set_preview_channelType(type, ".preview__main-msg");

        if (!validation_mass_sending(include_addresses, sender, text)) {
            return false;
        }

       var body = await make_body(include_addresses , exclude_addresses, type, sender, text, 0);
       body["title"] = title_template;

        if (title_template == "") {
            alert("Введите название шаблона")
        }

        var create_template = await push_data(url, token, body, "create_template");

        if (create_template.createdAt) {
            alert("шаблон успешно создан");
            document.querySelector(".create-template").style.display = 'none';
        } else {
            alert("Ошибка со стороны сервера");
        }
    }

    async function upload_file(data, token) {
        return await $.ajax({
            url: url + "?" + new URLSearchParams({
                route: 'sigmamsg/mass_sending',
                token: token,
                method: 'upload_file'
            }),
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false
        })
            .then((response) => response)
    }

    function validation_cascade(sendername, text, timeout) {
        if (document.querySelector(".mass_sending__add_cascade input").checked) {
            if (!sendername || sendername == '') {
                alert("Вы не ввели имя отправителя для Переотправки")
                return false;
            }
            if (!text) {
                alert("Введите текст сообщения для Переотправки")
                return false;
            }

            if (!timeout) {
                alert("Вы не указали время ожидания для переотправки")
                return false;
            }
        }

        return true;

    }

    function validation_mass_sending(include, sender_name, text) {
        if (!include.length) {
            alert("Добавьте не менее одного адреса для отправки")
            return false;
        }
        if (!sender_name) {
            alert("Вы не ввели имя отправителя")
            return false;
        }

        if (document.querySelector('.mass_sending__sendingTime .switch input').checked) {
            if (document.querySelector(".datetimepicker_div div div input").value == "") {
                alert("Введите планируемое время отправки")
                return false;
            }
        }

        if (!text) {
            alert("Введите текст сообщения")
            return false;
        }

        return true;
    }

    function close_dropLists() {
        var dropLists = document.querySelectorAll('.dropList');
        dropLists.forEach((dropList) => {
            dropList.style.display = 'none';
        })
    }

    function push_data(url, token, body, method) {
        return fetch(url + "?" + new URLSearchParams({
            route: 'sigmamsg/mass_sending',
            token: token,
            method: method
        }), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((response) => response.json())
    };

    function show_resolved_channels() {
        user_data.RoutingGroups.forEach((channel) => {
            document.querySelectorAll("." + channel.type + "_label").forEach((element) => {
                element.style.display = 'flex'
            })
        })
    }

    $(".mass_sending__messenger-button .img_file").on('change', function () {
        var $input = $(this)[0];

        if ($input.files && $input.files[0]) {
            var file_name = $input.value.split(/\\/)[2];
            document.querySelector(".mass_sending__messenger-button .add_file__img").style.display = 'block';
            var $span = document.querySelector(".mass_sending__messenger-button .file_name")
            var $img = document.querySelector('.mass_sending__messenger-button div .add_file_div .add_file__img');
            var $span = document.querySelector(".mass_sending__messenger-button .file_name");
            set_img($input, $img, $span, file_name)
        }
    });

    $(".create-resend__messenger-button .img_file").on('change', function () {
        var $input = $(this)[0];
        var file_name = event.currentTarget.value.split(/\\/)[2];
        if ($input.files && $input.files[0]) {
            var $img = document.querySelector(".create-resend__messenger-button .add_file__img");
            var $span = document.querySelector(".create-resend__messenger-button .file_name");
            set_img($input, $img, $span, file_name);
        }
    });

    function set_img($input, $img, $span, file_name){
        set_main_img_by_input($input);
        $img.style.display = 'block';
        $span.innerHTML = file_name;
        var reader = new FileReader();
        reader.onload = function (e) {
            $img.setAttribute("src", e.target.result);
        };
        reader.readAsDataURL($input.files[0]);
    }
    

    $(".dropdown .dropdown-menu a").click(function () {
        var element = $(this)[0];

        var text_area = element.parentElement.parentElement.parentElement.parentElement.querySelector('.msg_content');

        var text = text_area.value;

        var first_part = text.substring(0, text_area.selectionStart) + element.getAttribute("name");
        var last_part = text.substring(text_area.selectionStart);

        text_area.value = first_part + last_part;

        text_area.focus();
    });

    $('.mass_sending__channels .check_block input[name="channels[]"]').click((event) => {
        var element = event.currentTarget;
        if (element.value == 'viber') {
            document.querySelector(".mass_sending__messenger-button").style.display = 'flex'
        } else {
            document.querySelector(".mass_sending__messenger-button").style.display = 'none'
        }

        set_preview_channelType(element.value, ".preview__main-msg");

        var $select = document.querySelector(".mass_sending__senderName .senderName_list");

        set_senderNames(senderNames, element.value, $select)
    });

    $(".resend_channels .check_block input[name='resend_channels[]']").click((event) => {

        var element = event.currentTarget;
        if (element.value == 'viber') {
            document.querySelector(".create-resend__messenger-button").style.display = 'flex'
        } else {
            document.querySelector(".create-resend__messenger-button").style.display = 'none'
        }

        var $select = document.querySelector(".create-resend__senderName .senderName_list");
        set_senderNames(senderNames, element.value, $select)

    })

    $("#add_cascade_input").click(function () {
        if ($(this)[0].checked) {
            document.querySelector(".mass_sending__create-resend").style.display = 'block';
        } else {
            document.querySelector(".mass_sending__create-resend").style.display = 'none';
        }
    })

    $('[data-toggle="tooltip"]').tooltip();

    function set_senderLists() {
        document.querySelectorAll(".senderName_list").forEach((senderList) => {
            set_senderNames(senderNames, "sms", senderList);
        });
    }

    $(".mass_sending__msg_body div .mass_sending__senderName div .senderName_list").on("change", function () {
        var senderName = this.value;
        if (this.value) {
            document.querySelector(".mass_sending__msg-preview .preview__main-msg").style.display = 'block';
            set_main_preview_sendername(senderName.substr(0, 1).toUpperCase(), senderName.toUpperCase(), ".preview__main-msg");
        } else {
            document.querySelector(".mass_sending__msg-preview .preview__main-msg").style.display = 'none';
        }
    })

    $(" .mass_sending__msg_body div .mass_sending__msgText .msg_content").on("keyup", function () {
        if(document.querySelector(".mass_sending__msg_body .mass_sending__msgText .translit_div .switch #translit").checked){
            document.querySelector(".mass_sending__msg-preview .preview__main-msg .msg_block .msg_contant .msg_txt p").innerHTML = translit_words(this.value);
        }else{
            document.querySelector(".mass_sending__msg-preview .preview__main-msg .msg_block .msg_contant .msg_txt p").innerHTML = this.value;

        }
    })

    $(".mass_sending__msg_body div .mass_sending__msgText .mass_sending__messenger-button .button_text_field .button_describe").on("keyup", function () {
        var link = document.querySelector(".mass_sending__msg_body div .mass_sending__msgText .mass_sending__messenger-button .button_text_field .button_link").value;
        set_preview_button(this.value, link, ".preview__main-msg");
    })

    $(".mass_sending__msg_body div .mass_sending__msgText .mass_sending__messenger-button .button_text_field .button_link").on("keyup", function () {
        var name = document.querySelector(".mass_sending__msg_body div .mass_sending__msgText .mass_sending__messenger-button .button_text_field .button_describe").value;
        set_preview_button(name, this.value, ".preview__main-msg");
    })

    $(".mass_sending__msg_body .mass_sending__msgText .translit_div .switch #translit").on("change", function () {

        var text = document.querySelector(".mass_sending__msg_body div .mass_sending__msgText .msg_content").value;

        if(this.checked){
            var translit_text = '';

            text = translit_words(text);

            document.querySelector(".mass_sending__msg-preview .preview__main-msg .msg_block .msg_contant .msg_txt p").innerHTML = text;

        }else{
            document.querySelector(".mass_sending__msg-preview .preview__main-msg .msg_block .msg_contant .msg_txt p").innerHTML = text;
        }
    })

})


function clear_main_msg_preview(selector) {
    document.querySelector(".mass_sending__msg-preview " + selector).style.display = 'none';

    set_main_preview_sendername("", "", selector);

    set_preview_time("", "", ".mass_sending__msg-preview " + selector);

    document.querySelector(".mass_sending__msg-preview " + selector +" .msg_block .msg_contant .msg_txt p").innerHTML = "";

    set_preview_channelType('sms', selector);
}

function set_preview_button(name, link, selector) {
    if(name.length && link.length){
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_txt .msg_button").innerHTML = name;
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_button").style.display = "block";
    }else{
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_button").style.display = "none";
    }
}

function set_preview_img(id, selector) {
    if(id.length){
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_txt .msg_img").setAttribute('src', "https://online.sigmasms.ru/api/storage/" + id + ".jpg");
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_img").style.display = "block";
    }else{
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_img").style.display = "none";
    }
}

function set_preview_button(name, link, selector) {
    if(name.length && link.length){
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_txt .msg_button").innerHTML = name;
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_button").style.display = "block";
    }else{
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_button").style.display = "none";
    }
}

function set_main_img_by_input($input) {
    var $img = document.querySelector(".mass_sending__msg-preview .preview__main-msg .msg_block .msg_contant .msg_txt .msg_img");
    $img.style.display = 'block';
    var reader = new FileReader();
    reader.onload = function (e) {
        $img.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL($input.files[0]);
};

function set_preview_channelType(type, selector){

    if (type == "viber") {
        document.querySelector(".mass_sending__msg-preview " + selector + " .title_line").style.backgroundColor = "#9265f1";
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .sender_initital").style.backgroundColor = "#9265f1";
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_txt").style.backgroundColor = "white";
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_txt").style.color = "black";
    } else {
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_txt .msg_img").setAttribute('src', "#");
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_img").style.display = "none";
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_button").style.display = "none";
        document.querySelector(".mass_sending__msg-preview " + selector + " .title_line").style.backgroundColor = "#1976d2";
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .sender_initital").style.backgroundColor = "#1976d2";
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_txt").style.backgroundColor = "#1976d2";
        document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .msg_txt").style.color = "white";
    }
}

function set_main_preview_sendername(name, firstLetter, selector) {
    document.querySelector(".mass_sending__msg-preview " + selector + " .msg_block .msg_contant .sender_initital").innerHTML = name;
    document.querySelector(".mass_sending__msg-preview " + selector + " .title_line span").innerHTML = firstLetter;
    set_preview_time(get_current_time(), get_current_date(), ".mass_sending__msg-preview .preview__main-msg");
}

function set_preview_time(current_time, current_date, selector) {
    document.querySelector(selector + " .msg_block>span").innerHTML = current_date;
    document.querySelector(selector + " .msg_block .current_time").innerHTML = current_time;
}

function get_current_date() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = dd + '.' + mm + '.' + yyyy;
    return today;

}

function get_current_time() {
    var today = new Date();
    var hh = String(today.getHours()).padStart(2, '0');
    var mm = String(today.getMinutes() + 1).padStart(2, '0');
    var ss = String(today.getSeconds()).padStart(2, '0');
    today = hh + ':' + mm + ':' + ss;
    return today;
}

function translit_words(text){
    var translit_text = '';
    
    var translit_letters = {
        "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e",
        "ж": "zh", "з": "z", "и": "i", "й": "i", "к": "k", "л": "l", "м": "m",
        "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
        "ф": "f", "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch",
        "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
        "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D", "Е": "E",
        "Ё": "E", "Ж": "ZH", "З": "Z", "И": "I", "Й": "I", "К": "K",
        "Л": "L", "М": "M", "Н": "N", "О": "O", "П": "P", "Р": "R",
        "С": "S", "Т": "T", "У": "U", "Ф": "F", "Х": "H", "Ц": "TS",
        "Ч": "CH", "Ш": "SH", "Щ": "SHCH", "Ъ": "", "Ы": "Y", "Ь": "",
        "Э": "E", "Ю": "YU", "Я": "YA"
    };

    text.split('').forEach((letter) => {
        if (typeof translit_letters[letter] !== "undefined") {
            translit_text = translit_text + translit_letters[letter]
        } else {
            translit_text = translit_text + letter
        }
    })

    return translit_text;
}
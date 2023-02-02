document.addEventListener('DOMContentLoaded', async function () {


    /* SENDERNAME  */

    $(" .customer_msg_content>.sending_by_events__senderName div .senderName_list").on("change", function () {
        var senderName = this.value;
        if (this.value) {
            document.querySelector(".sending_by_events__msg-preview .preview__main-msg").style.display = 'block';
            set_main_preview_sendername(senderName.substr(0, 1).toUpperCase(), senderName.toUpperCase(), ".preview__main-msg");
        } else {
            document.querySelector(".sending_by_events__msg-preview .preview__main-msg").style.display = 'none';
        }
    })

    $(" .customer_msg_content .sending_by_events__create-resend .create-resend__senderName div .senderName_list").on("change", function () {
        var senderName = this.value;
        if (this.value) {
            document.querySelector(".sending_by_events__msg-preview .preview__cascade-msg").style.display = 'block';
            set_main_preview_sendername(senderName.substr(0, 1).toUpperCase(), senderName.toUpperCase(), ".preview__cascade-msg");
        } else {
            document.querySelector(".sending_by_events__msg-preview .preview__cascade-msg").style.display = 'none';
        }
    })

    /* TEXT  */

    $(" .customer_msg_content>.sending_by_events__msgText .msg_content").on("keyup", function () {
        if(document.querySelector(".customer_msg_content .sending_by_events__msgText .translit_div .switch #translit").checked){
            document.querySelector(".sending_by_events__msg-preview .preview__main-msg .msg_block .msg_contant .msg_txt p").innerHTML = replace_variable(translit_words(this.value));
        }else{
            document.querySelector(".sending_by_events__msg-preview .preview__main-msg .msg_block .msg_contant .msg_txt p").innerHTML = replace_variable(this.value);
        }
    })

    $(".customer_msg_content .sending_by_events__msgText .translit_div .switch #translit").on("change", function () {
        var text = document.querySelector(".customer_msg_content>.sending_by_events__msgText .msg_content").value;
        if(this.checked){
            var translit_text = '';

            text = translit_words(text);

            document.querySelector(".sending_by_events__msg-preview .preview__main-msg .msg_block .msg_contant .msg_txt p").innerHTML = replace_variable(text);

        }else{
            document.querySelector(".sending_by_events__msg-preview .preview__main-msg .msg_block .msg_contant .msg_txt p").innerHTML = replace_variable(text);
        }
    })

    //cascade

    $(".customer_msg_content .sending_by_events__create-resend .create-resend__msg_conten-div .msg_content").on("keyup", function () {
        document.querySelector(".sending_by_events__msg-preview .preview__cascade-msg .msg_block .msg_contant .msg_txt p").innerHTML = replace_variable(this.value);
    })

    $(" .customer_msg_content .sending_by_events__create-resend .create-resend__msg_conten-div .translit_div .switch #translit").on("change", function () {
        var text = document.querySelector(".customer_msg_content .sending_by_events__create-resend .create-resend__msg_conten-div .msg_content").value;
        if(this.checked){

            text = translit_words(text);

            document.querySelector(".sending_by_events__msg-preview .preview__cascade-msg .msg_block .msg_contant .msg_txt p").innerHTML = replace_variable(text);

        }else{
            document.querySelector(".sending_by_events__msg-preview .preview__cascade-msg .msg_block .msg_contant .msg_txt p").innerHTML = replace_variable(text);
        }
    })

        /* BUTTON GROUP */

    $(".customer_msg_content>.sending_by_events__msgText .sending_by_events__messenger-button .button_text_field .button_describe").on("keyup", function () {
        var link = document.querySelector(".customer_msg_content>.sending_by_events__msgText .sending_by_events__messenger-button .button_text_field .button_link").value;
        set_preview_button(this.value, link, ".preview__main-msg");
    })

    $(".customer_msg_content>.sending_by_events__msgText .sending_by_events__messenger-button .button_text_field .button_link").on("keyup", function () {
        var name = document.querySelector(".customer_msg_content>.sending_by_events__msgText .sending_by_events__messenger-button .button_text_field .button_describe").value;
        set_preview_button(name, this.value, ".preview__main-msg");
    })

    $(".customer_msg_content .sending_by_events__create-resend .create-resend__messenger-button .button_text_field .button_describe").on("keyup", function () {
        var link = document.querySelector(".customer_msg_content .sending_by_events__create-resend .create-resend__messenger-button .button_text_field .button_link").value;
        set_preview_button(this.value, link, ".preview__cascade-msg");
    })


    $(".customer_msg_content .sending_by_events__create-resend .create-resend__messenger-button .button_text_field .button_link").on("keyup", function () {
        var name = document.querySelector(".customer_msg_content .sending_by_events__create-resend .create-resend__messenger-button .button_text_field .button_describe").value;
        set_preview_button(name, this.value, ".preview__cascade-msg");
    })

})

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

function set_preview_channelType(type, selector){

    if (type == "viber") {
        document.querySelector(".sending_by_events__msg-preview " + selector + " .title_line").style.backgroundColor = "#9265f1";
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .sender_initital").style.backgroundColor = "#9265f1";
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_txt").style.backgroundColor = "white";
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_txt").style.color = "black";
    } else {
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_txt .msg_img").setAttribute('src', "#");
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_img").style.display = "none";
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_button").style.display = "none";
        document.querySelector(".sending_by_events__msg-preview " + selector + " .title_line").style.backgroundColor = "#1976d2";
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .sender_initital").style.backgroundColor = "#1976d2";
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_txt").style.backgroundColor = "#1976d2";
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_txt").style.color = "white";
    }
}

function set_main_preview_sendername(name, firstLetter, selector) {
    document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .sender_initital").innerHTML = name;
    document.querySelector(".sending_by_events__msg-preview " + selector + " .title_line span").innerHTML = firstLetter;
    set_preview_time(get_current_time(), get_current_date(), ".sending_by_events__msg-preview .preview__main-msg");
}

function set_main_img_by_input($input) {
    var $img = document.querySelector(".sending_by_events__msg-preview .preview__main-msg .msg_block .msg_contant .msg_txt .msg_img");
    $img.style.display = 'block';
    var reader = new FileReader();
    reader.onload = function (e) {
        $img.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL($input.files[0]);
};

function set_preview_img(id, selector) {
    if(id.length){
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_txt .msg_img").setAttribute('src', "/admin/view/image/sigmamsg/upload/" + id + ".jpg");
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_img").style.display = "block";
    }else{
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_img").style.display = "none";
    }
}

function set_preview_button(name, link, selector) {
    if(name.length && link.length){
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_txt .msg_button").innerHTML = name;
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_button").style.display = "block";
    }else{
        document.querySelector(".sending_by_events__msg-preview " + selector + " .msg_block .msg_contant .msg_button").style.display = "none";
    }
}

function set_preview_time(current_time, current_date, selector) {
    document.querySelector(selector + " .msg_block>span").innerHTML = current_date;
    document.querySelector(selector + " .msg_block .current_time").innerHTML = current_time;
}


function set_msg_preview(senderName, text, type, selector) {
    document.querySelector(".sending_by_events__msg-preview " + selector).style.display = 'block';

    set_preview_channelType(type, selector);

    set_main_preview_sendername(senderName.substr(0, 1).toUpperCase(), senderName.toUpperCase(), selector);

    set_preview_time(get_current_time(), get_current_date(), ".sending_by_events__msg-preview " + selector);

    document.querySelector(".sending_by_events__msg-preview " + selector +" .msg_block .msg_contant .msg_txt p").innerHTML = replace_variable(text);
}


function clear_main_msg_preview(selector) {
    document.querySelector(".sending_by_events__msg-preview " + selector).style.display = 'none';

    set_main_preview_sendername("", "", selector);

    set_preview_time("", "", ".sending_by_events__msg-preview " + selector);

    document.querySelector(".sending_by_events__msg-preview " + selector +" .msg_block .msg_contant .msg_txt p").innerHTML = "";

    set_preview_channelType('sms', selector);
}

function replace_variable(text) {
    if (text.match(/\#{order_id}/)) {
        text = text.replace(/\#{order_id}/, 25)
    }

    if (text.match(/\#{firstname}/)) {
        text = text.replace(/\#{firstname}/, 'Иван');
    }

    if (text.match(/#{lastname}/)) {
        text = text.replace(/\#{lastname}/, 'Иванов');
    }

    if (text.match(/#{email}/)) {
        text = text.replace(/\#{email}/, 'Ivanov@gmail.com');
    }

    if (text.match(/#{phone}/)) {
        text = text.replace(/\#{phone}/, '+79000000000');
    }

    if (text.match(/#{city}/)) {
        text = text.replace(/\#{city}/, 'Москва');
    }

    if (text.match(/#{country}/)) {
        text = text.replace(/\#{country}/, 'Россия');
    }

    if (text.match(/#{products}/)) {
        text = text.replace(/\#{products}/, 'Товар #1, Товар #2');
    }

    if (text.match(/#{total}/)) {
        text = text.replace(/\#{total}/, '7100 RUB');
    }

    if (text.match(/#{date_added}/)) {
        text = text.replace(/\#{date_added}/, '+79000000000');
    }

    if (text.match(/#{date_modified}/)) {
        text = text.replace(/\#{date_modified}/, get_current_date() + " " + get_current_time());
    }

    if (text.match(/#{address_1}/)) {
        text = text.replace(/\#{address_1}/, '192102, ГОРОД САНКТ-ПЕТЕРБУРГ, ПРОСПЕКТ ВОЛКОВСКИЙ, ДОМ 32, ЛИТЕР А, ПОМЕЩЕНИЕ №88 ПОМЕЩЕНИЯ 1-Н ОФИС 5-5');
    }

    if (text.match(/#{address_2}/)) {
        text = text.replace(/\#{address_2}/, '192102, ГОРОД САНКТ-ПЕТЕРБУРГ, ПРОСПЕКТ ВОЛКОВСКИЙ, ДОМ 32, ЛИТЕР А, ПОМЕЩЕНИЕ №88 ПОМЕЩЕНИЯ 1-Н ОФИС 5-5');
    }

    if (text.match(/#{zone}/)) {
        text = text.replace(/\#{zone}/, 'Санкт-Петербург');
    }

    if (text.match(/#{company}/)) {
        text = text.replace(/\#{company}/, 'SIGMA messaging');
    }

    return text
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

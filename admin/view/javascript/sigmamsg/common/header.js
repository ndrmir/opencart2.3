document.addEventListener('DOMContentLoaded', async function () {

    window.url = '/admin/index.php';
    window.token = new URL(document.URL);
    token = token.searchParams.get('token');

    window.user_data = ''

    user_data = await get_user_data(url, token);

    if (user_data && user_data.error != 401) {
        set_user_data(user_data);
    } else {
        document.querySelector('.signin_modal').style.display = 'block';
        document.querySelector('.signin_form').style.display = 'block';
    }

    $(".add_funds .btn").on("click", function () {
        document.querySelector(".add_funds_modal").style.display = 'block'
    })

    $(".add_fund_by_card").on("submit", async function () {
        if (this.querySelector("#terms_of_an_agreement").checked) {
            var sum = this.querySelector("#sum").value;
            var url_success = document.URL;
            var add_fund = await push_data(url, token, {sum: sum, url: url_success}, "add_fund", 'profile');
            if (!add_fund.error) {
                document.location.href = add_fund.url
            }
        } else {
            alert("Для пополнения баланса необходимо принять условия оферты");
        }

    })

    $(".add_funds_modal").click(function (e) {
        // console.log("clear modal")...........................................................................Добавить очистку формы при нажатии на фон
    })

    $(".add_funds_modal #close_modal").on("click", function () {
        clear_add_funds_modal();
    })

    function clear_add_funds_modal(){
        document.querySelector(".fund_type").style.display = 'block';
        document.querySelector(".individual_div").style.display = 'none';
        document.querySelector(".entity_div").style.display = 'none';
        document.querySelector(".add_fund_by_card_div").style.display = 'none';
        document.querySelector(".add_fund_by_card_div").style.display = 'none';
    }

    $("#open_terms_of_an_agreement").on("click", async function () {
        document.querySelector(".payment_offer_modal").style.display = 'block'
    })

    $(".pay_by_card").on("click", async function () {

        var tinkoff_payment_offer = await get_data(url, 'profile', "get_payment_offer", token);
        document.querySelector(".payment_offer_modal div div .modal-body").innerHTML = tinkoff_payment_offer
        this.parentElement.style.display = 'none';
        this.parentElement.parentElement.querySelector(".add_fund_by_card_div").style.display = 'block';
    })

    $(".add_funds_modal div div div .fund_type .individual").on("click", function () {
        this.parentElement.style.display = 'none';
        document.querySelector(".individual_div").style.display = 'block';
    })

    var requisites;
    var companies;
    var requisiteId = '';
    var companyId = '';

    $(".add_funds_modal div div div .fund_type .entity").on("click", async function () {

        requisites = await get_data(url, 'profile', "getRequisites", token);

        var $requisites_list = document.querySelector(".add_funds_modal div div .modal-body .entity_div div select");

        if (requisites.data.length) {
            requisites.data.forEach((item) => {
                var $option = document.createElement("option");
                $option.value = item.id;
                $option.innerHTML = item.title;
                $requisites_list.append($option);
            })
            requisiteId = requisites.data[0].id;

            var vat = requisites.data[0].data.tax.vat;
            companies = await get_companies(url, vat, token);

            companyId = check_companies_invoice(companies.data);

            if(companyId){
                document.querySelector(".add_bill_form button").disabled = false;
            }else{
                document.querySelector(".add_bill_form button").disabled = true;
                alert('Невозможно выставить счет по данному реквизиту');
            }
        }else{
            document.querySelector(".add_bill_form button").disabled = true;
            alert('Не найдено ни одного реквизита, для того что бы создать реквизит перейдите в раздел профиль/реквизиты ');
        }

        this.parentElement.style.display = 'none';
        document.querySelector(".entity_div").style.display = 'inline-block';
    })

    function check_companies_invoice(company_list){
        if(company_list.length){
            var id = false;
            company_list.forEach((company)=>{
                company.DocumentTemplatesTypes.forEach((item)=>{
                    if(item == "invoice"){
                        id = company.id;
                    }
                })
            })
            return id;
        }else{
            return false;
        }
    }

    $(".add_funds_modal div div .modal-body .entity_div div select").on('change', async function () {
        requisiteId = this.value;
        if (requisites.data.length) {
            requisites.data.forEach( async (item) => {
                if (item.id == requisiteId) {

                    var vat = requisites.data[0].data.tax.vat;
                    companies = await get_companies(url, vat, token);

                    companyId = check_companies_invoice(companies.data);

                    if(companyId){
                        document.querySelector(".add_bill_form button").disabled = false;
                    }else{
                        document.querySelector(".add_bill_form button").disabled = true;
                        alert('Невозможно выставить счет по данному реквизиту');
                    }
                }
            })
        }
    })

    $(".add_bill_form").on("submit", async function () {

        var sum = this.querySelector("#sum").value;

        var body = {
            sum: sum,
            requisiteId: requisiteId,
            companyId: companyId,
        }

        document.querySelector(".add_funds_modal div div .modal_loader").style.display = 'flex';

        var add_bill = await push_data(url, token, body, "add_bill", 'profile');

        document.querySelector(".add_funds_modal div div .modal_loader").style.display = 'none';

        if(!add_bill.error){
            alert('Счет успешно выставлен.');
            var link = document.createElement('a');
            link.setAttribute('href','https://online.sigmasms.ru/api/storage/' + add_bill.id);
            link.setAttribute('download','download');
            onload=link.click();
            document.querySelector(".add_funds_modal").style.display = 'none';
            clear_add_funds_modal();
        }else{
            alert('Ошибка со стороны сервера.');
        }

    })

    $('.msg_content').on("keyup", function () {
        var textfield = $(this)[0];
        var channels_wrapper = textfield.parentElement.parentElement.querySelector(".channels_wrapper");
        var channel = channels_wrapper.querySelector(".check_block .service-label input[type='radio']:checked").value;
        var text_length = textfield.value.length;
        var $details = textfield.parentElement.querySelector(".text_field_details");
        if (channel == 'sms') {
            var calculate = calculateSmsStats(textfield.value);
            $details.querySelector(".symbol_count").innerHTML = calculate.characters;
            $details.querySelector(".piece_count").innerHTML = calculate.segments;
        } else {
            if (text_length >= 1) {
                $details.querySelector(".symbol_count").innerHTML = text_length;
                $details.querySelector(".piece_count").innerHTML = Math.ceil(text_length / 1000);
            }
        }
    })

    $(".signup_form").on("submit", async function () {
        var $form = this;
        var data = {};
        $form.querySelectorAll("div input").forEach((item) => {
            var name = item.getAttribute("name");
            data[name] = item.value;
        })
        var signup = await push_data(url, token, data, "signup", 'profile');

        if (signup.error) {
            if (signup.data && signup.data[0] && signup.data[0].message) {
                $form.querySelector(".modal-footer .alert-danger strong").innerHTML = signup.data[0].message;
            } else {
                $form.querySelector(".modal-footer .alert-danger strong").innerHTML = signup.message;
            }
            $form.querySelector(".modal-footer .alert-danger").style.display = 'block';
        } else {
            $form.querySelector(".modal-footer .alert-danger").style.display = 'none';
            location.reload();
        }
    })

    $(".refresh_balance").on("click", async function () {

        refresh_balance = await get_data(url, 'profile', "refresh_balance", token);
        if (refresh_balance != 'null') {
            document.querySelector(".purse-item span").innerHTML = refresh_balance + " &#8381"
        } else {
            document.querySelector('.signin_modal').style.display = 'block';
        }
    })

    $(".create-senderName__form .create-senderName__channels .check_block label input[name='channels[]']").on("change", function () {
        if (this.value == 'sms' || this.value == 'viber' || this.value == 'vk') {
            document.querySelector(".create-senderName__form .senderName_describe").innerHTML = "Длина имени отправителя от 4 до 11 букв латинского алфавита";
        } else {
            document.querySelector(".create-senderName__form .senderName_describe").innerHTML = "Городской номер формата 74956665610";
        }
    })

    $(".channels_wrapper input").on('change', function () {
        var element = $(this)[0];
        var text = element.parentElement.parentElement.parentElement.parentElement.querySelector(".msg_content").value;
        var channel = element.value;
        var $details = element.parentElement.parentElement.parentElement.parentElement.querySelector(".text_field_details");
        if (channel == 'sms') {
            var calculate = calculateSmsStats(text);
            $details.querySelector(".symbol_count").innerHTML = calculate.characters;
            $details.querySelector(".piece_count").innerHTML = calculate.segments;
        } else {
            var text_length = text.length;
            if (text_length >= 1) {
                $details.querySelector(".symbol_count").innerHTML = text_length;
                $details.querySelector(".piece_count").innerHTML = Math.ceil(text_length / 1000);
            }
        }
    })

    document.querySelector(".sign_in").addEventListener("click", async () => {
        var login = document.querySelector("input[name='login']").value;
        var password = document.querySelector("input[name='password']").value;
        var signin = await sign_in(url, token, login, password);

        if (signin.error === null) {
            document.querySelector(".signin_form .alert-danger").style.display = "inline-block";
            document.querySelector(".signin_form .alert-danger strong").innerHTML = "Ошибка со стороны сервера";
            setTimeout(() => {
                document.querySelector(".signin_form .alert-danger").style.display = "none";
            }, 3000)
        }

        console.log(signin)

        if (signin.error === 400) {
            document.querySelector(".signin_form .alert-danger").style.display = "inline-block";
            document.querySelector(".signin_form .alert-danger strong").innerHTML = "Неверный логин или пароль";
            setTimeout(() => {
                document.querySelector(".signin_form .alert-danger").style.display = "none";
            }, 3000)
        } else {
            location.reload()
        }
    })

    show_signup.onclick = function () {
        document.querySelector('.signin_form').style.display = 'none';
        document.querySelector('.signup_form').style.display = 'block';
    }

    show_signin.onclick = function () {
        document.querySelector('.signup_form').style.display = 'none';
        document.querySelector('.signin_form').style.display = 'block';
    }

    $("button[name='close']").click((event) => {
        var element = event.currentTarget;
        if (element.id == "close-btn") {
            var modal = element.parentElement.parentElement.parentElement.parentElement.parentElement;
        } else {
            var modal = element.parentElement.parentElement.parentElement.parentElement;
        }

        modal.style.display = 'none';
    })


    window.latin1symbols = '\n\rΔΓΛΩΠΨΣΘΞ\x1B!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~€‚ƒ„…†‡ˆ‰Š‹ŒŽ\'\'""•–—˜™š›œžŸ¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ '
    window.latin1symbolsOnlyRegExp = /^[\n\rΔΓΛΩΠΨΣΘΞ\x1B!"#$%&'()*+,-.\/0-9:;<=>?@A-z[\]^_`{|}~€‚ƒ„…†‡ˆ‰Š‹ŒŽ''""•–—˜™š›œžŸ¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ ]*$/
    window.ASCIISymbols = '\n\rΔΓΛΩΠΨΣΘΞ\x1B!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~DÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´¬±‗¾¶§÷¸°¨•¹³²■n '
    window.ASCIISymbolsOnlyRegExp = /^[@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1BÆæßÉ !"#¤%&\'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà\f^{}\\[~\]|€]*$/
    window.STABLE_ASCIISymbols = '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1BÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà'
    window.STABLE_ASCIISymbolsOnlyRegExp = /^[@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1BÆæßÉ !"#¤%&\'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà\f^{}\\[~\]|€]*$/

    window.calculateSmsStats = text => {
        text = '' + (text || '')
        const characters = text.length
        const rules = {
            ascii: [
                {
                    from: 160,
                    count: 1
                },
                {
                    from: 306,
                    count: 2
                }
            ],
            unicode: [
                {
                    from: 70,
                    count: 1
                },
                {
                    from: 134,
                    count: 2
                }
            ]
        }
        let currentEncoding = 'ascii'
        if (!STABLE_ASCIISymbolsOnlyRegExp.test(text)) {
            // eslint-disable-line
            currentEncoding = 'unicode'
        }
        let segmentsCount = 0,
            segmentLength = 0,
            rule = rules[currentEncoding]
        rule.some(o => {
            segmentLength = o.from
            if (o.from >= characters) {
                segmentsCount = o.count
                return true
            }
        })
        if (segmentsCount === 0) {
            segmentsCount = 2
            switch (currentEncoding) {
                case 'ascii':
                case 'e7bit':
                    segmentsCount += Math.ceil((characters - segmentLength) / 153)
                    break
                default:
                    segmentsCount += Math.ceil((characters - segmentLength) / 67)
                    break
            }
        }
        const result = {
            segments: segmentsCount || 1,
            characters
        }
        return result
    }

    $(".modal-back").click((event) => {
        var element = event.target;
        try {
            if (element.className.match('modal-back')) {
                element.style.display = 'none';
            }
        } catch (err) {
        }
    })


    $(".open-create_senderName").click(() => {
        document.querySelector(".create-senderName").style.display = 'block';
    });

    $(".create-senderName__form").submit(async () => {
        var type = document.querySelector('.create-senderName__form .check_block input[name="channels[]"]:checked').value;

        var name = document.querySelector('.create-senderName__form .senderName').value;
        if (!name) {
            alert("Поле ввода имени обязательно");
            return false;
        }
        var comment = document.querySelector('.create-senderName__form .comment').value;
        if (!comment) {
            alert("Коментарий обязателен");
            return false;
        }
        var body = {
            comment: comment,
            name: name,
            type: type
        }

        var create_senderName = await push_data(url, token, body, "addSenderName", 'mass_sending');

        if (create_senderName.error) {
            var error = create_senderName.data[0].message;
            document.querySelector(".create-senderName__form .button-group .alert").innerHTML = error;
            document.querySelector(".create-senderName__form .button-group .create-senderName_error").style.display = "inline-block";
            setTimeout(() => {
                document.querySelector(".create-senderName__form .button-group .create-senderName_error").style.display = "none";
            }, 10000)
            return false;
        } else {
            document.querySelector(".create-senderName").style.display = 'none';
            alert("Имя пользователя успешно создано");
            document.querySelector('.create-senderName__form .senderName').value = "";
            document.querySelector('.create-senderName__form .comment').value = "";
        }

    })

    function push_data(url, token, body, method, route) {
        return fetch(url + "?" + new URLSearchParams({
            route: 'sigmamsg/' + route,
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


    function sign_in(url, token, login, password) {
        var data = {login: login, password: password}
        return fetch(url + "?" + new URLSearchParams({
            route: 'sigmamsg/profile',
            token: token,
            method: "signin"
        }), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
    }

    async function get_data(url, route, method, token) {
        return fetch(url + "?" + new URLSearchParams({
            route: 'sigmamsg/' + route,
            token: token,
            method: method
        }), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())
    }

    async function get_companies(url, vat, token) {
        return fetch(url + "?" + new URLSearchParams({
            route: 'sigmamsg/profile',
            token: token,
            method: 'get_companies',
            vat: vat
        }), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())
    }

    function get_user_data(url, token) {
        return fetch(url + "?" + new URLSearchParams({
            route: 'sigmamsg/profile',
            token: token,
            method: "get_user_data"
        }), {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
            .then((response) => response.json())
    }


    function set_user_data(data) {
        if (data.data.firstName) {
            var letter = data.data.firstName[0];
            var user = data.data.firstName;
            if ( typeof data.data.lastName!= "undefined" ) {
                user = user + " " + data.data.lastName;
            }
        } else {
            var letter = data.username[0];
            var user = data.username;
        }
        document.querySelector(".user_link").style.display = "flex";
        document.querySelector(".user_link .userName-icon").innerHTML = letter.toUpperCase();
        document.querySelector(".user_link .userName").innerHTML = user;

        document.querySelector(".purse-item").style.display = "flex";
        document.querySelector(".purse-item span").innerHTML = data.balance + " &#8381";
    }

})

document.addEventListener('DOMContentLoaded', async function () {
    var url = '/admin/index.php';

    const user_data = await get_user_data(url, token);
    const requisites = await get_data(url, 'profile', "getRequisites", token);
    var $requisites_list = document.querySelector(".requisite_form div div #requisites_list");
    var current_open_requisites = '';

    if (requisites.data.length) {
        requisites.data.forEach((item) => {
            var $option = document.createElement("option");
            $option.value = item.id;
            $option.setAttribute('name', item.id);
            $option.innerHTML = item.title;
            $requisites_list.append($option);
        })
    }

    $(".requisite_form div div #requisites_list").on("click", function () {
        current_open_requisites = this.value;

        if (this.value) {
            $("#update_requisite").show();
            $("#delete_requisite").show();
            $("#save_requisite").hide();
            requisites.data.forEach((item) => {
                if (item.id == this.value) {
                    set_requisites_form(item)
                }
            })
        } else {
            $("#save_requisite").show();
            $("#update_requisite").hide();
            $("#delete_requisite").hide();
            clear_requisites_form();
        }

    })

    function clear_requisites_form(){
        var data = {
            title: '',
            contact: {
                email: '', firstName: '', lastName: '', phone: '', middleName: '',

            },
            data: {
                legal: {opf: "", ogrn: "", inn: "", kpp: "", okpo: "", name: ""},
                legalAddress: {country: "", city: "", address: "", phone: "", phoneAdd: "", index: ""},
                postalAddress: {country: "", city: "", address: "", phone: "", phoneAdd: "", index: ""},
                bank: {rs: "", ks: "", bik: "", name: ""},
                tax: {system: "", vat: ""}
            },
            signer: {
                fullName: {
                    nominative: "", genitive: "",
                },
                basis: {
                    nominative: "", genitive: "",
                },
                position: {nominative: "", genitive: "",},

            },

        }
        set_requisites_form(data);
    }

    function set_requisites_form(data) {
        var $form = document.querySelector(".requisite_form");

        $form.querySelector("#title").value = data.title;

        $form.querySelector("#email").value = data.contact.email;
        $form.querySelector("#firstName").value = data.contact.firstName;
        $form.querySelector("#secondName").value = data.contact.lastName;
        $form.querySelector("#phone").value = data.contact.phone;
        $form.querySelector("#lastName").value = data.contact.middleName;

        $form.querySelector("#FULL_NAME_nominative").value = data.signer.fullName.nominative;
        $form.querySelector("#FULL_NAME_genitive").value = data.signer.fullName.genitive;
        $form.querySelector("#basis_nominative").value = data.signer.basis.genitive;
        $form.querySelector("#basis_genitive").value = data.signer.basis.genitive;
        $form.querySelector("#position_nominative").value = data.signer.position.genitive;
        $form.querySelector("#position_genitive").value = data.signer.position.genitive;

        $form.querySelector("#opf").value = data.data.legal.opf;
        $form.querySelector("#ogrn").value = data.data.legal.ogrn;
        $form.querySelector("#inn").value = data.data.legal.inn;
        $form.querySelector("#kpp").value = data.data.legal.kpp;
        $form.querySelector("#okpo").value = data.data.legal.okpo;
        $form.querySelector("#company_name").value = data.data.legal.name;

        $form.querySelector("#bank_name").value = data.data.bank.name;
        $form.querySelector("#rs").value = data.data.bank.rs;
        $form.querySelector("#ks").value = data.data.bank.ks;
        $form.querySelector("#bik").value = data.data.bank.bik;

        $form.querySelector("#system").value = data.data.tax.system;
        $form.querySelector("#vat").value = data.data.tax.vat;

        $form.querySelector("#legal_country").value = data.data.legalAddress.country;
        $form.querySelector("#legal_city").value = data.data.legalAddress.city;
        $form.querySelector("#legal_index").value = data.data.legalAddress.index;
        $form.querySelector("#legal_address").value = data.data.legalAddress.address;
        $form.querySelector("#legal_phone").value = data.data.legalAddress.phone;
        $form.querySelector("#legal_phoneAdd").value = data.data.legalAddress.phoneAdd;

        $form.querySelector("#postal_country").value = data.data.postalAddress.country;
        $form.querySelector("#postal_city").value = data.data.postalAddress.city;
        $form.querySelector("#postal_index").value = data.data.postalAddress.index;
        $form.querySelector("#postal_address").value = data.data.postalAddress.address;
        $form.querySelector("#postal_phone").value = data.data.postalAddress.phone;
        $form.querySelector("#postal_phoneAdd").value = data.data.postalAddress.phoneAdd;

    }

    if (user_data.error && user_data.error == 401) {
        document.querySelector('.signin_modal').style.display = 'block';
    } else {
        set_user_data(user_data);
    }


    $(".requisite_form").on("submit", async function () {
        var $form = this;

        var body = make_requisites_body($form);

        var set_requisites = await push_data(url, token, body, "set_requisites", 'profile');

        if (set_requisites.error) {
            alert(set_requisites.data[0].message)
        }else{
            alert('Реквизит успешно создан');
        }
    })

    $("#update_requisite").on("click", async function(){

        var body = make_requisites_body(document.querySelector("#sigma_user-settings div .requisites_settings .requisite_form"));

        var update_requisites = await push_data(url, token, {body: body, id: current_open_requisites }, "update_requisites", 'profile');
        if(update_requisites.error){
            alert(set_requisites.data[0].message)
        }else{
            alert('Реквизит успешно Обновлен');
        }

    })

    $("#delete_requisite").on("click", async function(){

        var delete_requisite = await push_data(url, token, {id: current_open_requisites }, "delete_requisites", 'profile');

        if(delete_requisite.error){
            alert(set_requisites.data[0].message);
        }else{
            alert('Реквизит успешно удален');
            clear_requisites_form();
            $requisites_list.querySelector('option[name="' + current_open_requisites + '"]').remove();
            $requisites_list.value = '';
        }
    })

    $('.user_data_form').on('submit', async function () {

        var login = this.querySelector("#login").value;
        var email = this.querySelector("#email").value;
        var firstname = this.querySelector("#firstname").value;
        var secondname = this.querySelector("#secondname").value;
        var phone = this.querySelector("#phone").value;

        var body = {
            login: login,
            email: email,
            firstname: firstname,
            secondname: secondname,
            phone: phone,
        }

        var update_user_data = await push_data(url, token, body, "update_user_data", 'profile');

        if(!update_user_data.error){
            alert('Данные успешно обновлены')
        }else{
            alert(update_user_data.data[0].message);
        }
    })

    $('.settings_type div label input[name="setting_type"]').on('change', async function () {

        this.parentElement.parentElement.parentElement.childNodes.forEach((element) => {
            element.className = 'col-lg-6 col-md-6 col-xs-6'
        })

        this.parentElement.parentElement.className = 'col-lg-6 col-md-6 col-xs-6 active';

        document.querySelectorAll("#sigma_user-settings>div>div").forEach((element) => {
            if (!element.className.match(this.value) && !element.className.match("settings_type")) {
                element.style.display = 'none'
            }

            if (element.className.match(this.value) && !element.className.match("settings_type")) {
                element.style.display = 'block'
            }
        })
    })

    document.querySelector('.save_changes_pass').onclick = async function () {

        var form = document.querySelector(".change_pass_form");
        var login = user_data.username;
        var old_password = form.querySelector("#currant_pass").value;
        var new_password = form.querySelector("#new_pass").value;
        var repeat_password = form.querySelector("#repeat_pass").value;

        if (repeat_password == new_password) {

            var data = {
                login: login,
                old_password: old_password,
                new_password: new_password,
                repeat_password: repeat_password,
                phone: user_data.data.phone,
                email: user_data.data.email
            };
            if (user_data.data.firstName !== undefined) {
                data['firstName'] = user_data.data.firstName;
            }

            if (user_data.data.lastName !== undefined) {
                data['lastName'] = user_data.data.lastName;
            }

            const result = await fetch(url + "?" + new URLSearchParams({
                route: 'sigmamsg/profile',
                token: token,
                method: "change_pasword"
            }), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
            if (result.error) {
                document.querySelector(".change_pass_error").style.display = "inline-block";
                document.querySelector(".change_pass_error div").innerHTML = result.error;

                setTimeout(() => {
                    document.querySelector('.change_pass_error').style.display = 'none';
                }, 3000);
            }
        } else {
            document.querySelector(".change_pass_error").style.display = "inline-block";
            document.querySelector(".change_pass_error div").innerHTML = "Пароли не совпадают";

            setTimeout(() => {
                document.querySelector('.change_pass_error').style.display = 'none';
            }, 3000);
        }
    }

    $('.user_data_form .button_div button[type="button"]').on("click", function () {
        $(this).hide();
        document.querySelector(".change_pass_form").style.display = "block";

        document.querySelector(".user_data_form .button_div").style.justifyContent = "flex-end"
        document.querySelector(".change_pass_form .button_div").style.justifyContent = "flex-end"

    })


    function get_user_data(url, token, user_data) {
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

    function get_data(url, route, method, token) {
        return fetch(url + "?" + new URLSearchParams({
            route: 'sigmamsg/' + route,
            token: token,
            method: method
        }), {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
            .then((response) => response.json())
    }

    function set_user_data(user_data) {
        document.querySelector(".purse-item span").innerHTML = user_data.balance + " &#8381";

        document.querySelector(".user_data_form #login").value = user_data.username;
        document.querySelector(".user_data_form #email").value = user_data.data.email;
        document.querySelector(".user_data_form #phone").value = user_data.data.phone;

        if (user_data['data']['firstName'] !== undefined) {
            document.querySelector(".user_link .userName-icon").innerHTML = user_data['data']['firstName'].substring(0, 1);

            var name = user_data['data']['firstName'];

            if (user_data['data']['lastName'] !== undefined) {
                name = name + " " + user_data.data.lastName;

            }

            document.querySelector(".user_link .userName").innerHTML = name;

            document.querySelector(".user_data_form #firstname").value = user_data['data']['firstName'];
        } else {
            document.querySelector(".nav-userData .userName-icon").innerHTML = user_data['username'].substring(0, 1);

            document.querySelector(".nav-userData .userName").innerHTML = user_data['username'];
        }

        document.querySelector(".purse-item").style.display = "flex";
        document.querySelector(".user_link").style.display = "flex";

        if (user_data['data']['lastName'] !== undefined) {
            document.querySelector(".user_data_form #secondname").value = user_data['data']['lastName'];
        }
    }


    function make_requisites_body($form){
        var title = $form.querySelector("#title").value;

        var email = $form.querySelector("#email").value;
        var firstName = $form.querySelector("#firstName").value;
        var lastName = $form.querySelector("#secondName").value;
        var phone = $form.querySelector("#phone").value;
        var middleName = $form.querySelector("#lastName").value;

        var contact = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            phone: phone
        }

        var FULL_NAME_nominative = $form.querySelector("#FULL_NAME_nominative").value;
        var FULL_NAME_genitive = $form.querySelector("#FULL_NAME_genitive").value;
        var basis_nominative = $form.querySelector("#basis_nominative").value;
        var basis_genitive = $form.querySelector("#basis_genitive").value;
        var position_nominative = $form.querySelector("#position_nominative").value;
        var position_genitive = $form.querySelector("#position_genitive").value;

        var signer = {
            position: {
                nominative: position_nominative,
                genitive: position_genitive
            },
            basis: {
                nominative: basis_nominative,
                genitive: basis_genitive
            },
            fullName: {
                nominative: FULL_NAME_nominative,
                genitive: FULL_NAME_genitive
            }
        };


        var opf = $form.querySelector("#opf").value;
        var ogrn = $form.querySelector("#ogrn").value;
        var inn = $form.querySelector("#inn").value;
        var kpp = $form.querySelector("#kpp").value;
        var okpo = $form.querySelector("#okpo").value;
        var company_name = $form.querySelector("#company_name").value;

        var legal = {
            name: company_name,
            opf: opf,
            ogrn: ogrn,
            inn: inn,
            kpp: kpp,
            okpo: okpo,
        }

        var bank_name = $form.querySelector("#bank_name").value;
        var rs = $form.querySelector("#rs").value;
        var ks = $form.querySelector("#ks").value;
        var bik = $form.querySelector("#bik").value;

        var bank = {
            name: bank_name,
            rs: rs,
            ks: ks,
            bik: bik,
        }

        var system = $form.querySelector("#system").value;
        var vat = $form.querySelector("#vat").checked;

        var tax = {
            system: system,
            vat: vat,
        }

        var legal_country = $form.querySelector("#legal_country").value;
        var legal_city = $form.querySelector("#legal_city").value;
        var legal_index = $form.querySelector("#legal_index").value;
        var legal_address = $form.querySelector("#legal_address").value;
        var legal_phoneAdd = $form.querySelector("#legal_phoneAdd").value;
        var legal_phone = $form.querySelector("#legal_phone").value;

        var legalAddress = {
            country: legal_country,
            city: legal_city,
            index: legal_index,
            address: legal_address,
            phone: legal_phone,
            phoneAdd: legal_phoneAdd,
        }

        var postal_country = $form.querySelector("#postal_country").value;
        var postal_city = $form.querySelector("#postal_city").value;
        var postal_index = $form.querySelector("#postal_index").value;
        var postal_address = $form.querySelector("#postal_address").value;
        var postal_phone = $form.querySelector("#postal_phone").value;
        var postal_phoneAdd = $form.querySelector("#postal_phoneAdd").value;

        var postalAddress = {
            country: postal_country,
            city: postal_city,
            address: postal_address,
            index: postal_index,
            phoneAdd: postal_phoneAdd,
            phone: postal_phone,
        }

        var personal = {
            document: {
                citizenship: "",
                issueDate: "",
                issuer: "",
                issuerCode: "",
                number: "",
                registrationAddress: "",
                registrationDate: "",
                series: "",
            },
            firstName: "",
            lastName: "",
            middleName: "",
        }

        var body = {
            contact: contact,
            attachments: {},
            data: {
                bank: bank,
                legal: legal,
                legalAddress: legalAddress,
                postalAddress: postalAddress,
                personal: personal,
                tax: tax,
            },
            signer: signer,
            title: title,
            type: "business",
        }

        return body;

    }

})

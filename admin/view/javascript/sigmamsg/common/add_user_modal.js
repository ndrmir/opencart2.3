document.addEventListener('DOMContentLoaded', async function () {

    var url = '/admin/index.php';
    var token = new URL(document.URL);
    token = token.searchParams.get('token');

    $("body").on('click',".edit_contact", async function() {
        var $form = $(this)[0].parentElement.parentElement;
        var form_items = $form.querySelectorAll(".modal-user__input");

        var data = {};
        form_items.forEach((item) => {
            if (item.value) {
                data[item.id] = item.value;
                data[item.id] = item.value;
            }
            ;
        });
        data["ListId"] = current_open_book_id;
        data["isActive"] = true;
        let user_id = $form.getAttribute("name");
        var editUser = await changeEntityData(url, token, "change_user_data", user_id, data);
        if(!editUser.error){
            alert("Данные пользователя успешно обновлены");
            $form.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        }else{
            alert(editUser.message);
        }
    })


    $("body").on('click',".add_contact", async function(event) {
            var $form = $(this)[0].parentElement.parentElement;
            var $form_items = $form.querySelectorAll(".modal-user__input");
            var data = {};
        $form_items.forEach((item) => {
                if (item.value) {

                    data[item.id] = item.value;
                    data[item.id] = item.value;
                }
                ;
            });

            data["ListId"] = current_open_book_id;
            data["isActive"] = true;

            var addUser = await add_user(url, data, token);
            if (!addUser.error) {
                $("#selectid").find('option').attr("selected", false);
                document.querySelector(".add_contact_div").style.display = 'none';
                $form_items.forEach((item) => {
                    item.value = '';
                });

                contactLists = await getDataByAddressBook(url, {
                    route: 'sigmamsg/address_book',
                    token: token,
                    method: "getContactLists"
                });

            }else{
                alert(addUser.message);
            }
        });


    $(".open_add_contact").click(async (event) => {
        var contact_div = document.querySelector(".add_contact_div");
        var form = document.querySelector(".add_contact_div form");

        clear_form(form);

        contact_div.style.display = 'inline-block';
        contact_div.querySelector("#add_contact").className = 'btn btn-primary add_contact';
    });

    $("#datepicker").datetimepicker({
        pickTime: false,
        format: 'YYYY-MM-DD'
    });

    function clear_form(form) {
        form.querySelectorAll("input").forEach((element) => {
            element.value = ''
        })
    }

    function getDataByAddressBook(url, params) {
        return fetch(url + "?" + new URLSearchParams(params), {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
            .then((response) => response.json())
    };


function changeEntityData(url, token, method, id, data) {
    return fetch(url + "?" + new URLSearchParams({
        route: 'sigmamsg/address_book',
        token: token,
        method: method,
        id: id
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

    function add_user(url, data, token) {
        return fetch(url + "?" + new URLSearchParams({
            route: 'sigmamsg/address_book',
            token: token,
            method: "add_user"
        }), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
    }

});
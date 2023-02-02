document.addEventListener('DOMContentLoaded', async function () {

    window.current_open_book_id = '';
    let contactLists = await getDataByAddressBook(url, {
        route: 'sigmamsg/address_book',
        token: token,
        method: "getContactLists",
    });

    var ww = window.innerWidth;

    set_custom_menu(contactLists);

    function set_custom_menu(templates) {
        var $ul = document.querySelector(".custom_menu>li ul");
        $ul.innerHTML = "";
        templates.forEach((status) => {
            var $li = document.createElement("li");
            $li.setAttribute("name", status.title)
            $li.setAttribute("class", status.id)
            $li.innerHTML = "<label name = '" + status.id + "' >" + status.title + "<input type='radio' value='" + status.id + "' name='book' ></label>";
            $ul.appendChild($li);
        })
    }
    if(ww>=600){
        var table = $('#users_by_addressBook').DataTable({
            responsive: true,
            columns: [
                {data: 'phone'},
                {data: 'lastName'},
                {data: 'firstName'},
                {data: 'middleName'},
                {data: 'email'},
                {data: 'date'},
                {data: 'custom01'},
                {data: 'custom02'},
                {data: 'dropdown'}
            ]
        });
    }else{
        var table = $('#users_by_addressBook').DataTable({
            responsive: true,
            columns: [
                {data: 'phone'},
                {data: 'lastName'},
                {data: 'firstName'},
                {data: 'dropdown'}
            ]
        });
    }



    $("body").on('change', ".upload-csv__input", async function (event) {
        var files = this.files;

        event.stopPropagation();
        event.preventDefault();

        if (typeof files == 'undefined') {
            return;
        }
        var file_name = files[0]['name'];
        var data = new FormData();

        $.each(files, function (key, value) {
            data.append("file", value);
        });

        $.ajax({
            url: url + "?" + new URLSearchParams({
                route: 'sigmamsg/address_book',
                token: token,
                method: 'upload_file',
                id: current_open_book_id
            }),
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: (res, status) => {
                if (!res.error) {
                    document.querySelector(".upload-csv").style.display = 'none';
                    alert("Файл успешно импортирован");
                }
            }
        })
    });

    $(".open_add_book").on("click", async function(){
        document.querySelector(".modal-back.new_book").style.display = 'inline-block';
    })

    $("body").on("change" ,"input[name='book']", async function() {
        var element = $(this)[0];
        var id = element.value;
        current_open_book_id = id;
        var table_name = element.parentElement.parentElement.getAttribute("name");

        document.querySelectorAll(".custom_menu>li ul li").forEach((item) => {
            if (item.querySelector("label").getAttribute('name') == id) {
                item.className = "active";
            } else {
                item.className = "";
            }
        })

        document.querySelector(".users_list__button-group h3").innerHTML = "<span>" + table_name + '</span><i class="glyphicon glyphicon-pencil open_edit_book" name="' + table_name + '" id= "' + id + '" ></i>';

        document.querySelector(".users_list").style.display = 'block';

        users = await getDataByAddressBook(url, {
            route: 'sigmamsg/address_book',
            token: token,
            method: "getUsers",
            id: id
        });

        if (!users.error && !users.message) {
        let data = users.data;

        $('#users_by_addressBook').dataTable().fnClearTable();
        if (ww >= 600) {
            if (data.length) {
                for (user in data) {
                    $('#users_by_addressBook').dataTable().fnAddData([
                        {
                            phone: data[user].phone,
                            lastName: data[user].lastName,
                            firstName: data[user].firstName,
                            middleName: data[user].middleName,
                            email: data[user].email,
                            date: data[user].date,
                            custom01: data[user].custom01,
                            custom02: data[user].custom02,
                            "dropdown": '<div class="dropdown">\n' +
                                '  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                '<i class="glyphicon glyphicon-option-vertical" ></i> </button>' +
                                '<ul class="dropdown-menu" id="' + data[user].id + '" aria-labelledby="dropdownMenu2">\n' +
                                '<li class="editUser" >Редактировать</li><li class="deleteUser" >Удалить</li>' +
                                '</ul></div>'
                        }
                    ]);

                }
            }
        } else {
            if (data.length) {
                for (user in data) {
                    $('#users_by_addressBook').dataTable().fnAddData([
                        {
                            phone: data[user].phone,
                            lastName: data[user].lastName,
                            firstName: data[user].firstName,
                            "dropdown": '<div class="dropdown">\n' +
                                '  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                '<i class="glyphicon glyphicon-option-vertical" ></i> </button>' +
                                '<ul class="dropdown-menu" id="' + data[user].id + '" aria-labelledby="dropdownMenu2">\n' +
                                '<li class="editUser" >Редактировать</li><li class="deleteUser" >Удалить</li>' +
                                '</ul></div>'
                        }
                    ]);

                }
            }
        }
    }else{
        alert(users.message);
    }
    });

    $("#open_import_users").click(async (event) => {
        document.querySelector(".import_users").style.display = 'inline-block'
    })

    $("#open_upload_contacts").click(async (event) => {
        document.querySelector(".upload-csv").style.display = 'inline-block';
    })

    $("body").on("click", '.open_edit_book', async (event) => {
        var element = event.currentTarget;
        var name = element.getAttribute("name");
        current_open_book_id = element.getAttribute("id");
        var modal = document.querySelector('.change_name_book');
        modal.querySelector(".modal-title").innerHTML = name;
        modal.querySelector("#book_name").value = name;
        modal.style.display = 'block';
    });

    $(".change_book_data").click(async (event) => {
        var name = document.querySelector("#book_name").value;
        var modal = document.querySelector('.change_name_book');
        var data = {title: name};
        var change_Data = await changeEntityData(url, token, "change_book_name", current_open_book_id, data);
        if (change_Data) {
            kl
            // var del = "<i class='delete_book glyphicon glyphicon-trash' id='" + current_open_book_id + "'></i>";
            // modal.querySelector(".modal-title").innerHTML = name;
            // document.querySelector(".users_list h3").innerHTML = name + '<i class="glyphicon glyphicon-pencil open_edit_book" name="' + name + '" style="display:none;" id= "' + current_open_book_id + '" ></i>';
            // ;
            // document.getElementById(current_open_book_id).innerHTML = "<h3 id='" + current_open_book_id + "' >" + name + del + "</h3>";
            // document.querySelector(".change_name_book").style.display = 'none';
        }
    });

    $('.books-list_button').click(async (event) => {
        document.querySelector(".new_book").style.display = 'inline-block';
    });

    $(".users_table .dropdown-menu li").click(async (event) => {
        var element = event.currentTarget;
        var country_code = element.querySelector('span').textContent;
        var img = element.querySelector("img").src;
        var button = document.querySelector(".dropdown__country button");
        button.querySelector('i img').src = img;
        button.querySelector('i span').textContent = country_code;
        document.querySelector(".dropdown__country input").value = country_code;
    })

    $('.edit_shop_client_book').click(() => {
        document.querySelector('.shop_client_book').style.display = 'block';
    });

    $('body').on("click", '.deleteUser', async (event) => {
        var id = event.target.parentElement.id;
        var delete_user = await delete_item(url, token, id, 'delete_user');
        if (!delete_user.error) {
            alert("Пользователь успешно удален");
            table
                .row(event.currentTarget.closest("tr"))
                .remove()
                .draw();
        }else{
            alert(delete_user.message);
        }
    })

    $('body').on("click", '.editUser', async function(event) {
        var id = $(this)[0].parentElement.id;
        var form = document.querySelector(".modal-user__form");

        users.data.forEach((user) => {
            if (user.id == id) {
                var form_items = form.querySelectorAll(".modal-user__input");
                for (key in user) {
                    if (user[key] && key != 'updatedAt' && key != 'createdAt' && key != 'id' && key != 'ListId') {
                        document.querySelector(".modal-user__input#" + key).value = user[key];
                    }

                }
            }
        })
        $modal = document.querySelector(".add_contact_div");
        $modal.querySelector("form").setAttribute("name", id);
        $modal.style.display = 'inline-block';
        form.querySelector("#add_contact").className = 'btn btn-primary edit_contact';
    })

    $("#delete_book").click(async function() {
        var element = $(this)[0];
        var id = current_open_book_id;
        if (confirm('Удалить адресную книгу?')) {
            var delete_book = await delete_item(url, token, id, 'delete_book');
            if(!delete_book.error && !delete_book.message) {
                element = document.querySelector(".address-book__books-menu .custom_menu li ul li label[name='" + id +"']").parentElement;
                element.remove();
            }else{
                alert(delete_book.message);
            }
            document.querySelector(".users_list").style.display = 'none';
        }
    });

    $('.book_data_form').on("submit", async function() {
        var name = $(this)[0].querySelector("div #new_book").value;
        var addBook = await add_book(url, token, name);
        if (addBook) {
            var contactLists = await getDataByAddressBook(url, {
                route: 'sigmamsg/address_book',
                token: token,
                method: "getContactLists"
            });
            set_custom_menu(contactLists);
            alert("Книга успешно создана");
            $(this)[0].parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        }
    });

    $(".custom-group__title").click(async (event) => {
        var body = document.querySelector(".custom-group__body");
        var title = document.querySelector(".custom-group__title");
        if (body.style.display == 'none') {
            title.querySelector("i.glyphicon").className = "glyphicon glyphicon-chevron-up";
            body.style.display = 'inline-block';
        } else {
            body.style.display = 'none';
            title.querySelector("i.glyphicon").className = "glyphicon glyphicon-chevron-down";
        }
    });

    function delete_item(url, token, id, method) {
        return fetch(url + "?" + new URLSearchParams({
            route: 'sigmamsg/address_book',
            token: token,
            id: id,
            method: method
        }), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
    };

    function add_book(url, token, name) {
        return fetch(url + "?" + new URLSearchParams({
            route: 'sigmamsg/address_book',
            token: token,
            method: "add_book"
        }), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: name})
        })
            .then((response) => response.json())
    };


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

})

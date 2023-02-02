document.addEventListener('DOMContentLoaded', async function() {

    var get_users_by_total_end;
    var get_users_by_total_start;
    var total_start = '';
    var total_end = '';
    var status_id = '';
    var manufacturer_id = '';
    var customer_group_id = '';
    var product_categories_id = '';
    var ww = window.innerWidth;

    var customersFromStore = await getDataByAddressBook(url, {
        route: 'sigmamsg/address_book',
        token: token,
        method: "getCustomers"
    });

    var maxOrderSumm = await getDataByAddressBook(url, {
        route: 'sigmamsg/address_book',
        token: token,
        method: "SelectMaxOrderSumm"
    });


    var groupList = await getDataByAddressBook(url, {
        route: 'sigmamsg/address_book',
        token: token,
        method: "getGroupList",
    });

    var manufacturer_list = await getDataByAddressBook(url, {
        route: 'sigmamsg/address_book',
        token: token,
        method: "getManufacturer",
    });

    var product_categories = await getDataByAddressBook(url, {
        route: 'sigmamsg/address_book',
        token: token,
        method: "getCategories",
    });


    setFiletermoneyRangeEnd(maxOrderSumm);

    function setFiletermoneyRangeEnd(maxOrderSumm){
        if(maxOrderSumm.total){
            var total = parseInt(maxOrderSumm.total);
            document.querySelector(".import_users__money-range-start input[type='range']").setAttribute("max", total);
            document.querySelector(".import_users__money-range-start input[type='number']").setAttribute("max", total);
            document.querySelector(".import_users__money-range-end input[type='range']").setAttribute("max", total);
            document.querySelector(".import_users__money-range-end input[type='range']").value = total;
            document.querySelector(".import_users__money-range-end input[type='number']").setAttribute("max", total);
            document.querySelector(".import_users__money-range-end input[type='number']").value = total;
        }
    }

    var selectCustomersFromStore = Object.assign({}, customersFromStore);


    $("body").on("change",".import_users input[type='checkbox']", async(event)=>{
        var element = event.currentTarget;
        if(event.currentTarget.checked){
            selectCustomersFromStore[element.value] = customersFromStore[element.value]
        }else{
            delete selectCustomersFromStore[element.value]
        }
    });

    $(".import_users__btn").click(async ()=>{
        var addcustomers = await addCustomersInExistBook(url, token, selectCustomersFromStore, current_open_book_id);
        alert("Пользователи успешно импортированы");
        document.querySelector(".import_users").style.display = "none";
    })

    set_selected_filter(product_categories, document.querySelector(".import_users__filter-categories"))
    set_selected_filter(manufacturer_list, document.querySelector(".import_users__select--manufacturer"))
    set_selected_filter(groupList, document.querySelector(".import_users__select-usersGroup"))

    if(ww>=600) {
        var table = $('#importCustomerByStore__table').DataTable({
            columns: [
                {data: ''},
                {data: 'phone'},
                {data: 'lastName'},
                {data: 'firstName'},
                {data: 'email'},
                {data: 'group_name'},
                {data: 'total'}
            ]
        });
    }else{
        var table = $('#importCustomerByStore__table').DataTable({
            columns: [
                {data: ''},
                {data: 'phone'},
                {data: 'lastName'},
                {data: 'firstName'},
            ]
        });
    }

    set_customer_table();

    $(".import_users__select--manufacturer").on('change',async function(){
        var element = $(this)[0];
        manufacturer_id = element.value;
        customersFromStore = await getDataByAddressBook(url, {
            route: 'sigmamsg/address_book',
            token: token,
            method: "getCustomers",
            total_start: total_start,
            total_end: total_end,
            status_id: status_id,
            manufacturer_id: manufacturer_id,
            customer_group_id: customer_group_id,
            product_categories_id: product_categories_id
        });

        selectCustomersFromStore = Object.assign({}, customersFromStore);
        set_customer_table(customersFromStore);
    })



    $(".import_users__select-usersGroup").on('change',async function(){
        var element = $(this)[0];
        customer_group_id = element.value;

        customersFromStore = await getDataByAddressBook(url, {
            route: 'sigmamsg/address_book',
            token: token,
            method: "getCustomers",
            total_start: total_start,
            total_end: total_end,
            status_id: status_id,
            manufacturer_id: manufacturer_id,
            customer_group_id: customer_group_id,
            product_categories_id: product_categories_id
        });

        selectCustomersFromStore = Object.assign({}, customersFromStore);

        set_customer_table(customersFromStore);
    })

    $(".import_users__filter-categories").on('change',async function(){
        var element = $(this)[0];
        product_categories_id = element.value;

        customersFromStore = await getDataByAddressBook(url, {
            route: 'sigmamsg/address_book',
            token: token,
            method: "getCustomers",
            total_start: total_start,
            total_end: total_end,
            status_id: status_id,
            manufacturer_id: manufacturer_id,
            customer_group_id: customer_group_id,
            product_categories_id: product_categories_id
        });

        selectCustomersFromStore = Object.assign({}, customersFromStore);

        set_customer_table(customersFromStore);
    })

    $(".import_users__select-status").on("change",async function(){
        var element = $(this)[0];
        status_id = element.value;

        customersFromStore = await getDataByAddressBook(url, {
            route: 'sigmamsg/address_book',
            token: token,
            method: "getCustomers",
            total_start: total_start,
            total_end: total_end,
            status_id: status_id,
            manufacturer_id: manufacturer_id,
            customer_group_id: customer_group_id,
            product_categories_id: product_categories_id
        });
        
        selectCustomersFromStore = Object.assign({}, customersFromStore);

        set_customer_table(customersFromStore);
    });


    $("#importCustomerByStore__table .select_all_users").on("change", function(){
        var element = $(this)[0];
        var table = $("#importCustomerByStore__table").dataTable();
        if(element.checked){
            selectCustomersFromStore = Object.assign({}, customersFromStore);
            for(var idx in table.fnGetData()){
                table.fnUpdate('<input type="checkbox" checked value="'+ idx +'">', idx, 0 );
            }
        }else{
            selectCustomersFromStore = {};
            for(var idx in table.fnGetData()){
                table.fnUpdate('<input type="checkbox" value="'+ idx +'">', idx, 0 );
            }
        }
    })


    $(".import_users__money-range-end input[type='range']").on("change", function(){
        var element = $(this)[0];
        total_start = document.querySelector(".import_users__money-range-start input[type='range']").value;
        total_end = element.value;
        document.querySelector(".import_users__money-range-end input[type='number']").value = total_end;

        if(total_end){
            if(get_users_by_total_end){
                clearTimeout(get_users_by_total_end);
                get_users_by_total_end = '';
            }
            get_users_by_total_end = setTimeout(async ()=>{

                customersFromStore = await getDataByAddressBook(url, {
                    route: 'sigmamsg/address_book',
                    token: token,
                    method: "getCustomers",
                    total_start: total_start,
                    total_end: total_end,
                    status_id: status_id,
                    manufacturer_id: manufacturer_id,
                    customer_group_id: customer_group_id,
                    product_categories_id: product_categories_id
                });

                selectCustomersFromStore = Object.assign({}, customersFromStore);

                set_customer_table(customersFromStore);

                get_users_by_total_end = '';
            },1000)
        }
    })

    $(".import_users__money-range-end input[type='number']").on("change", function(){
        var element = $(this)[0];
        total_start = document.querySelector(".import_users__money-range-start input[type='number']").value;
        total_end = element.value;
        document.querySelector(".import_users__money-range-end input[type='range']").value = total_end;

        if(total_end){
            if(get_users_by_total_end){
                clearTimeout(get_users_by_total_end);
                get_users_by_total_end = '';
            }
            get_users_by_total_end = setTimeout(async ()=>{

                customersFromStore = await getDataByAddressBook(url, {
                    route: 'sigmamsg/address_book',
                    token: token,
                    method: "getCustomers",
                    total_start: total_start,
                    total_end: total_end,
                    status_id: status_id,
                    manufacturer_id: manufacturer_id,
                    customer_group_id: customer_group_id,
                    product_categories_id: product_categories_id
                });

                selectCustomersFromStore = Object.assign({}, customersFromStore);

                set_customer_table(customersFromStore);

                get_users_by_total_end = '';
            },1000)
        }
    })

    $(".import_users__money-range-start input[type='range']").on("change", function(){
        var element = $(this)[0];
        total_start = element.value;
        total_end = document.querySelector(".import_users__money-range-end input").value;

        document.querySelector(".import_users__money-range-start input[type='number']").value = total_start;

        if(get_users_by_total_start){
            clearTimeout(get_users_by_total_start);
            get_users_by_total_start = '';
        }
        get_users_by_total_start = setTimeout(async ()=>{

            customersFromStore = await getDataByAddressBook(url, {
                route: 'sigmamsg/address_book',
                token: token,
                method: "getCustomers",
                total_start: total_start,
                total_end: total_end,
                status_id: status_id,
                manufacturer_id: manufacturer_id,
                customer_group_id: customer_group_id,
                product_categories_id: product_categories_id
            });

            selectCustomersFromStore = Object.assign({}, customersFromStore);

            set_customer_table(customersFromStore);

            get_users_by_total_start = '';
        },1000)
    })

    $(".import_users__money-range-start input[type='number']").on("change", function(){
        var element = $(this)[0];
        total_start = element.value;
        total_end = document.querySelector(".import_users__money-range-end input").value;

        document.querySelector(".import_users__money-range-start input[type='range']").value = total_start;

        if(get_users_by_total_start){
            clearTimeout(get_users_by_total_start);
            get_users_by_total_start = '';
        }
        get_users_by_total_start = setTimeout(async ()=>{

            customersFromStore = await getDataByAddressBook(url, {
                route: 'sigmamsg/address_book',
                token: token,
                method: "getCustomers",
                total_start: total_start,
                total_end: total_end,
                status_id: status_id,
                manufacturer_id: manufacturer_id,
                customer_group_id: customer_group_id,
                product_categories_id: product_categories_id
            });

            selectCustomersFromStore = Object.assign({}, customersFromStore);

            set_customer_table(customersFromStore);

            get_users_by_total_start = '';
        },1000)
    })

    function set_selected_filter(list, filter){
        list.forEach((item)=>{
            let option = document.createElement('option');
            option.value = item.id;
            if( item.hasOwnProperty("name")){
                option.textContent = item.name;
            }
            if( item.hasOwnProperty("title")){
                option.textContent = item.title;
            }
            filter.append(option);
        })
    }

    function set_customer_table() {
        $('#importCustomerByStore__table').dataTable().fnClearTable();
        if (customersFromStore.length) {
            if(ww>=600) {
                for (customer in customersFromStore) {
                    $('#importCustomerByStore__table').dataTable().fnAddData([
                        {
                            "":"<input type='checkbox' checked value='"+ customer +"' >",
                            phone: customersFromStore[customer].phone,
                            lastName: customersFromStore[customer].lastname,
                            firstName: customersFromStore[customer].firstname,
                            email: customersFromStore[customer].email,
                            group_name: customersFromStore[customer].group_name,
                            total: customersFromStore[customer].total
                        },
                    ]);
                }

            }else{
                for (customer in customersFromStore) {
                    $('#importCustomerByStore__table').dataTable().fnAddData([
                        {
                            "":"<input type='checkbox' checked value='"+ customer +"' >",
                            phone: customersFromStore[customer].phone,
                            lastName: customersFromStore[customer].lastname,
                            firstName: customersFromStore[customer].firstname,
                        },
                    ]);
                }

            }

        }
    }

    function getDataByAddressBook(url, params) {
        return fetch(url + "?" + new URLSearchParams(params), {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
            .then((response) => response.json())
    };

    function addCustomersInExistBook(url, auth_token, data, book_id) {
        return fetch(url + "?" + new URLSearchParams({
            route: 'sigmamsg/address_book',
            token: auth_token,
            method: "addCustomersInExistBook",
            book_id: book_id
        }), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
    };

})
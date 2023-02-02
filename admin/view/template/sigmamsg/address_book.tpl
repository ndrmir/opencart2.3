<?php echo $header; ?><?php echo $column_left; ?>
<div id="content">
    <div id="sigma-messanging">
        <?= $sigmamsg_header; ?>

        <div class="modal modal-back change_name_book" tabindex="-1" role="dialog"
             style=" display:none; background-color: #0000006e;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" name="close" id="close_modal">&times;
                        </button>
                        <h3 class="modal-title text-center noselect" style="margin:0;"></h3>
                    </div>
                    <div class="modal-body">
                        <form class="book_data_form" method="POST" action="javascript:void(0);">
                            <div class="form-group">
                                <label for="book_name">Имя</label>
                                <input type="text" name="book_name" class="form-control" id="book_name"
                                       autocomplete="new-password" required="">
                            </div>
                            <div class="btn-div" >
                                <button type="submit" class="btn btn-primary change_book_data">
                                    Сохранить
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>

        <?= $modal_add_user ?>

        <div class="modal modal-back new_book custom-modal" tabindex="-1" role="dialog"
             style=" display:none; background-color: #0000006e;">
            <div class="modal-dialog" >
                <div class="modal-content" >
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" name="close" id="close_modal">&times;
                        </button>
                        <h3 class="modal-title text-center noselect" style="margin:0;">Добавить книгу</h3>
                    </div>
                    <div class="modal-body">
                        <form class="book_data_form" method="POST" action="javascript:void(0);">
                            <div class="form-group">
                                <label for="new_book">Название адресной книги</label>
                                <input type="text" name="new_book" class="form-control" id="new_book"
                                       autocomplete="new-password" required="">
                            </div>
                            <div class="btn-div" >
                                <button type="submit" class="btn btn-primary add_book">Сохранить </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>

        <?= $customer_by_store_modal; ?>

        <div class="modal modal-back upload-csv" tabindex="-1" role="dialog" style=" display:none; background-color: #0000006e;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" name="close" id="close_modal">&times;
                        </button>
                        <h3 class="modal-title text-center noselect" style="margin:0;">Загрузить Документ</h3>
                    </div>
                    <div class="modal-body">
                        <form class="upload-csv__form" id="upload-csv__form" method="POST" action="javascript:void(0);">
                            <i class="glyphicon glyphicon-folder-open"></i>
                            <label class="upload-csv__label" for="new_book_by_csv"> <i
                                        class="glyphicon glyphicon-cloud-upload"></i> Загрузить</label>
                            <input type="file" name="new_book" class="form-control upload-csv__input"
                                   id="new_book_by_csv" accept=".xls, .xlsx, .csv"
                                   autocomplete="new-password" required="">
                        </form>
                    </div>
                </div>
            </div>
        </div>


        <div class="col-sm-12 address-book">

            <div class="col-lg-12 col-sm-12 cl-xs-12">
            </div>

            <div class="col-lg-3 col-md-12 cl-xs-12 address-book__books-menu">
                <ul class="custom_menu">
                    <li>
                        <p class="parent template_menu_title"><i class="glyphicon glyphicon-book"></i> Адресные книги <i class="open_add_book" >+</i> </p>
                        <ul>
                        </ul>
                    </li>
                </ul>
            </div>

            <div class="col-lg-9 col-md-12 cl-xs-12 users_list"  style="display: none;">
                <div class="col-lg-12 col-md-12 cl-xs-12 users_list__button-group">
                    <h3></h3>
                    <button type="button" id="delete_book">
                        <i class="glyphicon glyphicon-trash"></i>Удалить
                    </button>

                    <button type="button" id="open_import_users">
                        <i class="glyphicon glyphicon-shopping-cart"></i> Импорт из магазина
                    </button>
                    <button type="button" id="open_upload_contacts">
                        <i class="glyphicon glyphicon-cloud-upload"></i> Импорт
                    </button>
                    <button type="button" class="open_add_contact" name="open_add_contact" id="open_add_contact">+ ДОБАВИТЬ КОНТАКТ
                    </button>
                </div>
                <table id="users_by_addressBook"  data-page-length='25' class="table table-striped table-bordered" >
                    <thead>
                    <tr>
                        <th scope="col" class="phone" >Телефон</th>
                        <th scope="col" class="lastname" >Фамилия</th>
                        <th scope="col" class="firstname" >Имя</th>
                        <th scope="col" class="middleName" >Отчество</th>
                        <th scope="col" class="email" >Email</th>
                        <th scope="col" class="date" >Дата</th>
                        <th scope="col" class="custom_01" >Произвольное поле 01</th>
                        <th scope="col" class="custom_02" >Произвольное поле 02</th>
                        <th scope="col"></th>

                    </tr>
                    </thead>
                    <tbody class="users_table">

                    </tbody>
                </table>
            </div>

        </div>
    </div>
</div>
<?php echo $footer; ?>
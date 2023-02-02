<div class="modal modal-back import_users" tabindex="-1" role="dialog"
     style=" display:none; background-color: #0000006e;">
    <div class="modal-dialog" >
        <div class="modal-content">
            <div class="modal-header import_users__header" style="position:relative;"  >
                <div class="col-sm-3 hidden-xs  import_users__filter-title" >
                    <h3 class="modal-title text-center noselect" style="margin:0;">Фильтры</h3>
                </div>
                <div class="col-sm-9 import_users__title"  >
                    <h3 class="modal-title text-center noselect" style="margin:0;">Импортировать пользователей из магазина</h3>
                    <div class="import_users__btn-div" >
                        <button type="button" class="btn btn-primary import_users__btn">Добавить <i class="glyphicon glyphicon-floppy-open" ></i></button>
                    </div>
                </div>
                <button type="button" class="close" data-dismiss="modal" name="close" id="close_modal" style="position: absolute; right: 10px; top: 15px;" >×
                </button>
            </div>
            <div class="modal-body import_users__body">

                <div class="col-lg-3 col-md-3 col-xs-12" style="padding: 0;" >
                    <div class="row required import_users__filter-order-status">
                        <label class="col-sm-12 " for="import_users__select-status">По статусу доставки</label>
                        <div class="col-lg-12 col-md-12 col-xs-12">
                            <select name="import_users__select-status" id="import_users__select-status" class="form-control import_users__select-status">
                                <option value="" selected="selected" > --- Выберите ---</option>
                                <option value="1">Ожидание</option>
                                <option value="2">В обработке</option>
                                <option value="3">Доставлено</option>
                                <option value="5" >Сделка завершена</option>
                                <option value="7" >Отменено</option>
                                <option value="8" >Возврат</option>
                                <option value="9" >Отмена и аннулирование</option>
                                <option value="10" >Неудавшийся</option>
                                <option value="11" >Возмещенный</option>
                                <option value="12" >Полностью измененный</option>
                                <option value="13">Полный возврат</option>
                            </select>
                        </div>
                    </div>

                    <div class="row import_users__money-range" >
                        <div class="col-lg-12" >
                            <strong>Общая сумма заказов</strong>
                        </div>
                        <div class="col-lg-12 col-md-12 col-xs-6 import_users__money-range-start" >
                            <label for="start_money_in">От:</label>
                            <input type="number" value="0"  id="start_money_in" style="width: 100px;" >
                            <label for="volume">₽</label>
                            <input type="range" id="volume" value='0' name="volume" min="0" max="11">
                        </div>

                        <div class="col-lg-12 col-md-12 col-xs-6 import_users__money-range-end" >
                            <label for="end_money_in">До: </label>
                            <input type="number" id="end_money_in" style="width: 100px;" >
                            <input type="range" id="volume" name="volume" value='11' min="0" max="11">
                        </div>


                    </div>

                    <div class="row required import_users__other-filter">
                        <div class="col-lg-12 col-md-12 col-xs-6">
                            <label  for="import_users__filter-categories">По категории товаров</label>
                            <select name="import_users__filter-categories" id="import_users__filter-categories" class="form-control import_users__filter-categories">
                                <option value="" selected="selected" > --- Выберите ---</option>
                            </select>
                        </div>
                        <div class="col-lg-12 col-md-12 col-xs-6">
                            <label for="import_users__select--manufacturer">По производителю товара</label>
                            <select name="import_users__select--manufacturer" id="import_users__select--manufacturer" class="form-control import_users__select--manufacturer">
                                <option value="" selected="selected" > --- Выберите ---</option>
                            </select>
                        </div>
                        <div class="col-lg-12 col-md-12 col-xs-12">
                            <label for="import_users__select-usersGroup">По группе пользователей</label>
                            <select name="import_users__select-usersGroup" id="import_users__select-usersGroup" class="form-control import_users__select-usersGroup">
                                <option value="" selected="selected" > --- Выберите ---</option>
                            </select>
                        </div>

                    </div>

                </div>

                <div class="col-lg-9 col-md-9 col-xs-12 table_div " >
                    <table class="table " id="importCustomerByStore__table">
                        <thead>
                        <tr>
                            <th scope="col" style="padding: 10px" ><input class="select_all_users" type="checkbox" checked value="all_user"></th>
                            <th scope="col">Телефон</th>
                            <th scope="col">Фамилия</th>
                            <th scope="col">Имя</th>
                            <th scope="col" class="hidden-xs" >Email</th>
                            <th scope="col" class="hidden-xs">Группа</th>
                            <th scope="col" class="hidden-xs">Сумма</th>
                        </tr>
                        </thead>
                        <tbody class="import_users__tbody">
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
</div>
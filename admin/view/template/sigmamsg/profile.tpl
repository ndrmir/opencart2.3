<?php echo $header; ?><?php echo $column_left; ?>
<div id="content">
    <div id="sigma-messanging">
        <?= $sigmamsg_header; ?>
        <div>
            <div id="sigma_user-settings" class="col-lg-12">
                <div class="container col-sm-6">
                    <div class=" col-lg-12 col-md-12 col-xs-12 settings_type">
                        <div class="col-lg-6 col-md-6 col-xs-6 active" id="customer_msg_type_div">
                            <label>Основное
                                <input type="radio" name="setting_type" class="main_type" value="main_settings">
                            </label>
                        </div>
                        <div class="col-lg-6 col-md-6 col-xs-6 " id="admin_msg_type_div">
                            <label>Реквизиты
                                <input type="radio" name="setting_type" class='requisites_type' value="requisites_settings">
                            </label>
                        </div>
                    </div>

                    <div class=" col-sm-12 main_settings">

                        <form class="user_data_form" method="POST" action="javascript:void(0);">
                            <br>
                            <h3 style="margin:0;" >Личные данные:</h3>

                            <input type="hidden" name="update_userData" >
                            <div class="form-group">
                               <h4> <label for="login">Логин</label></h4>
                                <input type="text" name="login" class="form-control sigma_input" id="login" placeholder="Логин">
                            </div>
                            <div class="form-group">
                                <h4><label for="email">Email</label></h4>
                                <input type="text" name="email" class="form-control sigma_input" id="email" placeholder="Email">
                            </div>
                            <div class="form-group">
                                <h4> <label for="firstname">Имя</label></h4>
                                <input type="text" name="firstname" class="form-control sigma_input" id="firstname" placeholder="Имя">
                            </div>
                            <div class="form-group">
                                <h4> <label for="secondname">Фамилия</label></h4>
                                <input type="text" name="secondname" class="form-control sigma_input" id="secondname" placeholder="Фамилия">
                            </div>
                            <div class="form-group">
                                <h4> <label for="phone">Телефон</label></h4>
                                <input type="text" name="phone" class="form-control sigma_input" id="phone" placeholder="Телефон">
                            </div>
                            <div class="button_div" >
                                <button type="button" class="btn col-sm-5 open_change_password" >Сменить пароль</button>
                                <button type="submit" class="btn btn-primary col-sm-3">Сохранить</button>
                            </div>
                            <br>
                            <div class="alert alert-success col-lg-6 text-center change_data_succ" style="margin-left:20px; display: none;">
                                <strong></strong>
                            </div>
                        </form>

                        <form class="change_pass_form" name="change_pass_form" id="change_pass_form" method="POST" action="javascript:void(0);" style="display:none;" >
                            <h3>Авторизационные данные:</h3>
                            <div class="passwords-group" >
                                <div class="form-group">
                                    <h4><label for="currant_pass">Текущий пароль</label></h4>
                                    <input type="password" name="currant_pass" class="form-control sigma_input" id="currant_pass" required>
                                </div>
                                <div class="form-group">
                                    <h4><label for="new_pass">Новый пароль</label></h4>
                                    <input type="password" name="new_pass" class="form-control sigma_input" id="new_pass" required>
                                </div>
                                <div class="form-group">
                                    <h4><label for="repeat_pass">Повторите пароль</label></h4>
                                    <input type="password" name="repeat_pass" class="form-control sigma_input" id="repeat_pass" autocomplete="new-password" required>
                                </div>
                                <div class="button_div" >
                                    <button type="submit" id='save_changes_pass' class="btn btn-primary save_changes_pass col-sm-3">Сохранить</button>
                                </div>
                                <br>
                                <div class="alert_pass_div col-lg-4 col-sm-4 col-xs-4 text-center change_pass_error" style="display:none;">
                                    <div class="alert alert-danger" role="alert">
                                    </div>
                                </div>

                                <div class="alert_pass_div col-lg-5 col-sm-5 col-xs-5" style="display:none;">
                                    <div class="alert alert-success" role="alert">
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>

                    <div class="col-sm-12 requisites_settings" style="display:none;">

                        <form class="requisite_form" method="POST" action="javascript:void(0);">
                            <div class="col-sm-12">
                                <h3>Реквизиты:</h3>
                            </div>

                            <div class="alert col-sm-12" style="background-color: #f5f5f5;"  role="alert">
                                Поля отмеченные * обязательны к заполнению
                            </div>

                            <div style="width: 100%; display: flex;">

                                <div class="form-group col-sm-12">
                                    <select name="requisites_list" class="form-control sigma_input" id="requisites_list">
                                        <option value="">Создать новый</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group col-sm-12">
                                <input type="text" name="title" class="form-control sigma_input" id="title" placeholder="Название *" required>
                            </div>

                            <div style="width: 100%; display: flex;">

                                <div class="form-group col-sm-12">
                                    <label for="representative_type">Тип *</label>
                                    <select name="representative_type" class="form-control sigma_input" id="representative_type">
                                        <option value="entity">Юридическое лицо</option>
                                    </select>
                                </div>
                            </div>

                            <h4 class="col-sm-12">Ответственный за заключение договора:</h4>

                            <div class="form-group col-sm-4">
                                <input type="text" name="firstName" class="form-control sigma_input" id="firstName" placeholder="Имя">
                            </div>

                            <div class="form-group col-sm-4">
                                <input type="text" name="secondName" class="form-control sigma_input" id="secondName" placeholder="Фамилия">
                            </div>

                            <div class="form-group col-sm-4">
                                <input type="text" name="lastName" class="form-control sigma_input" id="lastName" placeholder="Отчество">
                            </div>

                            <div class="form-group col-sm-6">
                                <input type="text" name="email" class="form-control sigma_input" id="email" placeholder="E-mail">
                            </div>

                            <div class="form-group col-sm-6">
                                <input type="text" name="phone" class="form-control sigma_input" id="phone" placeholder="Телефон">
                            </div>
                            <div class="col-sm-12">
                                <h4>Подписант</h4>
                            </div>
                            <div class="form-group col-sm-4">
                                <input type="text" name="FULL_NAME_nominative" class="form-control sigma_input" id="FULL_NAME_nominative" placeholder="Ф.И.О полностью *" required>
                                <small class="form-text text-muted">Именительные падеж</small>
                            </div>

                            <div class="form-group col-sm-4">
                                <input type="text" name="position_nominative" class="form-control sigma_input" id="position_nominative" placeholder="Должность *" required>
                                <small class="form-text text-muted">Именительные падеж</small>
                            </div>

                            <div class="form-group col-sm-4">
                                <input type="text" name="basis_nominative" class="form-control sigma_input" id="basis_nominative" placeholder="Основание *" required>
                                <small class="form-text text-muted">Именительные падеж</small>
                            </div>
                            <br>
                            <div class="form-group col-sm-4">
                                <input type="text" name="FULL_NAME_genitive" class="form-control sigma_input" id="FULL_NAME_genitive" placeholder="Ф.И.О полностью *" required>
                                <small class="form-text text-muted">Родительный падеж</small>
                            </div>

                            <div class="form-group col-sm-4">
                                <input type="text" name="position_genitive" class="form-control sigma_input" id="position_genitive" placeholder="Должность *" required>
                                <small class="form-text text-muted">Родительный падеж</small>
                            </div>

                            <div class="form-group col-sm-4">
                                <input type="text" name="basis_genitive" class="form-control sigma_input" id="basis_genitive" placeholder="Основание *" required>
                                <small class="form-text text-muted">Родительный падеж</small>
                            </div>
                            <div class="col-sm-12">
                                <h4>Правовая часть</h4>
                            </div>

                            <div>
                                <div class="form-group col-sm-6">
                                    <label for="opf">ОПФ *</label>
                                    <select name="opf" class="form-control sigma_input" id="opf" required>
                                        <option value="Индивидуальный предприниматель">Индивидуальный предприниматель</option>
                                        <option value="Общество с ограниченной ответственностью">Общество с ограниченной ответственностью</option>
                                        <option value="Акционерное общество">Акционерное общество</option>
                                        <option value="Открытое акционерное общество">Открытое акционерное общество</option>
                                        <option value="Закрытое акционерное общество">Закрытое акционерное общество</option>
                                        <option value="Публичное акционерное общество">Публичное акционерное общество</option>
                                        <option value="Унитарное предприятие">Унитарное предприятие</option>
                                        <option value="Государственное бюджетное учреждение">Государственное бюджетное учреждение</option>
                                    </select>
                                    <small class="form-text text-muted">Организационно-правовая форма (ИП, ООО...)</small>
                                </div>
                                <div class="form-group col-sm-6">
                                    <input type="text" name="company_name" class="form-control sigma_input" id="company_name" placeholder="Название компании *" required>
                                    <small class="form-text text-muted">Без кавычек и правовой формы, например ваша компания ООО "Ландыши", впишите только Ландыши</small>
                                </div>
                            </div>
                            <div style="width: 100%;" >
                                <div class="form-group col-sm-6">
                                    <input type="text" name="inn" class="form-control sigma_input" id="inn" placeholder="ИНН *" required>
                                    <small class="form-text text-muted">Длина от 10 до 12 цифр</small>
                                </div>
                                <div class="form-group col-sm-6">
                                    <input type="text" name="ogrn" class="form-control sigma_input" id="ogrn" placeholder="ОГРН *" required>
                                    <small class="form-text text-muted">Длина от 13 до 15 цифр</small>
                                </div>
                            </div>

                            <div style="width: 100%;" >
                                <div class="form-group col-sm-6">
                                    <input type="text" name="kpp" class="form-control sigma_input" id="kpp" placeholder="КПП" >
                                    <small class="form-text text-muted">Длина 9 цифр</small>
                                </div>
                                <div class="form-group col-sm-6">
                                    <input type="text" name="okpo" class="form-control sigma_input" id="okpo" placeholder="ОКПО">
                                </div>
                            </div>

                            <div class="mailing_address" style="width:100%;" >
                                <div class="col-sm-12">
                                    <h4>Банк</h4>
                                </div>

                                <div class="form-group col-sm-12">
                                    <input type="text" name="bank_name" class="form-control sigma_input" id="bank_name" placeholder="Название банка *">
                                </div>

                                <div style="width: 100%;" >
                                    <div class="form-group col-sm-4">
                                        <input type="text" name="rs" class="form-control sigma_input" id="rs" placeholder="Расчетный счет *">
                                        <small class="form-text text-muted">Длина 20 цифр</small>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <input type="text" name="ks" class="form-control sigma_input" id="ks" placeholder="Корреспондентский счет *">
                                        <small class="form-text text-muted">Длина 20 цифр</small>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <input type="text" name="bik" class="form-control sigma_input" id="bik" placeholder="БИК *">
                                        <small class="form-text text-muted">Длина 9 цифр</small>
                                    </div>
                                </div>
                            </div>


                            <div style="width:100%; display: flex; align-items: flex-end; justify-content: center;" >
                                <div class="form-group col-sm-6">
                                    <label for="system">Налоговая система *</label>
                                    <select name="system" class="form-control sigma_input" id="system" required>
                                        <option value="ОСНО" selected >ОСНО</option>
                                        <option value="УСН">УСН</option>
                                        <option value="ЕНВД">ЕНВД</option>
                                        <option value="ЕСН">ЕСН</option>
                                    </select>
                                </div>

                                <div class="col-sm-6" style="margin-bottom:10px; display:flex; align-items:center;">
                                    <input type="checkbox" id="vat" name="vat">
                                    <label for="vat" style=" margin:0 0 0 10px; font-size:17px;">С НДС</label>
                                </div>
                            </div>




                            <div class="col-sm-12">
                                <h4>Юридический адрес</h4>
                            </div>

                            <div style="width: 100%;">
                                <div class="form-group col-sm-6">
                                    <input type="text" name="legal_country" class="form-control sigma_input" id="legal_country" placeholder="Страна *" required>
                                </div>
                                <div class="form-group col-sm-6">
                                    <input type="text" name="legal_city" class="form-control sigma_input" id="legal_city" placeholder="Город *" required>
                                </div>
                            </div>

                            <div style="width: 100%;" >
                                <div class="form-group col-sm-6">
                                    <input type="text" name="legal_index" class="form-control sigma_input" id="legal_index" placeholder="Индекс *" required>
                                </div>
                                <div class="form-group col-sm-6">
                                    <input type="text" name="legal_address" class="form-control sigma_input" id="legal_address" placeholder="Адрес *" required>
                                    <small class="form-text text-muted">Улица, дом, корпус, строение, офис / квартира</small>
                                </div>
                            </div>

                            <div style="width: 100%;" >
                                <div class="form-group col-sm-6">
                                    <input type="text" name="legal_phone" class="form-control sigma_input" id="legal_phone" placeholder="Телефон">
                                </div>
                                <div class="form-group col-sm-6">
                                    <input type="text" name="legal_phoneAdd" class="form-control sigma_input" id="legal_phoneAdd" placeholder="Добавочный номер">
                                </div>
                            </div>

                            <div class="mailing_address" style="width:100%;" >
                                <div class="col-sm-12">
                                    <h4>Почтовый адрес</h4>
                                </div>

                                <div style="width: 100%;">
                                    <div class="form-group col-sm-6">
                                        <input type="text" name="postal_country" class="form-control sigma_input" id="postal_country" placeholder="Страна *">
                                    </div>
                                    <div class="form-group col-sm-6">
                                        <input type="text" name="postal_city" class="form-control sigma_input" id="postal_city" placeholder="Город *">
                                    </div>
                                </div>

                                <div style="width: 100%;" >
                                    <div class="form-group col-sm-6">
                                        <input type="text" name="postal_index" class="form-control sigma_input" id="postal_index" placeholder="Индекс *">
                                    </div>
                                    <div class="form-group col-sm-6">
                                        <input type="text" name="postal_address" class="form-control sigma_input" id="postal_address" placeholder="Адрес *">
                                        <small class="form-text text-muted">Улица, дом, корпус, строение, офис / квартира</small>
                                    </div>
                                </div>

                                <div style="width: 100%;" >
                                    <div class="form-group col-sm-6">
                                        <input type="text" name="postal_phone" class="form-control sigma_input" id="postal_phone" placeholder="Телефон">
                                    </div>
                                    <div class="form-group col-sm-6">
                                        <input type="text" name="postal_phoneAdd" class="form-control sigma_input" id="postal_phoneAdd" placeholder="Добавочный номер">
                                    </div>
                                </div>
                            </div>

                            <div class="alert col-sm-12" style="background-color: #f5f5f5;"  role="alert">
                                Поля отмеченные * обязательны к заполнению
                            </div>

                            <div class="button_div" style="display: flex; width: 100%; justify-content: flex-end; margin-bottom:20px;" >
                                <button type="button" id='delete_requisite' class="btn btn-danger delete_requisite" style="display: none;">Удалить</button>
                                <button type="button" id='update_requisite' class="btn btn-primary update_requisite" style="display: none; margin-left:20px;">Обновить</button>
                                <button type="submit" id='save_requisite' class="btn btn-success save_requisite" style="margin-left:20px;">Сохранить</button>
                            </div>

                        </form>
                    </div>
            </div>
        </div>

    </div>
</div>
<?php echo $footer; ?>

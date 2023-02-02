<div class="modal modal-back add_contact_div" tabindex="-1" role="dialog"
     style=" display:none; background-color: #0000006e;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" name="close" data-dismiss="modal" id="close_modal">&times;
                </button>
                <h3 class="modal-title text-center noselect" style="margin:0;">Добавить контакт:</h3>
            </div>
            <div class="modal-body">
                <form class="modal-user__form" id="user__form" method="POST" action="javascript:void(0);">
                    <div class="col-lg-12 col-md-12 col-xs-12" style="display: flex; justify-content: space-between; padding: 0;">
                        <div class="col-lg-6 col-md-6 col-xs-12 phone-data">
                            <label for="phone">Мобильный телефон:</label>

                            <input type="text" name="phone" class="form-control modal-user__input" id="phone"
                                   autocomplete="new-password" required="">
                        </div>

                        <div class=" col-lg-6 col-md-6 col-xs-12 email-data">
                            <label for="email">Email:</label>
                            <input type="text" name="email" class="form-control modal-user__input" id="email"
                                   autocomplete="new-password" required="">
                        </div>

                    </div>

                    <div class="col-lg-12 col-md-12 col-xs-12 name-data">
                        <div class="col-lg-4" style="padding: 0 10px 0 0;">
                            <label for="firstname">Имя</label>
                            <input type="text" name="firstname"
                                   class="form-control name-data__firstname modal-user__input" id="firstName"
                                   autocomplete="new-password" required="">
                        </div>

                        <div class="lastname col-lg-4">
                            <label for="lastname">Фамилия</label>
                            <input type="text" name="lastname"
                                   class="form-control name-data__lastname modal-user__input" id="lastName"
                                   autocomplete="new-password" required="">
                        </div>

                        <div class="middleName col-lg-4" style="padding: 0 0 0 10px;">
                            <label for="middleName">Отчество:</label>
                            <input type="text" name="middleName"
                                   class="form-control  name-data__middleName modal-user__input" id="middleName"
                                   autocomplete="new-password" required="">
                        </div>
                    </div>


                    <div class=" col-lg-12 col-md-12 col-xs-12 other-data">
                        <select class="col-lg-6 col-md-6 col-xs-6 other-data__gender modal-user__input" id="gender">
                            <option value="" hidden disabled selected>Пол</option>
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                        </select>

                        <div class="other-data__datapicker  col-lg-6 col-md-6 col-xs-6">
                            <div id="datepicker" class="input-group" data-date-format="mm-dd-yyyy">
                                <label for="date">Дата рождения:</label>
                                <div style="    display: flex;">
                                    <input class="form-control modal-user__input" id="date" type="text" readonly/>
                                    <span class="input-group-addon"><i
                                                class="glyphicon glyphicon-calendar"></i></span>
                                </div>

                            </div>
                        </div>
                    </div>


                    <div class="col-lg-12 col-md-12 col-xs-12 custom-group">
                        <div class="col-lg-12 col-md-12 col-xs-12  custom-group__title"><span>Произвольные поля </span><i
                                    class="glyphicon glyphicon-chevron-down"></i></div>
                        <div class="custom-group__body" style="display: none; width: 100%;">
                            <div class="custom-group__item">
                                <label for="custom1">Произвольное поле 1:</label>
                                <input type="text" name="custom1"
                                       class="form-control custom-group__input modal-user__input" id="custom01"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom2">Произвольное поле 2:</label>
                                <input type="text" name="custom2"
                                       class="form-control custom-group__input modal-user__input" id="custom02"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom3">Произвольное поле 3:</label>
                                <input type="text" name="custom3"
                                       class="form-control custom-group__input modal-user__input" id="custom03"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom4">Произвольное поле 4:</label>
                                <input type="text" name="custom4"
                                       class="form-control custom-group__input modal-user__input" id="custom04"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom5">Произвольное поле 5:</label>
                                <input type="text" name="custom5"
                                       class="form-control custom-group__input modal-user__input" id="custom05"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom6">Произвольное поле 6:</label>
                                <input type="text" name="custom6"
                                       class="form-control custom-group__input modal-user__input" id="custom06"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom7">Произвольное поле 7:</label>
                                <input type="text" name="custom7"
                                       class="form-control custom-group__input modal-user__input" id="custom07"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom8">Произвольное поле 8:</label>
                                <input type="text" name="custom8"
                                       class="form-control custom-group__input modal-user__input" id="custom08"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom9">Произвольное поле 9:</label>
                                <input type="text" name="custom9"
                                       class="form-control custom-group__input modal-user__input" id="custom09"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom10">Произвольное поле 10:</label>
                                <input type="text" name="custom10"
                                       class="form-control custom-group__input modal-user__input" id="custom10"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom11">Произвольное поле 11:</label>
                                <input type="text" name="custom11"
                                       class="form-control custom-group__input modal-user__input" id="custom11"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom12">Произвольное поле 12:</label>
                                <input type="text" name="custom12"
                                       class="form-control custom-group__input modal-user__input" id="custom12"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom13">Произвольное поле 13:</label>
                                <input type="text" name="custom13"
                                       class="form-control custom-group__input modal-user__input" id="custom13"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom14">Произвольное поле 14:</label>
                                <input type="text" name="custom14"
                                       class="form-control custom-group__input modal-user__input" id="custom14"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom15">Произвольное поле 15:</label>
                                <input type="text" name="custom15"
                                       class="form-control custom-group__input modal-user__input" id="custom15"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom16">Произвольное поле 16:</label>
                                <input type="text" name="custom16"
                                       class="form-control custom-group__input modal-user__input" id="custom16"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom17">Произвольное поле 17:</label>
                                <input type="text" name="custom17"
                                       class="form-control custom-group__input modal-user__input" id="custom17"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom18">Произвольное поле 18:</label>
                                <input type="text" name="custom18"
                                       class="form-control custom-group__input modal-user__input" id="custom18"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom19">Произвольное поле 19:</label>
                                <input type="text" name="custom19"
                                       class="form-control custom-group__input modal-user__input" id="custom19"
                                       autocomplete="new-password">
                            </div>

                            <div class="custom-group__item">
                                <label for="custom20">Произвольное поле 20:</label>
                                <input type="text" name="custom20"
                                       class="form-control custom-group__input modal-user__input" id="custom20"
                                       autocomplete="new-password">
                            </div>
                        </div>
                    </div>
                <div class="btn-div" >
                    <button type="submit" id="add_contact" class="btn btn-primary add_contact">
                        Сохранить
                    </button>
                </div>

                </form>
            </div>
        </div>
    </div>
</div>
<?php echo $header; ?>
<?php echo $column_left; ?>

<div id="content">
    <div id="sigma-messanging">
        <?= $sigmamsg_header; ?>

        <div class="modal modal-back custom-modal create-template" style="display: none;" tabindex="-1" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title text-center noselect" style="margin:0;">Сохранить</h3>
                    </div>
                    <div class="modal-body">
                        <form class="custom-modal__form create-template__form" id="create-template__form" method="POST"
                              action="javascript:void(0);">
                            <label for="template_name">Назовите ваш шаблон</label><br>
                            <input type="text" id="template_name" class="template_name"><br>
                            <div style="display: flex; width: 100%; justify-content: flex-end;" >
                                <button type="submit" class="btn btn-primary">Создать шаблон</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-12 mass_sending">

            <div class="mass_sending__body row col-sm-12">

                <form class="mass_sending__form" name="mass_sending__form" id="mass_sending__form" method="POST" action="javascript:void(0);">

                    <div class="col-lg-3 col-md-4 col-xs-12 mass_sending__template-menu">
                        <ul class="custom_menu">
                            <li class="mass_sending__template">
                                <p class="parent template_menu_title"><i class="glyphicon glyphicon-list-alt"></i> <span>Шаблоны</span> <i class="glyphicon glyphicon-menu-down menu_switch"></i></p>
                                <ul>
                                    <li name="new_template" ><label>Новый шаблон<input type="radio" value="new_template" name="template_item"></label></li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div class="col-lg-6 col-md-6 col-xs-12 mass_sending__msg_body">


                        <div class="col-sm-12">
                            <div class="col-sm-12 mass_sending__includeAddresses">
                                <h4 >Адреса для отправки:</h4>
                                <div class="input-field">
                                    <div class="form-control sigma_input" id="address" tabindex="0"
                                         aria-describedby="addressHelp">
                                        <div class="selected_item">
                                            <input type="text" maxlength="11" class="add_phone"
                                                   autocomplete="new-password" name="include">
                                        </div>
                                        <div class="book_list include_addresses drop-List" style="display: none;">
                                        </div>
                                        <div class="arrow-input_div"><i class="arrow-input"></i></div>
                                    </div>
                                    <small id="addressHelp" class="form-text text-muted">Выберите адресную книгу или
                                        введите отдельные номера</small>
                                </div>
                            </div>

                            <div class="col-sm-12 mass_sending__excludeAddresses">
                                <h4 >Адреса для исключения:</h4>
                                <div class="input-field">
                                    <div class="form-control sigma_input" id="address" aria-describedby="addressHelp">
                                        <div class="selected_item">
                                            <input type="text" maxlength="11" class="add_phone"
                                                   autocomplete="new-password" name="exclude">
                                        </div>
                                        <div class="book_list exclude_addresses drop-List" style="display: none;">
                                        </div>
                                        <div class="arrow-input_div"><i class="arrow-input"></i></div>
                                    </div>
                                </div>
                                <small id="exclude_addressHelp" class="form-text text-muted">Выберите адресную книгу или
                                    введите отдельные номера</small>
                            </div>

                            <div class="col-sm-12 mass_sending__senderName custom_select">
                                <div class="form-group">
                                    <h4 class="sending_text">Имя отправителя:</h4>
                                    <select class="form-control senderName_list">
                                        <option selected value="">Выбрать</option>
                                    </select>
                                    <button type="button" class="btn open-create_senderName">+</button>
                                    <small class="form-text text-muted">Выберите собственное имя или введите имя по
                                        умолчанию</small>
                                </div>
                            </div>

                            <div class="col-sm-12  mass_sending__channels channels_wrapper">
                                <h4 class="channel_send">Канал отправки: </h4>
                                <div class="row col-lg-12 col-sm-12 cl-xs-12 check_block">
                                    <label class="service-label sms_label">
                                        <input class="sms_checkbox" type="radio" name="channels[]" value="sms"
                                               checked="checked">
                                        <svg width="22" height="23" class="sms_ico" viewBox="0 0 20 20" fill="none">
                                            <circle cx="10" cy="10" r="9" stroke="#777" stroke-width="2"></circle>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M13.1771 5.78723H6.91576C6.06325 5.78723 5.36566 6.47016 5.36566 7.30477V14.2127L7.12253 12.5434H13.1771C14.0291 12.5434 14.7272 11.8599 14.7272 11.0259V7.30477C14.7272 6.47075 14.0297 5.78723 13.1771 5.78723ZM8.25401 9.65935C8.25401 9.6049 8.23569 9.55725 8.19907 9.5164C8.16448 9.47361 8.1187 9.43763 8.06173 9.40846C8.00476 9.37734 7.94169 9.34817 7.87251 9.32094C7.80536 9.29176 7.7372 9.25967 7.66802 9.22466C7.59884 9.18771 7.53577 9.14784 7.4788 9.10505C7.42183 9.06032 7.37503 9.00294 7.33841 8.93292C7.30382 8.86096 7.28652 8.78025 7.28652 8.69078C7.28652 8.5313 7.34655 8.39807 7.46659 8.2911C7.58867 8.18218 7.75043 8.12772 7.95186 8.12772C8.22043 8.12772 8.4239 8.20066 8.56226 8.34653L8.36083 8.61493C8.25095 8.51379 8.12481 8.46322 7.98238 8.46322C7.89082 8.46322 7.81757 8.48364 7.76263 8.52449C7.70973 8.56533 7.68328 8.61979 7.68328 8.68786C7.68328 8.75399 7.70668 8.81137 7.75348 8.85999C7.80231 8.90861 7.86233 8.94751 7.93355 8.97668C8.00476 9.00391 8.08208 9.03698 8.1655 9.07588C8.25095 9.11477 8.32929 9.15562 8.4005 9.19841C8.47172 9.23925 8.53072 9.29954 8.57752 9.37928C8.62635 9.45708 8.65077 9.54947 8.65077 9.65644C8.65077 9.82565 8.58261 9.96471 8.44628 10.0736C8.30996 10.1806 8.14007 10.2341 7.9366 10.2341C7.7901 10.2341 7.64869 10.2059 7.51237 10.1495C7.37808 10.0911 7.28652 10.0124 7.23769 9.91317L7.45133 9.66811C7.51034 9.74201 7.5846 9.79939 7.67413 9.84023C7.76569 9.87913 7.85521 9.89858 7.9427 9.89858C8.03426 9.89858 8.10853 9.87816 8.1655 9.83732C8.2245 9.79453 8.25401 9.73521 8.25401 9.65935ZM9.08334 10.202V8.15981H9.46179L10.1912 9.1138L10.8871 8.15981H11.2411V10.202H10.8688V8.72579L10.1943 9.6331H10.1393L9.45874 8.73454V10.202H9.08334ZM12.637 9.5164C12.6736 9.55725 12.6919 9.6049 12.6919 9.65935C12.6919 9.73521 12.6624 9.79453 12.6034 9.83732C12.5464 9.87816 12.4722 9.89858 12.3806 9.89858C12.2931 9.89858 12.2036 9.87913 12.112 9.84023C12.0225 9.79939 11.9483 9.74201 11.8892 9.66811L11.6756 9.91317C11.7244 10.0124 11.816 10.0911 11.9503 10.1495C12.0866 10.2059 12.228 10.2341 12.3745 10.2341C12.578 10.2341 12.7479 10.1806 12.8842 10.0736C13.0205 9.96471 13.0887 9.82565 13.0887 9.65644C13.0887 9.54947 13.0643 9.45708 13.0154 9.37928C12.9686 9.29954 12.9096 9.23925 12.8384 9.19841C12.7672 9.15562 12.6889 9.11477 12.6034 9.07588C12.52 9.03698 12.4427 9.00391 12.3715 8.97668C12.3003 8.94751 12.2402 8.90861 12.1914 8.85999C12.1446 8.81137 12.1212 8.75399 12.1212 8.68786C12.1212 8.61979 12.1477 8.56533 12.2006 8.52449C12.2555 8.48364 12.3287 8.46322 12.4203 8.46322C12.5627 8.46322 12.6889 8.51379 12.7987 8.61493L13.0002 8.34653C12.8618 8.20066 12.6584 8.12772 12.3898 8.12772C12.1883 8.12772 12.0266 8.18218 11.9045 8.2911C11.7845 8.39807 11.7244 8.5313 11.7244 8.69078C11.7244 8.78025 11.7417 8.86096 11.7763 8.93292C11.8129 9.00294 11.8597 9.06032 11.9167 9.10505C11.9737 9.14784 12.0368 9.18771 12.1059 9.22466C12.1751 9.25967 12.2433 9.29176 12.3104 9.32094C12.3796 9.34817 12.4427 9.37734 12.4996 9.40846C12.5566 9.43763 12.6024 9.47361 12.637 9.5164Z"
                                                  fill="#0F80E9"></path>
                                        </svg>
                                        <strong>SMS</strong>
                                        <span class="checkmark"></span>
                                    </label>

                                    <label class="service-label viber_label">
                                        <input class="viber_checkbox" type="radio" name="channels[]" value="viber">
                                        <svg width="21" height="22" class="viber_ico" viewBox="0 0 21 22" fill="none">
                                            <path class="viber_cloud" fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M19.6093 5.7638C19.0816 3.47311 17.4879 1.89412 15.1597 1.39435C12.8313 0.894262 8.59014 0.845089 5.84292 1.38968C3.35836 1.88229 1.89138 3.44915 1.37708 5.74047C0.862775 8.03147 0.887572 11.4698 1.37218 13.7307C1.85678 15.9918 3.8249 17.5281 5.57628 18.0366V20.1493C5.57628 20.9136 6.49314 21.2892 7.01418 20.7372L9.11975 18.5124C9.57619 18.5386 10.0336 18.5529 10.4906 18.5529C12.0436 18.5529 13.4221 18.4524 15.138 18.1045C16.8542 17.7569 19.0825 15.8474 19.6035 13.754C20.1243 11.6603 20.138 8.05979 19.6093 5.7638Z"
                                                  stroke="#9265F1" stroke-width="2" stroke-miterlimit="22.9256"></path>
                                            <path class="viber_tube" fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M13.3374 14.9633C13.1445 14.9039 12.9611 14.8641 12.7909 14.7919C11.0246 14.0472 9.3993 13.0865 8.11171 11.6133C7.37945 10.7756 6.80637 9.82957 6.32207 8.82909C6.09216 8.35421 5.89869 7.86097 5.70123 7.37115C5.52153 6.92459 5.78664 6.46278 6.06553 6.12607C6.32758 5.81052 6.66432 5.56841 7.02923 5.39009C7.31393 5.25068 7.59496 5.33128 7.80313 5.5765C8.25284 6.10708 8.66612 6.66474 9.00072 7.27966C9.20613 7.65776 9.1498 8.1205 8.77693 8.37817C8.68632 8.44041 8.60366 8.51416 8.51948 8.58481C8.4457 8.64642 8.3759 8.70897 8.32509 8.79268C8.23233 8.94641 8.22804 9.12722 8.28774 9.29402C8.74724 10.5783 9.52206 11.5766 10.7934 12.1147C10.9967 12.2009 11.2015 12.3011 11.436 12.2731C11.8281 12.2267 11.9555 11.7885 12.2304 11.5601C12.4992 11.3367 12.843 11.3336 13.1326 11.52C13.4219 11.7061 13.7032 11.9062 13.9821 12.1084C14.2564 12.307 14.5337 12.5055 14.782 12.7277C15.0297 12.9493 15.1653 13.1077 14.9715 13.5259C14.778 13.9439 14.3565 14.5164 13.8306 14.8034C13.6821 14.8846 13.5048 14.9104 13.3374 14.963C13.5045 14.9104 13.1445 14.9033 13.3374 14.963V14.9633ZM12.6911 9.34131C12.4977 9.34504 12.3945 9.23582 12.3746 9.05595C12.3605 8.93054 12.3501 8.80295 12.3201 8.68065C12.2622 8.44041 12.1364 8.21697 11.9371 8.06978C11.8435 8.00038 11.7366 7.94935 11.6255 7.91636C11.4828 7.87498 11.3362 7.88617 11.1945 7.8507C11.0414 7.81273 10.9563 7.6867 10.9802 7.53982C11.0022 7.40632 11.1299 7.30238 11.2734 7.31264C12.1689 7.37831 12.809 7.84914 12.9005 8.9212C12.907 8.99682 12.9146 9.07649 12.8981 9.14899C12.8696 9.27285 12.7796 9.33509 12.6914 9.341C12.7796 9.33477 12.498 9.34473 12.6914 9.341L12.6911 9.34131ZM14.1281 9.39857C14.1247 9.42782 14.122 9.4966 14.1052 9.56133C14.0442 9.7969 13.6925 9.82678 13.6114 9.58871C13.5872 9.51807 13.5841 9.43779 13.5841 9.36185C13.5832 8.86426 13.4764 8.36728 13.2296 7.93472C12.9761 7.48971 12.5889 7.11598 12.1343 6.88974C11.8594 6.75312 11.5618 6.66817 11.2612 6.61713C11.1292 6.59504 10.9967 6.58166 10.8641 6.56299C10.7037 6.54027 10.6183 6.43663 10.6257 6.27575C10.633 6.12544 10.7414 6.01715 10.9024 6.02618C11.4323 6.05699 11.9448 6.17337 12.4162 6.4273C13.3744 6.94295 13.9218 7.75796 14.0819 8.84496C14.0892 8.89444 14.1006 8.94298 14.1045 8.99215C14.1137 9.11445 14.1192 9.23644 14.1284 9.39826C14.1192 9.23644 14.125 9.42751 14.1284 9.39826L14.1281 9.39857ZM10.6174 4.77176C12.9275 4.83773 14.8249 6.3965 15.2311 8.71831C15.3003 9.11383 15.3254 9.51807 15.3563 9.91951C15.3692 10.0882 15.2749 10.2491 15.0955 10.2512C14.9106 10.2534 14.827 10.0963 14.8154 9.92698C14.7915 9.59307 14.775 9.25729 14.73 8.92556C14.4906 7.17635 13.1182 5.72899 11.4054 5.41873C11.1476 5.37205 10.8837 5.3596 10.6226 5.3319C10.4576 5.31417 10.2415 5.30389 10.205 5.0954C10.1744 4.92019 10.3192 4.78141 10.483 4.77238C10.5277 4.7702 10.5727 4.77176 10.6174 4.77207C10.5727 4.77176 12.9275 4.83804 10.6174 4.77207V4.77176Z"
                                                  fill="#9265F1"></path>
                                        </svg>
                                        <strong>Viber</strong>
                                        <span class="checkmark"></span>
                                    </label>

                                    <label class="service-label voice_label">
                                        <input class="voice_checkbox" type="radio" name="channels[]" value="voice">
                                        <svg width="22" height="22" class="voice_ico" viewBox="0 0 20 20" fill="none">
                                            <rect x="-1" y="1" width="18" height="18" rx="9"
                                                  transform="matrix(-1 0 0 1 18 0)" stroke="#828282"
                                                  stroke-width="2"></rect>
                                            <path d="M4.80005 8.80017L4.80005 12.0002" stroke="#828282" stroke-width="2"
                                                  stroke-miterlimit="22.9256" stroke-linecap="round"
                                                  stroke-linejoin="round"></path>
                                            <path d="M10 5.2002V15.2002" stroke="#828282" stroke-width="2"
                                                  stroke-miterlimit="22.9256" stroke-linecap="round"
                                                  stroke-linejoin="round"></path>
                                            <path d="M7.19995 6.40015L7.19995 14.0001" stroke="#828282" stroke-width="2"
                                                  stroke-miterlimit="22.9256" stroke-linecap="round"
                                                  stroke-linejoin="round"></path>
                                            <path d="M12.3999 7.6001L12.3999 13.2001" stroke="#828282" stroke-width="2"
                                                  stroke-miterlimit="22.9256" stroke-linecap="round"
                                                  stroke-linejoin="round"></path>
                                            <path d="M15.2 9.2002V11.6002" stroke="#828282" stroke-width="2"
                                                  stroke-miterlimit="22.9256" stroke-linecap="round"
                                                  stroke-linejoin="round"></path>
                                        </svg>
                                        <strong>Voice</strong>
                                        <span class="checkmark"></span>
                                    </label>

                                    <label class="service-label vk_label">
                                        <input class="vk_checkbox" type="radio" name="channels[]" value="vk">
                                        <svg width="20" height="20" class="vk_ico" viewBox="0 0 190 190" fill="none">
                                            <path fill="#777" class="vk_logo"
                                                  d="M66.56,0 C120.32,0 71.68,0 125.44,0 C179.2,0 192,12.8 192,66.56 C192,120.32 192,71.68 192,125.44 C192,179.2 179.2,192 125.44,192 C71.68,192 120.32,192 66.56,192 C12.8,192 0,179.2 0,125.44 C0,71.68 0,96.580329 0,66.56 C0,12.8 12.8,0 66.56,0 Z"></path>
                                            <path fill="#ffffff"
                                                  d="M157.233993,66.1462211 C158.123557,63.1797719 157.233994,61 153.000244,61 L139.000244,61 C135.440505,61 133.799415,62.8830035 132.909356,64.9593945 C132.909356,64.9593945 125.789878,82.3129373 115.704198,93.5851974 C112.441227,96.8481681 110.957879,97.8863636 109.178009,97.8863636 C108.288198,97.8863636 107,96.8481681 107,93.8819658 L107,66.1462211 C107,62.586482 105.96694,61 103.000244,61 L81.0002441,61 C78.7757158,61 77.4378669,62.6521562 77.4378669,64.2179674 C77.4378669,67.5925348 82.4804603,68.3707494 83.0002441,77.8633869 L83.0002441,98.4799003 C83.0002441,103 82.1839388,103.819509 80.4040693,103.819509 C75.6579974,103.819509 64.1131647,86.388441 57.2660122,66.4427426 C55.9241353,62.5659897 54.5782535,61 51.0002441,61 L37.0002441,61 C33.0002441,61 32.2001953,62.8830035 32.2001953,64.9593945 C32.2001953,68.6675178 36.9465141,87.059256 54.2998099,111.383646 C65.8685915,127.995268 82.1682449,137 97.0002441,137 C105.899345,137 107.000244,135 107.000244,131.555007 L107.000244,119 C107.000244,115 107.843292,114.201711 110.661357,114.201711 C112.737749,114.201711 116.297488,115.239906 124.603545,123.249196 C134.095936,132.741586 135.660882,137 141.000244,137 L155.000244,137 C159.000244,137 161.000244,135 159.846475,131.053112 C158.583906,127.119411 154.051802,121.412135 148.038124,114.646617 C144.774906,110.790356 139.88045,106.637574 138.397102,104.560689 C136.320711,101.891255 136.914001,100.704429 138.397102,98.3315162 C138.397102,98.3315162 155.454123,74.3036478 157.233993,66.1462211 Z"></path>
                                        </svg>
                                        <strong>Вконтакте</strong>
                                        <span class="checkmark"></span>
                                    </label>
                                </div>
                            </div>

                            <br>

                            <div class="col-sm-12  mass_sending__sendingTime">
                                <h4>
                                    <label for="sending_time" class="sending_time_title">Запланировать время
                                        отправки:</label>
                                </h4>
                                <label class="switch">
                                    <input id="sending_time" type="checkbox">
                                    <span class="slider round"></span>
                                </label>

                                <div class="row col-lg-12 col-sm-12 cl-xs-12 datetimepicker_div">
                                    <div class="form-group" style="display: none; margin: 0px;">
                                        <div class='input-group date' id='datetimepicker1'>
                                            <input type='text' class="form-control"/>
                                            <span class="input-group-addon">
                                                   <span class="glyphicon glyphicon-calendar"></span>
                                                   </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12 mass_sending__msgText">
                                <label for="msg_content">Текст:</label>
                                <textarea id="msg_content" class="msg_content"></textarea>
                                <div class="dropdown">
                                    <button class="btn btn-default dropdown-toggle set_variable" type="button"
                                            id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true"
                                            aria-expanded="true">
                                        <i class="glyphicon glyphicon-option-vertical" data-toggle="tooltip"
                                           title="Вставить переменные"></i>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style="top: 34px; max-height: 200px; overflow-y: auto;">
                                        <li><a name="${firstName}">Имя</a></li>
                                        <li><a name="${middleName}">Отчество</a></li>
                                        <li><a name="${lastName}">Фамилия</a></li>
                                        <li><a name="${phone}">Телефон</a></li>
                                        <li><a name="${email}">E-mail</a></li>
                                        <li><a name="${date}">Дата</a></li>
                                        <li><a name="${gender}">Пол</a></li>
                                        <li><a name="${custom01}">Произвольное поле 01</a></li>
                                        <li><a name="${custom02}">Произвольное поле 02</a></li>
                                        <li><a name="${custom03}">Произвольное поле 03</a></li>
                                        <li><a name="${custom04}">Произвольное поле 04</a></li>
                                        <li><a name="${custom05}">Произвольное поле 05</a></li>
                                        <li><a name="${custom06}">Произвольное поле 06</a></li>
                                        <li><a name="${custom07}">Произвольное поле 07</a></li>
                                        <li><a name="${custom08}">Произвольное поле 08</a></li>
                                        <li><a name="${custom09}">Произвольное поле 09</a></li>
                                        <li><a name="${custom10}">Произвольное поле 10</a></li>
                                        <li><a name="${custom11}">Произвольное поле 11</a></li>
                                        <li><a name="${custom12}">Произвольное поле 12</a></li>
                                        <li><a name="${custom13}">Произвольное поле 13</a></li>
                                        <li><a name="${custom14}">Произвольное поле 14</a></li>
                                        <li><a name="${custom15}">Произвольное поле 15</a></li>
                                        <li><a name="${custom16}">Произвольное поле 16</a></li>
                                        <li><a name="${custom17}">Произвольное поле 17</a></li>
                                        <li><a name="${custom18}">Произвольное поле 18</a></li>
                                        <li><a name="${custom19}">Произвольное поле 19</a></li>
                                        <li><a name="${custom20}">Произвольное поле 20</a></li>
                                    </ul>
                                </div>
                                <div class="col-sm-6 text_field_details" >
                                    <span >Символов: </span>
                                    <span class="symbol_count" >0</span>
                                    <span>; Частей: </span>
                                    <span class="piece_count" >0</span>
                                </div>
                                <div class="col-sm-6 translit_div " >
                                    <span>Перевести в транслит:</span>
                                    <label class="switch">
                                        <input id="translit" type="checkbox">
                                        <span class="slider round"></span>
                                    </label>

                                </div>


                                <div class="row col-lg-12 col-md-12 col-xs-12 mass_sending__messenger-button" style="display: none;">
                                    <div class="row col-lg-6 col-md-6 col-xs-12 add_file_div_wrapper" >
                                        <div class="add_file_div">
                                            <img class="add_file__img" src="/" style="display: none;" alt="loaded img">
                                            <label>
                                                <i class="glyphicon glyphicon-paperclip"></i> Прикрепить
                                                <input type="file" class="img_file" accept=".jpg, .jpeg, .png"
                                                       style="display: none;">
                                            </label>
                                            <span class="file_name"
                                                  style=" font-size: 12px; cursor: default; "></span>
                                        </div>
                                    </div>
                                    <div class="row col-lg-6 col-md-6 col-xs-12 button_text_field">
                                        <input type="text" class="custom-input button_link" placeholder="Ссылка кнопки">
                                        <br>
                                        <small class="form-text text-muted">Максимум 2048 символов,пример: <br>
                                            http://www.example.com </small>

                                        <input type="text" class="custom-input button_describe"
                                               placeholder="Текст кнопки">
                                        <br>
                                        <small class="form-text text-muted">Максимум 30 символов</small>
                                    </div>
                                </div>


                            </div>

                            <div class="col-sm-12 additional-settings">
                                <div class=" mass_sending__add_cascade">
                                    <h3 style="margin:0; margin-right:15px;">Переотправка:</h3>
                                    <label class="switch">
                                        <input id="add_cascade_input" type="checkbox">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                            </div>

                            <div class="col-sm-12 mass_sending__create-resend" style="display: none;">
                                <div class=" col-sm-12 resend_channels channels_wrapper">
                                    <h4 >Канал отправки: </h4>
                                    <div class="row col-lg-12 col-sm-12 cl-xs-12 check_block">
                                        <label class="service-label sms_label">
                                            <input class="sms_checkbox" type="radio" name="resend_channels[]"
                                                   value="sms"
                                                   checked="checked">
                                            <svg width="22" height="23" class="sms_ico" viewBox="0 0 20 20" fill="none">
                                                <circle cx="10" cy="10" r="9" stroke="#777" stroke-width="2"></circle>
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                      d="M13.1771 5.78723H6.91576C6.06325 5.78723 5.36566 6.47016 5.36566 7.30477V14.2127L7.12253 12.5434H13.1771C14.0291 12.5434 14.7272 11.8599 14.7272 11.0259V7.30477C14.7272 6.47075 14.0297 5.78723 13.1771 5.78723ZM8.25401 9.65935C8.25401 9.6049 8.23569 9.55725 8.19907 9.5164C8.16448 9.47361 8.1187 9.43763 8.06173 9.40846C8.00476 9.37734 7.94169 9.34817 7.87251 9.32094C7.80536 9.29176 7.7372 9.25967 7.66802 9.22466C7.59884 9.18771 7.53577 9.14784 7.4788 9.10505C7.42183 9.06032 7.37503 9.00294 7.33841 8.93292C7.30382 8.86096 7.28652 8.78025 7.28652 8.69078C7.28652 8.5313 7.34655 8.39807 7.46659 8.2911C7.58867 8.18218 7.75043 8.12772 7.95186 8.12772C8.22043 8.12772 8.4239 8.20066 8.56226 8.34653L8.36083 8.61493C8.25095 8.51379 8.12481 8.46322 7.98238 8.46322C7.89082 8.46322 7.81757 8.48364 7.76263 8.52449C7.70973 8.56533 7.68328 8.61979 7.68328 8.68786C7.68328 8.75399 7.70668 8.81137 7.75348 8.85999C7.80231 8.90861 7.86233 8.94751 7.93355 8.97668C8.00476 9.00391 8.08208 9.03698 8.1655 9.07588C8.25095 9.11477 8.32929 9.15562 8.4005 9.19841C8.47172 9.23925 8.53072 9.29954 8.57752 9.37928C8.62635 9.45708 8.65077 9.54947 8.65077 9.65644C8.65077 9.82565 8.58261 9.96471 8.44628 10.0736C8.30996 10.1806 8.14007 10.2341 7.9366 10.2341C7.7901 10.2341 7.64869 10.2059 7.51237 10.1495C7.37808 10.0911 7.28652 10.0124 7.23769 9.91317L7.45133 9.66811C7.51034 9.74201 7.5846 9.79939 7.67413 9.84023C7.76569 9.87913 7.85521 9.89858 7.9427 9.89858C8.03426 9.89858 8.10853 9.87816 8.1655 9.83732C8.2245 9.79453 8.25401 9.73521 8.25401 9.65935ZM9.08334 10.202V8.15981H9.46179L10.1912 9.1138L10.8871 8.15981H11.2411V10.202H10.8688V8.72579L10.1943 9.6331H10.1393L9.45874 8.73454V10.202H9.08334ZM12.637 9.5164C12.6736 9.55725 12.6919 9.6049 12.6919 9.65935C12.6919 9.73521 12.6624 9.79453 12.6034 9.83732C12.5464 9.87816 12.4722 9.89858 12.3806 9.89858C12.2931 9.89858 12.2036 9.87913 12.112 9.84023C12.0225 9.79939 11.9483 9.74201 11.8892 9.66811L11.6756 9.91317C11.7244 10.0124 11.816 10.0911 11.9503 10.1495C12.0866 10.2059 12.228 10.2341 12.3745 10.2341C12.578 10.2341 12.7479 10.1806 12.8842 10.0736C13.0205 9.96471 13.0887 9.82565 13.0887 9.65644C13.0887 9.54947 13.0643 9.45708 13.0154 9.37928C12.9686 9.29954 12.9096 9.23925 12.8384 9.19841C12.7672 9.15562 12.6889 9.11477 12.6034 9.07588C12.52 9.03698 12.4427 9.00391 12.3715 8.97668C12.3003 8.94751 12.2402 8.90861 12.1914 8.85999C12.1446 8.81137 12.1212 8.75399 12.1212 8.68786C12.1212 8.61979 12.1477 8.56533 12.2006 8.52449C12.2555 8.48364 12.3287 8.46322 12.4203 8.46322C12.5627 8.46322 12.6889 8.51379 12.7987 8.61493L13.0002 8.34653C12.8618 8.20066 12.6584 8.12772 12.3898 8.12772C12.1883 8.12772 12.0266 8.18218 11.9045 8.2911C11.7845 8.39807 11.7244 8.5313 11.7244 8.69078C11.7244 8.78025 11.7417 8.86096 11.7763 8.93292C11.8129 9.00294 11.8597 9.06032 11.9167 9.10505C11.9737 9.14784 12.0368 9.18771 12.1059 9.22466C12.1751 9.25967 12.2433 9.29176 12.3104 9.32094C12.3796 9.34817 12.4427 9.37734 12.4996 9.40846C12.5566 9.43763 12.6024 9.47361 12.637 9.5164Z"
                                                      fill="#0F80E9"></path>
                                            </svg>
                                            <strong>SMS</strong>
                                            <span class="checkmark"></span>
                                        </label>

                                        <label class="service-label viber_label">
                                            <input class="viber_checkbox" type="radio" name="resend_channels[]"
                                                   value="viber">
                                            <svg width="21" height="22" class="viber_ico" viewBox="0 0 21 22"
                                                 fill="none">
                                                <path class="viber_cloud" fill-rule="evenodd" clip-rule="evenodd"
                                                      d="M19.6093 5.7638C19.0816 3.47311 17.4879 1.89412 15.1597 1.39435C12.8313 0.894262 8.59014 0.845089 5.84292 1.38968C3.35836 1.88229 1.89138 3.44915 1.37708 5.74047C0.862775 8.03147 0.887572 11.4698 1.37218 13.7307C1.85678 15.9918 3.8249 17.5281 5.57628 18.0366V20.1493C5.57628 20.9136 6.49314 21.2892 7.01418 20.7372L9.11975 18.5124C9.57619 18.5386 10.0336 18.5529 10.4906 18.5529C12.0436 18.5529 13.4221 18.4524 15.138 18.1045C16.8542 17.7569 19.0825 15.8474 19.6035 13.754C20.1243 11.6603 20.138 8.05979 19.6093 5.7638Z"
                                                      stroke="#9265F1" stroke-width="2"
                                                      stroke-miterlimit="22.9256"></path>
                                                <path class="viber_tube" fill-rule="evenodd" clip-rule="evenodd"
                                                      d="M13.3374 14.9633C13.1445 14.9039 12.9611 14.8641 12.7909 14.7919C11.0246 14.0472 9.3993 13.0865 8.11171 11.6133C7.37945 10.7756 6.80637 9.82957 6.32207 8.82909C6.09216 8.35421 5.89869 7.86097 5.70123 7.37115C5.52153 6.92459 5.78664 6.46278 6.06553 6.12607C6.32758 5.81052 6.66432 5.56841 7.02923 5.39009C7.31393 5.25068 7.59496 5.33128 7.80313 5.5765C8.25284 6.10708 8.66612 6.66474 9.00072 7.27966C9.20613 7.65776 9.1498 8.1205 8.77693 8.37817C8.68632 8.44041 8.60366 8.51416 8.51948 8.58481C8.4457 8.64642 8.3759 8.70897 8.32509 8.79268C8.23233 8.94641 8.22804 9.12722 8.28774 9.29402C8.74724 10.5783 9.52206 11.5766 10.7934 12.1147C10.9967 12.2009 11.2015 12.3011 11.436 12.2731C11.8281 12.2267 11.9555 11.7885 12.2304 11.5601C12.4992 11.3367 12.843 11.3336 13.1326 11.52C13.4219 11.7061 13.7032 11.9062 13.9821 12.1084C14.2564 12.307 14.5337 12.5055 14.782 12.7277C15.0297 12.9493 15.1653 13.1077 14.9715 13.5259C14.778 13.9439 14.3565 14.5164 13.8306 14.8034C13.6821 14.8846 13.5048 14.9104 13.3374 14.963C13.5045 14.9104 13.1445 14.9033 13.3374 14.963V14.9633ZM12.6911 9.34131C12.4977 9.34504 12.3945 9.23582 12.3746 9.05595C12.3605 8.93054 12.3501 8.80295 12.3201 8.68065C12.2622 8.44041 12.1364 8.21697 11.9371 8.06978C11.8435 8.00038 11.7366 7.94935 11.6255 7.91636C11.4828 7.87498 11.3362 7.88617 11.1945 7.8507C11.0414 7.81273 10.9563 7.6867 10.9802 7.53982C11.0022 7.40632 11.1299 7.30238 11.2734 7.31264C12.1689 7.37831 12.809 7.84914 12.9005 8.9212C12.907 8.99682 12.9146 9.07649 12.8981 9.14899C12.8696 9.27285 12.7796 9.33509 12.6914 9.341C12.7796 9.33477 12.498 9.34473 12.6914 9.341L12.6911 9.34131ZM14.1281 9.39857C14.1247 9.42782 14.122 9.4966 14.1052 9.56133C14.0442 9.7969 13.6925 9.82678 13.6114 9.58871C13.5872 9.51807 13.5841 9.43779 13.5841 9.36185C13.5832 8.86426 13.4764 8.36728 13.2296 7.93472C12.9761 7.48971 12.5889 7.11598 12.1343 6.88974C11.8594 6.75312 11.5618 6.66817 11.2612 6.61713C11.1292 6.59504 10.9967 6.58166 10.8641 6.56299C10.7037 6.54027 10.6183 6.43663 10.6257 6.27575C10.633 6.12544 10.7414 6.01715 10.9024 6.02618C11.4323 6.05699 11.9448 6.17337 12.4162 6.4273C13.3744 6.94295 13.9218 7.75796 14.0819 8.84496C14.0892 8.89444 14.1006 8.94298 14.1045 8.99215C14.1137 9.11445 14.1192 9.23644 14.1284 9.39826C14.1192 9.23644 14.125 9.42751 14.1284 9.39826L14.1281 9.39857ZM10.6174 4.77176C12.9275 4.83773 14.8249 6.3965 15.2311 8.71831C15.3003 9.11383 15.3254 9.51807 15.3563 9.91951C15.3692 10.0882 15.2749 10.2491 15.0955 10.2512C14.9106 10.2534 14.827 10.0963 14.8154 9.92698C14.7915 9.59307 14.775 9.25729 14.73 8.92556C14.4906 7.17635 13.1182 5.72899 11.4054 5.41873C11.1476 5.37205 10.8837 5.3596 10.6226 5.3319C10.4576 5.31417 10.2415 5.30389 10.205 5.0954C10.1744 4.92019 10.3192 4.78141 10.483 4.77238C10.5277 4.7702 10.5727 4.77176 10.6174 4.77207C10.5727 4.77176 12.9275 4.83804 10.6174 4.77207V4.77176Z"
                                                      fill="#9265F1"></path>
                                            </svg>
                                            <strong>Viber</strong>
                                            <span class="checkmark"></span>
                                        </label>

                                        <label class="service-label voice_label">
                                            <input class="voice_checkbox" type="radio" name="resend_channels[]"
                                                   value="voice">
                                            <svg width="22" height="22" class="voice_ico" viewBox="0 0 20 20"
                                                 fill="none">
                                                <rect x="-1" y="1" width="18" height="18" rx="9"
                                                      transform="matrix(-1 0 0 1 18 0)" stroke="#828282"
                                                      stroke-width="2"></rect>
                                                <path d="M4.80005 8.80017L4.80005 12.0002" stroke="#828282"
                                                      stroke-width="2"
                                                      stroke-miterlimit="22.9256" stroke-linecap="round"
                                                      stroke-linejoin="round"></path>
                                                <path d="M10 5.2002V15.2002" stroke="#828282" stroke-width="2"
                                                      stroke-miterlimit="22.9256" stroke-linecap="round"
                                                      stroke-linejoin="round"></path>
                                                <path d="M7.19995 6.40015L7.19995 14.0001" stroke="#828282"
                                                      stroke-width="2"
                                                      stroke-miterlimit="22.9256" stroke-linecap="round"
                                                      stroke-linejoin="round"></path>
                                                <path d="M12.3999 7.6001L12.3999 13.2001" stroke="#828282"
                                                      stroke-width="2"
                                                      stroke-miterlimit="22.9256" stroke-linecap="round"
                                                      stroke-linejoin="round"></path>
                                                <path d="M15.2 9.2002V11.6002" stroke="#828282" stroke-width="2"
                                                      stroke-miterlimit="22.9256" stroke-linecap="round"
                                                      stroke-linejoin="round"></path>
                                            </svg>
                                            <strong>Voice</strong>
                                            <span class="checkmark"></span>
                                        </label>

                                        <label class="service-label vk_label">
                                            <input class="vk_checkbox" type="radio" name="resend_channels[]" value="vk">
                                            <svg width="20" height="20" class="vk_ico" viewBox="0 0 190 190"
                                                 fill="none">
                                                <path fill="#777" class="vk_logo"
                                                      d="M66.56,0 C120.32,0 71.68,0 125.44,0 C179.2,0 192,12.8 192,66.56 C192,120.32 192,71.68 192,125.44 C192,179.2 179.2,192 125.44,192 C71.68,192 120.32,192 66.56,192 C12.8,192 0,179.2 0,125.44 C0,71.68 0,96.580329 0,66.56 C0,12.8 12.8,0 66.56,0 Z"></path>
                                                <path fill="#ffffff"
                                                      d="M157.233993,66.1462211 C158.123557,63.1797719 157.233994,61 153.000244,61 L139.000244,61 C135.440505,61 133.799415,62.8830035 132.909356,64.9593945 C132.909356,64.9593945 125.789878,82.3129373 115.704198,93.5851974 C112.441227,96.8481681 110.957879,97.8863636 109.178009,97.8863636 C108.288198,97.8863636 107,96.8481681 107,93.8819658 L107,66.1462211 C107,62.586482 105.96694,61 103.000244,61 L81.0002441,61 C78.7757158,61 77.4378669,62.6521562 77.4378669,64.2179674 C77.4378669,67.5925348 82.4804603,68.3707494 83.0002441,77.8633869 L83.0002441,98.4799003 C83.0002441,103 82.1839388,103.819509 80.4040693,103.819509 C75.6579974,103.819509 64.1131647,86.388441 57.2660122,66.4427426 C55.9241353,62.5659897 54.5782535,61 51.0002441,61 L37.0002441,61 C33.0002441,61 32.2001953,62.8830035 32.2001953,64.9593945 C32.2001953,68.6675178 36.9465141,87.059256 54.2998099,111.383646 C65.8685915,127.995268 82.1682449,137 97.0002441,137 C105.899345,137 107.000244,135 107.000244,131.555007 L107.000244,119 C107.000244,115 107.843292,114.201711 110.661357,114.201711 C112.737749,114.201711 116.297488,115.239906 124.603545,123.249196 C134.095936,132.741586 135.660882,137 141.000244,137 L155.000244,137 C159.000244,137 161.000244,135 159.846475,131.053112 C158.583906,127.119411 154.051802,121.412135 148.038124,114.646617 C144.774906,110.790356 139.88045,106.637574 138.397102,104.560689 C136.320711,101.891255 136.914001,100.704429 138.397102,98.3315162 C138.397102,98.3315162 155.454123,74.3036478 157.233993,66.1462211 Z"></path>
                                            </svg>
                                            <strong>Вконтакте</strong>
                                            <span class="checkmark"></span>
                                        </label>

                                    </div>
                                </div>

                                <div class=" col-sm-12 create-resend__senderName custom_select"
                                     style="margin-top:20px;">
                                    <div class="form-group">
                                        <h4 class="sending_text">Имя отправителя:</h4>
                                        <select class="form-control senderName_list" style="margin:0;">
                                            <option selected="" value="">Выбрать</option>
                                        </select>
                                        <button type="button" class="btn open-create_senderName" style="margin:0;">+
                                        </button>
                                        <small class="form-text text-muted" style="font-size: 10.5px;">Выберите
                                            собственное имя или введите имя по умолчанию</small>
                                    </div>
                                </div>

                                <div class=" col-sm-12 create-resend__msg_conten-div"
                                     style="display: flex; flex-wrap: wrap; ">
                                    <label for="resend_msg_content" class="sending_text">Текст:</label>
                                    <textarea id="resend_msg_content" class="msg_content"></textarea>
                                    <br>
                                    <div class="dropdown" style="margin: 0;">
                                        <button class="btn btn-default dropdown-toggle set_variable" type="button"
                                                id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
                                                aria-expanded="true">
                                            <i class="glyphicon glyphicon-option-vertical" data-toggle="tooltip"
                                               title="Вставить переменные"></i>
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu2"
                                            style="top: 34px; max-height: 200px; overflow-y: auto;">
                                            <li><a name="${firstName}">Имя</a></li>
                                            <li><a name="${middleName}">Отчество</a></li>
                                            <li><a name="${lastName}">Фамилия</a></li>
                                            <li><a name="${phone}">Телефон</a></li>
                                            <li><a name="${email}">E-mail</a></li>
                                            <li><a name="${date}">Дата</a></li>
                                            <li><a name="${gender}">Пол</a></li>
                                            <li><a name="${custom01}">Произвольное поле 01</a></li>
                                            <li><a name="${custom02}">Произвольное поле 02</a></li>
                                            <li><a name="${custom03}">Произвольное поле 03</a></li>
                                            <li><a name="${custom04}">Произвольное поле 04</a></li>
                                            <li><a name="${custom05}">Произвольное поле 05</a></li>
                                            <li><a name="${custom06}">Произвольное поле 06</a></li>
                                            <li><a name="${custom07}">Произвольное поле 07</a></li>
                                            <li><a name="${custom08}">Произвольное поле 08</a></li>
                                            <li><a name="${custom09}">Произвольное поле 09</a></li>
                                            <li><a name="${custom10}">Произвольное поле 10</a></li>
                                            <li><a name="${custom11}">Произвольное поле 11</a></li>
                                            <li><a name="${custom12}">Произвольное поле 12</a></li>
                                            <li><a name="${custom13}">Произвольное поле 13</a></li>
                                            <li><a name="${custom14}">Произвольное поле 14</a></li>
                                            <li><a name="${custom15}">Произвольное поле 15</a></li>
                                            <li><a name="${custom16}">Произвольное поле 16</a></li>
                                            <li><a name="${custom17}">Произвольное поле 17</a></li>
                                            <li><a name="${custom18}">Произвольное поле 18</a></li>
                                            <li><a name="${custom19}">Произвольное поле 19</a></li>
                                            <li><a name="${custom20}">Произвольное поле 20</a></li>
                                        </ul>
                                    </div>
                                    <div class="col-sm-6 text_field_details" >
                                        <span class="symbol_amount" >Символов: </span>
                                        <span class="symbol_count" >0</span>
                                        <span>; Частей: </span>
                                        <span class="piece_count" >0</span>
                                    </div>
                                    <div class="col-sm-6 translit_div " >
                                        <span>Перевести в транслит:</span>
                                        <label class="switch">
                                            <input id="translit" type="checkbox">
                                            <span class="slider round"></span>
                                        </label>

                                    </div>

                                    <div class="row col-sm-12 create-resend__messenger-button" style="display: none;">
                                        <div class="row col-sm-6 add_file_div_wrapper" >
                                            <div class="add_file_div">
                                                <img class="add_file__img" src="/" style="display: none;"
                                                     alt="loaded img">
                                                <label>
                                                    <i class="glyphicon glyphicon-paperclip"></i> Прикрепить
                                                    <input type="file" class="img_file" accept=".jpg, .jpeg, .png"
                                                           style="display: none;">
                                                </label>
                                                <span class="file_name"
                                                      style=" font-size: 12px; cursor: default; "></span>

                                            </div>
                                        </div>
                                        <div class="row col-lg-6 col-md-6 col-xs-12 button_text_field">
                                            <input type="text" class="custom-input button_link"
                                                   placeholder="Ссылка кнопки">
                                            <br>
                                            <small class="form-text text-muted">Максимум 2048 символов, пример:<br>
                                                http://www.example.com </small>

                                            <input type="text" class="custom-input button_describe"
                                                   placeholder="Текст кнопки">
                                            <br>
                                            <small class="form-text text-muted">Максимум 30 символов</small>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div class="col-sm-12 mass_sending__button-group">
                                <button type="button" class="btn btn-danger button_ico delete_template" style="display: none; margin-right: 10px;" >
                                    <span class="glyphicon glyphicon-trash"></span> Удалить
                                </button>

                                <button type="button" class="btn btn-success button_ico open_create-template">
                                    <span class="glyphicon glyphicon-floppy-disk"></span> Сохранить как
                                </button>

                                <button type="button" class="btn btn-primary button_ico update_template"
                                        style="display: none; margin-right: 10px;">Обновить <i
                                            class="glyphicon glyphicon-refresh"></i></button>

                                <button type="button" class="btn btn-primary button_ico push_mass_sending">Отправить <i
                                            class="glyphicon glyphicon-send"></i></button>
                            </div>

                        </div>
                    </div>

                    <div class="col-lg-3 col-md-4 mass_sending__msg-preview"  >
                        <div class="preview__main-msg" style="display: none;" >
                            <div class="title_line">
                                <svg  viewBox="0 0 492.004 492.004" xml:space="preserve">
                                        <path fill="white" d="M484.14,226.886L306.46,49.202c-5.072-5.072-11.832-7.856-19.04-7.856c-7.216,0-13.972,2.788-19.044,7.856l-16.132,16.136    c-5.068,5.064-7.86,11.828-7.86,19.04c0,7.208,2.792,14.2,7.86,19.264L355.9,207.526H26.58C11.732,207.526,0,219.15,0,234.002    v22.812c0,14.852,11.732,27.648,26.58,27.648h330.496L252.248,388.926c-5.068,5.072-7.86,11.652-7.86,18.864    c0,7.204,2.792,13.88,7.86,18.948l16.132,16.084c5.072,5.072,11.828,7.836,19.044,7.836c7.208,0,13.968-2.8,19.04-7.872    l177.68-177.68c5.084-5.088,7.88-11.88,7.86-19.1C492.02,238.762,489.228,231.966,484.14,226.886z"/>
                                </svg>
                                <span></span>
                            </div>
                            <div class="msg_block" >
                                <span></span>
                                <div class="msg_contant" >
                                    <div class="sender_initital">
                                    </div>
                                    <div class="msg_txt" >
                                        <p>
                                        </p>
                                        <img src="#" class="msg_img" style="display:none;">
                                        <div class="msg_button" style="display: none;" >

                                        </div>
                                    </div>
                                </div>
                                <span class="current_time" >

                                </span>
                            </div>
                        </div>

                    </div>

                </form>

            </div>

        </div>
    </div>

</div>

<?php echo $footer; ?>


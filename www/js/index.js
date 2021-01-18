/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

const preloader = document.querySelector('.preloader'); //загрузочный экран
const link = document.querySelector('.link'); //кнопка 'открыть браузер'
const lastUrl = document.querySelector('.text');//элемент куда записывается последний посещенный сайт
//настройки для браузера
const url = 'http://site.com';
const target = '_blank';
const settings = 'hidden=yes,hideurlbar=yes'; //браузер скрыт, строка поиска скрыта.


//функция открытия прелоадера
function openPreloader() {
    preloader.classList.add('preloader_opened');
}

//функция закрытия прелоадера
function closePreloader() {
    preloader.classList.remove('preloader_opened');
}

//хэндлер загрузки браузера
function loadHandler () {
    //открываем прелоадер
    openPreloader();
    //ставит таймер на закрытие прелоадера через 5 секунд
    setTimeout(() => {
        closePreloader();
    }, 5000)
}

//хэндлер окончания загрузки
function stopLoadHandler (browser) {
    //закрываем прелоадер
    closePreloader();
    //открываем скрытый браузер 
    browser.show();
}

// Функция создающая экземпляр встроенного браузера
function browserCreate () {
    //Записываем в сторадж ссылку
    localStorage.setItem('url', url);
    //создаем экземпляр браузера
    const inAppBrowser = cordova.InAppBrowser.open(url, target, settings);
    //слушатель события начала загрузки страницы
    inAppBrowser.addEventListener('loadstart', loadHandler);
    //слушатель собтия окончания загрузки страницы
    inAppBrowser.addEventListener('loadstop', () => stopLoadHandler(inAppBrowser));
} 

// хэндлер события deviceready
function onDeviceReady() {
    //Запуск скрипта пуш уведомлений oneSignal.com
    (function () {
        //START ONESIGNAL CODE
        //Remove this method to stop OneSignal Debugging 
        window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 0});
        
        var notificationOpenedCallback = function(jsonData) {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };
        // Set your iOS Settings
        var iosSettings = {};
        iosSettings["kOSSettingsKeyAutoPrompt"] = false;
        iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
        
        window.plugins.OneSignal
          .startInit("7fcd1213-b498-4855-bf8c-e08042c0432b")
          .handleNotificationOpened(notificationOpenedCallback)
          .iOSSettings(iosSettings)
          .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
          .endInit();
        
        // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
        window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
          console.log("User accepted notifications: " + accepted);
        });
        //END ONESIGNAL CODE
    }
    )();
    
    //записываем на страницу посещенную ссылку
    lastUrl.textContent = localStorage.getItem('url');
    // запускаем функцию создания браузера
    browserCreate();   
}

// Хэндлер клика по кнопке
function openLink () {
    browserCreate();
}

document.addEventListener('deviceready', onDeviceReady, false); //слушатель события загрузки устроства
link.addEventListener('click', openLink); //слушатель клика на кнопке
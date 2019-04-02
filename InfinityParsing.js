										/* Глобальные переменные */
{
var iteration = 0,                     // текущая итерация скрипта
    scriptVersion = '0.9.2',
    treasureList = {},
	treasureTd = 5,
    pages = [],
    stepInitialTime = [],
    stepEndTime = [],
    timersForPages = [],
    stepTimers = [],
    timersForGifts = [],
    mainTimer = 0,
    giftPages = [],
    editFirstPage = 0,                 // 1 - недефолтный список страниц, 0 - дефолтный
    firstPage = 1,                     // первая страница по дефолту
    lastPage = 20,                     // последняя страница по дефолту
    demoRegime = true;

var treasurePages = 0,                  // количество сокр в списке
    treasureWindow = 0,               // окно для сокр
    treasureHrefs = [],                 // ссылки сокр
    treasureWorth = [],                 // ценность сокр
    treasureTime = [],                  // время появления
    treasureNumbers = [],               // номера сокр
    treasureKeys = [],                  // ключи
    treasureKeysHav = [],               // наличие ключей
    activeTreasurePage = [],            // активная страница сокр
    activeTreasuresStep = [],           // шаг обработки
    treasureRuns = [],                  // инфа о запуске поиска
    timeOfKeyFinding = [],              // время поиска ключа
    treasureActiveWindow = [],          // текущее окно поиска ключа
    treasurePageClones = [],            // окно-дублер сокры
    rpgTopVoteHref = [],                // ссылки голосования текущего сайта
    chests = [],                        // инфа о забранном сундуке
    curNumber = 0,                      // номер текущей сокры
    treasureList = {},                  // инфа по сокрам
    generalWindow = 0;                  // главное окно поиска

    treasureList.filling = [];
    treasureList.devTimes = [];
    treasureList.treasuresNames = [];
    treasureList.treasuresLeft = [];
    treasureList.devastation = [];
    treasureList.worth = [];
    treasureList.hrefs = [];
    treasureList.time = [];
    treasureList.keys = [];
    treasureList.diggBtn = [];
}

				/* Первый запуск парсинга без задержки */

function firstStart() {
    console.clear();
    console.info('Привет! Запущен скрипт авто-парсинга v.' + scriptVersion + '. Ищу предметы и сокровищницы, а также сообщаю информацию о последних в консоли.');
    console.log('%cУбедитесь, что всплывающие окна на сайтах https://rpgtop.su и https://top.roleplay.ru не блокируются!', 'font-weight: bold;');
    mainParsing();
};
if (editFirstPage == 0) firstPage = 1;
for (var i = firstPage; i <= lastPage; i++ ) {
	pages[i-firstPage] = 'https://rpgtop.su/p' + i + '.html';
}
generalWindow = window.open('https://rpgtop.su', 'generalWindow', 'width=64,height=48'); 
generalWindow.moveTo(0,1024);
generalWindow.resizeTo(0,0);
generalWindow.document.title = 'PARSING!';
generalWindow.dtitle = 'PARSING!';
treasureWindow = window.open('https://rpgtop.su', 'treasureWindow', 'width=64,height=48'); 
treasureWindow.moveTo(0,1024);
treasureWindow.resizeTo(0,0);
treasureWindow.document.title = 'СОКРА';
treasureWindow.dtitle = 'СОКРА';

				/* Основная функция парсинга */

function mainParsing() {
    iteration++;
    console.log('Инициирован проход скрипта №' + iteration + '\nСкрипт работает, вы отдыхаете! Хорошего дня :)');
    generalWindow.document.title = 'PARSING!';
    scriptIteration.innerText = 'Текущая итерация скрипта: ' + iteration;
    var timeBuffer = 0;
    for (var j = 0; j < pages.length; j++) {
        (function(j){
            stepInitialTime[j] = timeBuffer;
            var timeBufferStep = 100000*randomize();
            timeBuffer = timeBuffer + timeBufferStep;
            stepEndTime[j] = timeBuffer;
            timersForPages[j] = setTimeout(function(){
                var initialDate = new Date(),
                    endDate = new Date(initialDate.getTime() + timeBufferStep);
                stepTimers[j] = setInterval(function(){
                    var currentTime = new Date();
                    var leftTime = '' + (endDate.getTime() - currentTime.getTime())/1000;
                    leftTime = leftTime.split('.');
                    if (leftTime[1]) {
                        if (leftTime[1].length == 3) leftTime[1] = leftTime[1].slice(0,-1);
                        if (leftTime[1].length == 1) leftTime[1] = leftTime[1] + '0';
                        if (leftTime[1].length == 0) leftTime[1] = '00';
                    }
                    else leftTime[1] = '00';
                    panelTimer.innerText = 'Поиск по следующей странице отзывов через ' + leftTime[0] + '.' + leftTime[1] + ' сек.';
                }, 50); 
                console.log('Выполняется проход по ' + (j+firstPage) + ' странице с отзывами');
                scriptStep.innerText = 'Выполняется поиск по ' + (j + firstPage) + ' странице отзывов';
                generalWindow.location.href = pages[j];
                generalWindow.document.title = 'PARSING!';
                generalWindow.dtitle = 'PARSING!';
                console.log('Ожидание загрузки страницы: 3 сек.');
                setTimeout(function(){                    
                    var comments = generalWindow.document.body.querySelectorAll('.comments a');
                    for ( var i = 0; i < comments.length; i++ ) {
                        (function(i){
                            timersForGifts[i] = setTimeout(findGifts, 5000*i, comments[i]);
                        })(i);
                    };
                }, 3000);
            }, stepInitialTime[j]);
            setTimeout(function(){
                clearInterval(stepTimers[j]);
            }, stepEndTime[j]);
        })(j);
    }
};

                /* Функция поиска и открытия предметов */

function findGifts(giftHref) {
    generalWindow.location.href = giftHref;
    generalWindow.document.title = 'PARSING!';
    generalWindow.dtitle = 'PARSING!';
    setTimeout(function(){
        generalWindow.document.title = 'PARSING!';
        var gifts = generalWindow.document.body.querySelectorAll('.gift a'),
            giftImgs = generalWindow.document.body.querySelectorAll('.gift img');
        if (giftImgs.length != 0) {
			console.log('На сайте ' + generalWindow.document.querySelector('h1.without_ico').innerText.slice(16) + ' (' + giftHref +') обнаружено:');
		};
        for (var i = 0; i < giftImgs.length; i++) {
            (function(i){
                if (giftImgs[i].alt != '') {
                    console.log(giftImgs[i].alt);
                };
            })(i);
        };
        if (gifts.length != 0) {            
            for (var k = 0; k < gifts.length; k++) {
                (function(k){
                    // ------------------    Обработка сокр ------------------------- //
                    if (gifts[k].href.indexOf('treasure') != -1) {
                        console.error('Часть скрипта по сокрам');  
                        // -------- Первая сокра в списке ------------ //
                        if (treasurePages == 0) {                            
                            console.log('Первая сокра найдена!');
                            treasureWindow.location.href = gifts[k].href;
                            setTimeout(function(){
                                treasureHrefs[treasurePages] = treasureWindow.location.href;       
                                treasureNumbers[treasurePages] = treasureWindow.location.href.slice(46,50);
                                console.warn('Открыта сокра №' + treasureNumbers[treasurePages]);
                                console.log('Адрес сокры: ' + treasureHrefs[treasurePages]);
                                treasureWorth[treasurePages] = treasureWindow.document.querySelector('.block_5').children[1].children[0].children[1].children[0].innerText;
                                console.log('Стоимость: ' + treasureWorth[treasurePages] + ' зол.');
                                isItEmpty(treasureWindow, treasurePages);        
                                addTreasureToList(treasurePages, treasureNumbers, treasureHrefs[treasurePages], treasureWorth);
                                treasurePages++;
                            }, 3000);
                        }  
                        // --------- Новые сокры -------- //
                        else { 
                            var matches = 0;
                            treasurePages++;
                            treasureWindow.location.href = gifts[k].href;
                            setTimeout(function(){
                                // ------------ Проход по сокрам ---------- //
                                for ( var m = 0; m < treasurePages; m++ ) {
                                    if (treasureWindow.location.href == treasureHrefs[m]) {
                                        matches++;
                                        treasureList.devTimes[m] = +treasureWindow.document.querySelector('.block_5').children[1].children[0].children[2].children[0].innerText;
                                        treasureList.devastation[m].innerText = 'Разграблено: ' + treasureList.devTimes[m] + ' раз(а)';
                                        if (treasureWindow.document.querySelector('.treasure_main_keys')) {
											if (treasureList.filling[m] != 'nothingElse') treasureList.filling[m] = true;
										} else treasureList.filling[m] = false;
                                        if (treasureList.filling[m]) {
											if (treasureList.filling[m] != 'nothingElse') treasureList.treasuresLeft[m].innerText = 'Доступна';
										} else if (treasureList.filling[m] == 'nothingElse') treasureList.treasuresLeft[m].innerText = 'Недоступна';
                                          else treasureList.treasuresLeft[m].innerText = 'Опустошена';                                        
                                    }
                                }
                                // ------------ Нет совпадений ---------- //
                                if (matches == 0) {
                                    console.log('Найдена новая сокра!');
                                    treasureHrefs[treasurePages] = treasureWindow.location.href;      
                                    treasureNumbers[treasurePages] = treasureWindow.location.href.slice(46,50);       
                                    console.warn('Открыта сокра №' + treasureNumbers[treasurePages]);
                                    console.log('Адрес сокры: ' + treasureHrefs[treasurePages]);
                                    treasureWorth[treasurePages] = treasureWindow.document.querySelector('.block_5').children[1].children[0].children[1].children[0].innerText;
                                    console.log('Стоимость: ' + treasureWorth[treasurePages] + ' зол.');
                                    isItEmpty(treasureWindow, treasurePages);     
                                    addTreasureToList(treasurePages, treasureNumbers, treasureHrefs[treasurePages], treasureWorth);
                                    if (treasureList.filling[treasurePages]) console.error('Часть скрипта по сокрам');
                                    else console.log('Хоть тут отдохну ^_^');
                                } else {
                                    treasurePages--;
                                }                            
                            }, 3000);                            
                        };
                    }
                    // ------------------- Обработка простых предметов -------------------- //
                    else {
                        if (k == 0) {
                            gifts[k].click();
                            console.warn('Собран 1-й предмет: ' + gifts[k].children[0].alt + ' на сайте ' + generalWindow.document.title.slice(16,-10));                            
                        } else {
                            if (k < 10) {
                                 if ((generalWindow.document) && (generalWindow.document.body)) {
                                     setTimeout(function(){
                                         generalWindow.document.body.appendChild(gifts[k]);
                                         console.log('Добавлен ' + (k+1) + ' предмет: ' + gifts[k].children[0].alt);                                         
                                     }, 200*k);
                                     setTimeout(function(){
                                         gifts[k].click();
                                         console.warn('Собран ' + (k+1) + ' предмет: ' + gifts[k].children[0].alt);
                                     }, 200*k+20);
                                 } else console.log('Загрузка страницы не успела за скриптом!. Предмет будет пропущен во избежание нарушений работы скрипта.');
                            } else console.log('Переполнение стэка на сайте ' + generalWindow.document.title.slice(16,-10) + '. Предмет "' + gifts[k].children[0].alt + '" будет подобран при следующем проходе');
                        };  
                    };
                })(k);
            };
        };
    }, 3000);
};

				/* Получение информации о сокровищнице */

function isItEmpty(currentTreasureWindow, currentNumber) {
    if (!currentTreasureWindow.document.querySelector('.block_5')) {
		console.log('К сожалению, ловить тут уже нечего :(');
		treasureList.filling[currentNumber] = false;
		treasureList.devTimes[currentNumber] = '20';
		return false;
	}
    var devastation = +currentTreasureWindow.document.querySelector('.block_5').children[1].children[0].children[2].children[0].innerText,
        time = currentTreasureWindow.document.querySelector('.block_5').children[1].children[0].children[0].children[0].innerText;
        treasureTime[currentNumber] = time;
    if (currentTreasureWindow.document.querySelector('.treasure_main_keys')) {
		if ( devastation > 2) console.log('Тут, кстати, еще даже что-то есть :) \nПравда, опустошили уже ' + devastation + ' раз(а). На многое рассчитывать не стоит. Зато около 0.2 баллов опыта, что тоже неплохо!');
		else console.log('Тут, кстати, еще даже что-то есть :) \nА мы в числе первых!');
		if (treasureList.filling[currentNumber] != 'nothingElse') treasureList.filling[currentNumber] = true;
		treasureList.devTimes[currentNumber] = devastation;
        treasureKeys[currentNumber] = [];
        treasureKeysHav[currentNumber] = [];
        var keys = currentTreasureWindow.document.querySelector('.treasure_main_keys').querySelectorAll('img');
        for (var i = 0; i < keys.length; i++) {
            treasureKeys[currentNumber][i] = keys[i].src.slice(24,-4);
            treasureKeysHav[currentNumber][i] = keys[i].parentElement.style.backgroundColor;
        }
	} else {
		console.log('К сожалению, ловить тут уже нечего :(');
		treasureList.filling[currentNumber] = false;
		treasureList.devTimes[currentNumber] = devastation;
	}
};

				/* Добавление новой сокровищницы */

function addTreasureToList(i, treasureNumbers, treasureHref, treasureWorth) {
    if (panel.contains(emptyTreasures)) panel.removeChild(emptyTreasures);
    treasureList.treasuresNames[i] = document.createElement('span');
    treasureList.treasuresNames[i].innerText = 'Сокровищница №' + treasureNumbers[i];
    treasureList.treasuresNames[i].style.display = 'inline-block';
    treasureList.treasuresNames[i].style.width = treasureListWidth;
    treasureList.treasuresNames[i].style.textAlign = 'left';
    treasureList.treasuresNames[i].style.paddingLeft = '20px';
    treasureList.treasuresNames[i].style.boxSizing = 'border-box';
    treasureList.treasuresNames[i].style.marginBottom = '5px';
	treasureList.treasuresNames[i].style.fontSize = '15px';
    treasureList.treasuresLeft[i] = document.createElement('span');
    if ((treasureList.filling[i]) && (treasureList.filling[i] != 'nothingElse')) treasureList.treasuresLeft[i].innerText = 'Доступна';
    else if (treasureList.filling[i] == 'nothingElse') treasureList.treasuresLeft[i].innerText = 'Недоступна';
    else treasureList.treasuresLeft[i].innerText = 'Опустошена';
    treasureList.treasuresLeft[i].style.display = 'inline-block';
    treasureList.treasuresLeft[i].style.width = treasureListWidth;
	treasureList.treasuresLeft[i].style.textAlign = 'center';
	treasureList.treasuresLeft[i].style.marginBottom = '5px';
	treasureList.treasuresLeft[i].style.fontSize = '15px';
    treasureList.devastation[i] = document.createElement('span');
    treasureList.devastation[i].innerText = 'Разграблено: ' + treasureList.devTimes[i] + ' раз(а)';
	treasureList.devastation[i].style.display = 'inline-block';
	treasureList.devastation[i].style.width = treasureListWidth;
	treasureList.devastation[i].style.textAlign = 'center';
	treasureList.devastation[i].style.marginBottom = '5px';
	treasureList.devastation[i].style.fontSize = '15px';
    treasureList.worth[i] = document.createElement('span');
	treasureList.worth[i].innerText = 'Ценность: ' + treasureWorth[i] + ' з.';
	treasureList.worth[i].style.display = 'inline-block';
	treasureList.worth[i].style.width = treasureListWidth;
	treasureList.worth[i].style.textAlign = 'center';
	treasureList.worth[i].style.marginBottom = '5px';
	treasureList.worth[i].style.fontSize = '15px';
    treasureList.hrefs[i] = document.createElement('span');
	treasureList.hrefs[i].innerHTML = '<a href="' + treasureHref + '">Ссылка</a>';
	treasureList.hrefs[i].style.display = 'inline-block';
	treasureList.hrefs[i].style.width = treasureListWidth;
	treasureList.hrefs[i].style.textAlign = 'right';
    treasureList.hrefs[i].style.paddingRight = '20px';
    treasureList.hrefs[i].style.boxSizing = 'border-box';
	treasureList.hrefs[i].style.marginBottom = '5px';
	treasureList.hrefs[i].style.fontSize = '15px';
    treasureList.time[i] = document.createElement('span');
    treasureList.time[i].innerHTML = 'Время появления: ' + treasureTime[i];
	treasureList.time[i].style.display = 'inline-block';
	treasureList.time[i].style.width = '100%';
	treasureList.time[i].style.textAlign = 'center';
	treasureList.time[i].style.marginBottom = '5px';
	treasureList.time[i].style.fontSize = '15px';
    treasureList.keys[i] = document.createElement('div');
    treasureList.keys[i].style.width = '100%';
    treasureList.keys[i].style.textAlign = 'center';
	treasureList.keys[i].style.marginBottom = '5px';
    treasureList.keys[i].style.fontSize = '0px';
    var keysTitle = document.createElement('span');
    keysTitle.style.width = '100%';
    keysTitle.style.textAlign = 'center';
    keysTitle.style.fontSize = '12px';
    keysTitle.innerText = 'Необходимые ключи: ';
    treasureList.keys[i].appendChild(keysTitle);
    for (var u = 0; u < 4; u++) {
        var keyBlock = document.createElement('span');
        keyBlock.style.width = '100%';
        keyBlock.style.textAlign = 'center';
        keyBlock.style.fontSize = '12px';
        var havingKey = '';
        if (treasureKeysHav[i][u] == 'green') havingKey = ' (есть)'
        else havingKey = ' (нет)';
        if (u < 3) keyBlock.innerText = treasureKeys[i][u] + havingKey + ', '
        else keyBlock.innerText = treasureKeys[i][u] + havingKey;
        treasureList.keys[i].appendChild(keyBlock);
    }
    
    treasureList.diggBtn[i] = document.createElement('button');
    treasureList.diggBtn[i].style.display = 'block';
    treasureList.diggBtn[i].style.width = '180px';
    treasureList.diggBtn[i].style.padding = '5px 15px';
    treasureList.diggBtn[i].style.boxSizing = 'border-box';
    treasureList.diggBtn[i].style.textAlign = 'center';
    treasureList.diggBtn[i].style.margin = '5px auto';
    treasureList.diggBtn[i].style.marginBottom = '10px';
    treasureList.diggBtn[i].style.fontSize = '14px';
    treasureList.diggBtn[i].innerText = 'Искать ключи';
    
    panel.insertBefore(treasureList.treasuresNames[i], runParse);
	panel.insertBefore(treasureList.treasuresLeft[i], runParse);
	panel.insertBefore(treasureList.devastation[i], runParse);
	panel.insertBefore(treasureList.worth[i], runParse);
	panel.insertBefore(treasureList.hrefs[i], runParse);
    panel.insertBefore(treasureList.time[i], runParse);
    panel.insertBefore(treasureList.keys[i], runParse);
    if (demoRegime == false) {
        panel.insertBefore(treasureList.diggBtn[i], runParse);
    }    
    
    if (demoRegime == false) {
        (function(i){
            treasureList.diggBtn[i].addEventListener('click', function(){
                if (treasureRuns[i] != true) {
                    treasureList.diggBtn[i].innerText = 'Ищем ключи';
                    treasureRuns[i] = true;
                    firstUseOfTreasure(i);
                } else console.error('Поиск в данной сокре уже запущен!');            
            });
        })(i);    
    }
};

                /* Рандомайзер от 1.0 до 1.5 */

function randomize() {
	return Math.round((1 + Math.random()*0.5)*1000)/1000;
};

                /* Функция первого запуска обработки сокровищниц */

function firstUseOfTreasure(number) {
    activeTreasurePage[number] = window.open(treasureHrefs[number], 'popup', 'width=64,height=48');
    activeTreasurePage[number].moveTo(0,1024);
    activeTreasurePage[number].resizeTo(0,0);
    console.warn('Начата работа скрипта по получению ключей в сокровищнице №' + treasureNumbers[number]);
    
    var beginWaitingTime = new Date();
	var beginWaitingHours = beginWaitingTime.getHours(),
   	    beginWaitingMinutes = beginWaitingTime.getMinutes(),
    	    beginWaitingSeconds = beginWaitingTime.getSeconds();
	if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
	if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes;
	if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
	console.log('Время: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);
    
    activeTreasuresStep[number] = 0;
    setTimeout(function() {
		getOptimalTime(activeTreasurePage, number, treasureList);
	}, 6000);
};

				/* Функция обработки сокровищниц */

function getOptimalTime(activeTreasurePage, number, treasureList) {
    console.warn('Запущена функция получения оптимального времени для сокровищницы №' + treasureNumbers[number]);
    
    var beginWaitingTime = new Date();
	var beginWaitingHours = beginWaitingTime.getHours(),
	    beginWaitingMinutes = beginWaitingTime.getMinutes(),
	    beginWaitingSeconds = beginWaitingTime.getSeconds();
	if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
	if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes;
	if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
	console.log('Время запуска: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);
    
    if (!activeTreasurePage[number]) {
		console.error('Cокровищница №' + treasureNumbers[number] + '. Такой страницы вообще нет! Критическая ошибка. Функция обрывается. ');
        console.warn('Доработать механизм перезапуска поиска!');
		return false;
	}    
    if ((treasureList.filling[number] == 'nothingElse') || (!treasureList.filling[number])) {
		console.error('Cокровищница №' + treasureNumbers[number] + ' опустошена либо недоступна. Функция обрывается');
		return false;
	}    
    if (!activeTreasurePage[number].document.querySelector('.treasure_main_text')) {
		console.error('Cокровищница №' + treasureNumbers[number] + '. На искомой странице отсутствует сокровищница. Функция обрывается. ');
        console.warn('Доработать механизм перезапуска поиска!');
		return false;
	}        
    if (activeTreasurePage[number].document.querySelector('.treasure_main_text').childElementCount == 1) {
		console.error('Сокровищница опустошена!');
		return false;
	}
    
    if (!activeTreasurePage[number].document.querySelector('.treasure_vahat')) {
		console.log('Сокровищница №' + treasureNumbers[number] + ' не обрабатывается, скрипт продолжает работу');
    } 
    // ----------- Механизм отложенного запуска для обрабатываемых сокр ------------- //
    else if (activeTreasurePage[number].document.querySelector('.treasure_vahat').previousSibling.tagName == 'SPAN') {
        console.warn('Сокровищница №' + treasureNumbers[number] + ' уже обрабатывается');
        console.log('Сокровищница №' + treasureNumbers[number] + '. Внутри тэга написано: ' + activeTreasurePage[number].document.querySelector('.treasure_vahat').previousSibling.innerText);
        console.log('Ожидаемое время ~ ' + activeTreasurePage[number].document.querySelector(".treasure_vahat").innerText.slice(0,2) + ' мин.');
        timeOfKeyFinding[number] = +activeTreasurePage[number].document.querySelector('.treasure_vahat').innerText.slice(0,2);
        timeOfKeyFinding[number] = timeOfKeyFinding[number]*60 + 60;
        console.log('Ожидаемое время: ' + timeOfKeyFinding[number] + ' сек.');
        setTimeout(function() {getOptimalTime(activeTreasurePage, number, treasureList);}, timeOfKeyFinding[number]*1000);
        console.log('Сокровищница №' + treasureNumbers[number] + '. setTimeout установлен, функция обрывается');
        var beginWaitingTime = new Date();
		var beginWaitingHours = beginWaitingTime.getHours(),
	   	    beginWaitingMinutes = beginWaitingTime.getMinutes(),
	    	    beginWaitingSeconds = beginWaitingTime.getSeconds();
		if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
		if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes;
		if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
		console.log('Время: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);
		return false;
    }
    // ----------- Механизм дефолтного запуска или перезапуска для сокр ------------- //
    // ------ Определяем количество посещенных сайтов ------ //
    if (activeTreasurePage[number].document.querySelectorAll('.treasure_visited')) {
        var visitedSites = activeTreasurePage[number].document.querySelectorAll('.treasure_visited');
        console.log('В сокровищнице №' + treasureNumbers[number] + ' уже посещено сайтов: ' + visitedSites.length);
        activeTreasuresStep[number] = visitedSites.length;
    }
    console.log('Сокровищница №' + treasureNumbers[number] + '. Осталось посетить сайтов: ' + (4 - activeTreasuresStep[number]));	
    // ------ Работаем с оставшимися сайтами ------ //            
    if (activeTreasuresStep[number] < 4) {
        console.log('Сокровищница №' + treasureNumbers[number] + '. Магичим со временем!');
        console.log('Сокровищница №' + treasureNumbers[number] + '. Сайтов посещено: ' + activeTreasuresStep[number]);
        console.log('Сокровищница №' + treasureNumbers[number] + '. Обрабатывается сайт №' + (1 + activeTreasuresStep[number]));        
        
        rpgTopVoteHref[number] = 'https://rpgtop.su/' + activeTreasurePage[number].document.querySelectorAll('input[name="visit"]')[0].value;
        activeTreasurePage[number].document.querySelectorAll('input[value="Посетить"]')[0].click();
        console.log('Сокровищница №' + treasureNumbers[number] + '. Кнопка найдена и нажата. Открывается ' + (1 + activeTreasuresStep[number]) + ' сайт');
        treasurePageClones[number] = window.open(treasureHrefs[number], 'treasureClone', 'width=64,height=48');
        treasurePageClones[number].moveTo(0,1024);
        treasurePageClones[number].resizeTo(0,0);
        console.log('Открыт сайт-клон сокровищницы №' + treasureNumbers[number]);
        var beginWaitingTime = new Date();
        var beginWaitingHours = beginWaitingTime.getHours(),
            beginWaitingMinutes = beginWaitingTime.getMinutes(),
            beginWaitingSeconds = beginWaitingTime.getSeconds();
        if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
        if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes;
        if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
        console.log('Время: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);     
        
        setTimeout(function() {
            if (!treasurePageClones[number].document.querySelector('.treasure_vahat')) {
                console.warn('Сокровищница №' + treasureNumbers[number] + '. Не нашел времени, скрипт продолжит работу с задержкой');
                setTimeout(function() {
                    findOptimalTime(treasurePageClones, activeTreasurePage, number, rpgTopVoteHref)
                }, 15000);
                console.log('Сокровищница №' + treasureNumbers[number] + '. setTimeout запущен');
                var beginWaitingTime = new Date();
                var beginWaitingHours = beginWaitingTime.getHours(),
                    beginWaitingMinutes = beginWaitingTime.getMinutes(),
                    beginWaitingSeconds = beginWaitingTime.getSeconds();
                if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
                if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes;
                if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
                console.log('Время: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);
            } else {
                console.log('Сокровищница №' + treasureNumbers[number] + '. Время найдено, всё ок');
                findOptimalTime(treasurePageClones, activeTreasurePage, number, rpgTopVoteHref);
            }
        }, 10000);

    } else {
        checkForChest(activeTreasurePage, number, treasureList);
    }
};

				/* Функция поиска оптимального времени */

function findOptimalTime(treasurePageClones, activeTreasurePage, number, rpgTopVoteHref) {
    if (!treasurePageClones[number].document) {
		console.error('Дублер сокры №' + treasureNumbers[number] + ' закрыт! Скрипт выполнен не будет');
        console.warn('Добавить возможность перезапуска');
		return false;
	}
    
    console.warn('Сокровищница №' + treasureNumbers[number] + '. Скрипт дошел до функции поиска оптимального времени');
    var beginWaitingTime = new Date();
	var beginWaitingHours = beginWaitingTime.getHours(),
   	    beginWaitingMinutes = beginWaitingTime.getMinutes(),
    	    beginWaitingSeconds = beginWaitingTime.getSeconds();
	if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
	if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes;
	if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
	console.log('Время: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);
    
    if (!treasurePageClones[number].document.querySelector('.treasure_vahat')) {
        console.log('Сокровищница №' + treasureNumbers[number] + '. Время не найдено. Инициирована процедура переприсваивания.');
        activeTreasurePage[number].close();
        activeTreasurePage[number] = treasurePageClones[number];
        console.log('Сокровищница №' + treasureNumbers[number] + '. activeTreasurePage[' + number + '] переприсвоена. Посещенный сайт закрыт!');
        setTimeout(function() {
            getOptimalTime(activeTreasurePage, number, treasureList);
        }, 8000);
        console.log('Сокровищница №' + treasureNumbers[number] + '. setTimeout установлен! Ожидаем 8 сек.');
        var beginWaitingTime = new Date();
		var beginWaitingTime = new Date();
		var beginWaitingHours = beginWaitingTime.getHours(),
	   	    beginWaitingMinutes = beginWaitingTime.getMinutes(),
	    	    beginWaitingSeconds = beginWaitingTime.getSeconds();
		if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
		if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes; 
		if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
		console.log('Время: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);
		return false;
    }
    
    if (treasurePageClones[number].document.querySelector('.treasure_vahat').innerText.slice(0,2) <= 15) {
        if ((treasurePageClones[number].document.querySelector(".treasure_vahat").innerText.slice(0,2) == '') || (treasurePageClones[number].document.querySelector(".treasure_vahat").innerText.slice(0,2) == ' ') || (treasurePageClones[number].document.querySelector(".treasure_vahat").innerText.slice(0,2) == '  ')) {
            console.error('Сокровищница №' + treasureNumbers[number] + '. Время поиска найдено с ошибкой! Оно равно: ' + treasurePageClones[number].document.querySelector(".treasure_vahat").innerText.slice(0,2) + ' мин.');
            activeTreasurePage[number].close();
            activeTreasurePage[number] = treasurePageClones[number];
            console.log('Сокровищница №' + treasureNumbers[number] + '. activeTreasurePage[' + number + '] переприсвоена. Посещенный сайт закрыт!');
            setTimeout(function() {
                getOptimalTime(activeTreasurePage, number, treasureList);
            }, 8000);
            console.log('Сокровищница №' + treasureNumbers[number] + '. setTimeout установлен! Ожидаем 8 сек.');
            var beginWaitingTime = new Date();
            var beginWaitingTime = new Date();
            var beginWaitingHours = beginWaitingTime.getHours(),
                beginWaitingMinutes = beginWaitingTime.getMinutes(),
	    	    beginWaitingSeconds = beginWaitingTime.getSeconds();
            if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
            if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes; 
            if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
            console.log('Время: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);
            return false;
        }
        
        console.warn('Сокровищница №' + treasureNumbers[number] + '. Время минимально! Всего ~ ' + treasurePageClones[number].document.querySelector(".treasure_vahat").innerText.slice(0,2) + ' мин.');
        console.warn('Сокровищница №' + treasureNumbers[number] + '. Присваивается адрес голосования');
        activeTreasurePage[number].location.href = rpgTopVoteHref[number];
        console.log('Сокровищница №' + treasureNumbers[number] + '. activeTreasurePage[' + number + '] присвоен адрес ' + rpgTopVoteHref[number]);        
        
        setTimeout(function() {
            timeOfKeyFinding[number] = +activeTreasurePage[number].document.querySelector('.treasure_vahat').innerText.slice(0,2);
            timeOfKeyFinding[number] = timeOfKeyFinding[number]*60 + 60;
            console.log('Сокровищница №' + treasureNumbers[number] + '. Время поиска ключа: ' + (timeOfKeyFinding[number]/60) + ' мин.');
            activeTreasuresStep[number]++;
            treasurePageClones[number].close();
            console.warn('Сокровищница №' + treasureNumbers[number] + '. Сайт-дублер закрыт');
            
            console.log('Сокровищница №' + treasureNumbers[number] + '. На следующей итерации поиска останется посетить сайтов: ' + (4 - activeTreasuresStep[number]));
            
            if (activeTreasuresStep[number] == 4) {
                console.log('На следующем проходе работа с сокровищницей будет завершена!');
                setTimeout(checkForChest(activeTreasurePage, number, treasureList), timeOfKeyFinding[number]*1000);                                   // проверка сундука
                console.log('Сокровищница №' + treasureNumbers[number] + '. setTimeout установлен! Время ожидания: ' + timeOfKeyFinding[number] + ' сек.');
                var beginWaitingTime = new Date();
				var beginWaitingHours = beginWaitingTime.getHours(),
		   		    beginWaitingMinutes = beginWaitingTime.getMinutes(),
		    		    beginWaitingSeconds = beginWaitingTime.getSeconds();
				if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
				if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes;
				if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
				console.log('Время: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);
            } 
            else setTimeout(function() {
                getOptimalTime(activeTreasurePage, number, treasureList);
                console.log('Сокровищница №' + treasureNumbers[number] + '. setTimeout установлен! Время ожидания: ' + timeOfKeyFinding[number] + ' сек.');
                var beginWaitingTime = new Date();
                var beginWaitingHours = beginWaitingTime.getHours(),
                    beginWaitingMinutes = beginWaitingTime.getMinutes(),
		    	    beginWaitingSeconds = beginWaitingTime.getSeconds();
                if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
                if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes;
                if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
                console.log('Время: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);
            }, timeOfKeyFinding[number]*1000);            
            
        }, 15000);
    } else {
        console.warn('Сокровищница №' + treasureNumbers[number] + '. Время нифига не устраивает! Долго!');
        console.log('' + treasurePageClones[number].document.querySelector(".treasure_vahat").innerText.slice(0,2) + ' мин.');
        activeTreasurePage[number].close();
        console.log('Сокровищница №' + treasureNumbers[number] + '. Окно сайта закрыто!');
        activeTreasurePage[number] = treasurePageClones[number];
        console.log('Сокровищница №' + treasureNumbers[number] + '. activeTreasurePage[' + number + '] присвоено новое окно!');
        getOptimalTime(activeTreasurePage, number, treasureList);
    }
};

				/* Функция проверки сундука */

function checkForChest(activeTreasurePage, number, treasureList) {
    console.warn('Сокровищница №' + treasureNumbers[number] + '. Проверяю сундук!')
    
    if (activeTreasuresStep[number] == 0) {
		console.log('Сокровищница №' + treasureNumbers[number] + '. Работа только начата, сундук никак не взять!');
		return false;
	}
    
    if ((chests[number]) || (!treasureList.filling)) {
		console.warn('Сокровищница №' + treasureNumbers[number] + '. Так здесь сундук уже забран! Это ли не прекрасно!');
		console.log('Работа по сокровищнице №' + treasureNumbers[number] + ' завершена!');
		return true;
	}
    
    var keys = activeTreasurePage[number].document.querySelectorAll('.treasure_main_keys span'),
	    keyImgs = activeTreasurePage[number].document.querySelectorAll('.treasure_main_keys span img'),
	    redKeys = 0,
	    splinters = 0;
    
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].style.backgroundColor == 'red') redKeys++;
        if ((keyImgs[i].src.slice(24,-4) == 621) || (keyImgs[i].src.slice(24,-4) == 620) || (keyImgs[i].src.slice(24,-4) == 623) || (keyImgs[i].src.slice(24,-4) == 622)) splinters++;
    }
    
    if ((redKeys == 0) && (splinters == 0) && (activeTreasuresStep[number] == 4) && (activeTreasurePage[number].document.querySelector('.treasure_main_text').children[2].children[3])) {
        activeTreasurePage[number].document.querySelector('.treasure_main_text form').children[3].click();
        console.warn('Сокровищница №' + treasureNumbers[number] + '. Сундук удачно забран :)'); 
        treasureList.filling[number] = false;
        treasureList.treasuresLeft[number].innerText = 'Опустошена';
        chests[number] = true;
        return true;
    } else {
        console.warn('Сокровищница №' + treasureNumbers[number] + '. Не могу взять сундук!');
        console.log('Сокровищница №' + treasureNumbers[number] + '. Недоступных ключей/осколков: ' + redKeys);
        console.log('Сокровищница №' + treasureNumbers[number] + '. Из них осколков: ' + splinters);
		return false;
    }
};

                /* Создаем DOM объекты */

{
    var logo = document.querySelector('#logo'),
        mainArray = document.querySelector('.main_aray'),
        navigation = document.querySelector('#nav_bar'),
        wrapper = navigation.parentNode,
        top_brand = document.querySelector('#top_brand'),
        panel = document.createElement('div'),
        panelTitle = document.createElement('h1'),
        panelVersion = document.createElement('h2'),
        panelTreasures = document.createElement('h3'),
        emptyTreasures = document.createElement('div'),	
        treasureListWidth = Math.floor(100/treasureTd) + '%',
        runParse = document.createElement('button'),
        refreshBtn = document.createElement('button'),
        clearEmpty = document.createElement('button'),
        stopParse = document.createElement('button'),
        scriptIteration = document.createElement('div'),
        scriptStep = document.createElement('div'),
        panelTimer = document.createElement('div'),
        panelStartTime = document.createElement('div'),
        panelNextStepTime = document.createElement('div');
}

				/* Добавление DOM объектов на страницу */
{
    logo.parentNode.removeChild(logo);
    mainArray.removeChild(document.querySelector('.block_3'));
    wrapper.removeChild(document.querySelector('.reclama468'));
    wrapper.insertBefore(panel, navigation);
    top_brand.style = '';
    top_brand.style.background = 'url(https://images.wallpaperscraft.ru/image/vesna_podsnezhniki_cvety_les_pervye_57379_1920x1080.jpg';
    top_brand.style.backgroundSize = 'cover';
    top_brand.style.height = '100vh';
    panel.appendChild(panelTitle);
    panel.appendChild(panelVersion);
    panel.appendChild(panelTreasures);
    panel.appendChild(emptyTreasures);
    panel.appendChild(runParse);
    panel.appendChild(refreshBtn);
    panel.appendChild(clearEmpty);
    panel.appendChild(stopParse);
    panel.appendChild(scriptIteration);
    panel.appendChild(scriptStep);
    panel.appendChild(panelTimer);
    panel.appendChild(panelStartTime);
    panel.appendChild(panelNextStepTime);
}

				/* Стилизация DOM объектов */
{
    panel.style.margin = '-100px auto 25px';
    panel.style.width = '1000px';
    panel.style.height = '';
    panel.style.paddingBottom = '15px';    
    panel.style.background = 'linear-gradient(#e8c77b, #f1d490)';
    panel.style.borderRadius = '5px';
    panel.style.boxShadow = 'inset 1px 1px 0px #f1d490, 0px 2px 5px rgba(0, 0, 0, 0.5)';
    "inset 1px 1px 0px #f1d490, 0px 2px 5px rgba(0, 0, 0, 0.5)";
    panel.style.fontFamily = 'PTSansR';
    panel.style.fontSize = '0px';
    panel.style.color = '#333';
    panelTitle.innerText = 'Авто-парсер';
    panelTitle.style.textAlign = 'center';
    panelTitle.style.fontSize = '20px';
    panelTitle.style.marginBottom = '5px';
    panelTitle.style.paddingTop = '15px';
    panelVersion.style.marginTop = '0px';
    panelVersion.style.marginBottom = '5px';
    panelVersion.innerText = 'v. ' + scriptVersion;
    panelVersion.style.textAlign = 'center';
    panelVersion.style.fontSize = '14px';
    panelTreasures.style.fontSize = '16px';
    panelTreasures.style.marginTop = '0px';
    panelTreasures.style.marginBottom = '15px';
    panelTreasures.style.textAlign = 'center';
    panelTreasures.innerText = 'Список сокровищниц';
    runParse.style.display = 'inline-block';
    runParse.style.margin = '5px auto 10px';
    runParse.style.marginLeft = '16.5%';
    runParse.style.padding = '3px 8px';
    runParse.style.fontSize = '16px';
    runParse.innerText = 'Запустить скрипт';
    refreshBtn.style.display = 'inline-block';
    refreshBtn.style.margin = '5px auto 10px';
    refreshBtn.style.marginLeft = '2%';
    refreshBtn.style.padding = '3px 8px';
    refreshBtn.style.fontSize = '16px';
    refreshBtn.innerText = 'Обновить информацию';
    stopParse.style.display = 'inline-block';
    stopParse.style.margin = '5px auto 10px';
    stopParse.style.marginLeft = '2%';
    stopParse.style.padding = '3px 8px';
    stopParse.style.fontSize = '16px';
    stopParse.innerText = 'Остановить скрипт';
    clearEmpty.style.display = 'inline-block';
    clearEmpty.style.margin = '5px auto 10px';
    clearEmpty.style.marginLeft = '2%';
    clearEmpty.style.padding = '3px 8px';
    clearEmpty.style.fontSize = '16px';
    clearEmpty.innerText = 'Убрать пустые';
    scriptIteration.innerText = 'Текущая итерация скрипта: 0';
    scriptIteration.style.display = 'inline-block';
    scriptIteration.style.width = '50%';
    scriptIteration.style.textAlign = 'center';
    scriptIteration.style.marginBottom = '5px';
    scriptIteration.style.fontSize = '14px';
    scriptStep.innerText = 'Выполняется поиск по странице: 0';
    scriptStep.style.display = 'inline-block';
    scriptStep.style.width = '50%';
    scriptStep.style.textAlign = 'center';
    scriptStep.style.marginBottom = '5px';
    scriptStep.style.fontSize = '14px';
    emptyTreasures.innerText = 'Пока пусто! Запускай скрипт!';
    emptyTreasures.style.textAlign = 'center';
    emptyTreasures.style.marginBottom = '15px';
    emptyTreasures.style.fontSize = '15px';
    panelTimer.style.textAlign = 'center';
    panelTimer.style.fontSize = '10px';
    panelTimer.style.marginTop = '10px';
    panelStartTime.style.display = 'inline-block';
    panelStartTime.style.width = '45%';
    panelStartTime.style.marginLeft = '5%';
    panelStartTime.style.textAlign = 'left';
    panelStartTime.style.fontSize = '10px';
    panelNextStepTime.style.display = 'inline-block';
    panelNextStepTime.style.width = '45%';
    panelNextStepTime.style.textAlign = 'right';
    panelNextStepTime.style.fontSize = '10px';
}

				/* Добавление обработчиков */

{
    runParse.addEventListener('click', function(){
        runParse.innerText = 'Начать перезапуск!';
        runParse.style.marginLeft = '17%';
        emptyTreasures.innerText = 'Пока пусто! Ждём...';
        firstStart();
        mainTimer = setInterval(mainParsing, 3780000);
    });
    stopParse.addEventListener('click', function() {
        clearInterval(mainTimer);
        for( var t = 0; t < pages.length; t++ ) {
		  clearTimeout(timersForPages[t]); 
		  clearInterval(stepTimers[t]);
        }
        for( var u = 0; u <= lastPage; u++) clearTimeout(timersForGifts[u]);
        firstPage = +scriptStep.innerText.match(/\d+/)[0];
        for ( var i = firstPage; i <= lastPage; i++ ) {
		  pages[i-firstPage] = 'https://rpgtop.su/p' + i + '.html';
        }
        panelStartTime.innerText = '';
        panelNextStepTime.innerText = '';
        panelTimer.innerText = 'Скрипт остановлен';
    });
}

                /* Чистим консоль */

setInterval(function(){
    console.clear();
}, 1200000);
kur_current = hup_current = function(){
    return true;
};
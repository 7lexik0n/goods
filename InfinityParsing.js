										/* Глобальные переменные */
{
var iteration = 0,                     // текущая итерация скрипта
    scriptVersion = '1.3',
    minTreasure = 1500,
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
    demoRegime = false,
    autoStole = false,
    spaunersList = ["Уголок библиотеки", "Хвойный лес", "Дубовая роща", "Звездное небо", "Гнездо", "Глиняный карьер", "Средняя угольная шахта", "Пшеничное поле", "Гора Фиджи", "Осиновый лес", "Место раскопок", "Поле битвы", "Песочный карьер", "Дом призраков", "Лещина обыкновенная", "Имбирное поле", "Березовая роща", "Малая железная шахта", "Средняя железная шахта", "Тополиная аллея", "Бамбуковая роща", "Поле сахарной свеклы", "Курица Пышка", "Сочный луг", "Галактика", "Малая угольная шахта", "Льняное поле", "Рисовое поле", "Галактика «Звездных войн»", "Искусственный пруд"],
    spaunersPrev = {},
    spaunersCurrent = {},
    persSpaunersPrev = {},
    persSpaunersCurrent = {};

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
    generalWindow = 0,                  // главное окно поиска
    treeWindow = 0;                     // окно дерева подарков

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
{
    function firstStart() {
        console.clear();
        console.info('Привет! Запущен скрипт авто-парсинга v.' + scriptVersion + '. Ищу предметы и сокровищницы, а также сообщаю информацию о последних в консоли.');
        console.log('%cУбедитесь, что всплывающие окна на сайтах https://rpgtop.su и https://top.roleplay.ru не блокируются!', 'font-weight: bold;');
        mainParsing();
    };
    if (editFirstPage == 0) firstPage = 1;
    for(let i = firstPage; i <= lastPage; i++ ) {
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
    treeWindow = window.open('https://rpgtop.su/cgi-bin/g.cgi?a=tree', 'treeWindow', 'width=64,height=48'); 
    treeWindow.moveTo(0,1024);
    treeWindow.resizeTo(0,0);
    treeWindow.document.title = 'ДРЕВО ПОДАРКОВ';
    treeWindow.dtitle = 'ДРЕВО ПОДАРКОВ';
}

				/* Сбор предметов с древа подарков */   

function collectTree() {
    treeWindow.location.href = 'https://rpgtop.su/cgi-bin/g.cgi?a=tree';
    console.warn('Поглядим, чего на деревце созрело...');
    setTimeout(function(){
        var tree = treeWindow.document.querySelector('.tree_plods');
        var plods = tree.querySelectorAll('span a');
        var plodsFilter = [];
        for (let i = 0; i < plods.length; i++) {
            if (plods[i].href.match(/get/)) plodsFilter.push(plods[i]);
        }
        plods = [];
        for (let i = 0; i < plodsFilter.length; i++) {
            plods[i] = plodsFilter[i].parentElement;
        }
        if (plods.length != 0) {
            if (plods.length > 1) {
                console.log('На древе созрели предметы:');
            }
            else {
                console.log('На древе созрел предмет:');
            }
            for (let i = 0; i < plods.length; i++) {
                (function(i){
                    plods[i].children[0].alt;
                })(i);
            };
        };
        if (plods.length != 0) {
            for (let k = 0; k < plods.length; k++) {
                (function(k){
                    if (k == 0) {
                        plods[k].children[1].click();
                        console.warn('Собран 1-й предмет c дерева: ' + plods[k].children[0].alt);
                    }
                    else {
                        if ((treeWindow.document) && (treeWindow.document.body)) {
                             setTimeout(function(){
                                 treeWindow.document.body.appendChild(plods[k]);
                                 console.log('Добавлен ' + (k+1) + ' предмет: ' + plods[k].children[0].alt);                                         
                             }, 200*k);
                             setTimeout(function(){
                                 plods[k].children[1].click();
                                 console.warn('Собран ' + (k+1) + ' предмет c дерева: ' + plods[k].children[0].alt);
                             }, 200*k+20);
                         } else console.log('Загрузка страницы не успела за скриптом!. Предмет будет пропущен во избежание нарушений работы скрипта.');
                    }
                })(k);
            }
        }
        else {
            console.warn('А ничего пока на дереве не созрело! Поиграйте в доминошки!');
        }
    }, 3000);    
}

				/* Основная функция парсинга */

function mainParsing() {
    iteration++;
    spaunersPrev = spaunersCurrent;
    spaunersCurrent = {};
    persSpaunersPrev = persSpaunersCurrent;
    persSpaunersCurrent = {};
    console.log('Инициирован проход скрипта №' + iteration + '\nСкрипт работает, вы отдыхаете! Хорошего дня :)');
    var beginWaitingTime = new Date();
	var beginWaitingHours = beginWaitingTime.getHours(),
	    beginWaitingMinutes = beginWaitingTime.getMinutes(),
	    beginWaitingSeconds = beginWaitingTime.getSeconds();
	if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
	if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes;
	if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
	panelStartTime.innerText = 'Начало текущей итерации: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds;
    var nextStartTime = new Date(+beginWaitingTime + 3780000);
    var nextStartHours = nextStartTime.getHours(),
	    nextStartMinutes = nextStartTime.getMinutes(),
	    nextStartSeconds = nextStartTime.getSeconds();
	if (nextStartHours < 10) nextStartHours = '0' + nextStartHours;
	if (nextStartMinutes < 10) nextStartMinutes = '0' + nextStartMinutes;
	if (nextStartSeconds < 10) nextStartSeconds = '0' + nextStartSeconds;
    panelNextStepTime.innerText = 'Начало новой итерации: ' + nextStartHours + ':' + nextStartMinutes + ':' + nextStartSeconds;
    generalWindow.document.title = 'PARSING!';
    scriptIteration.innerText = 'Текущая итерация скрипта: ' + iteration;
    var timeBuffer = 0;
    for(let j = 0; j < pages.length; j++) {
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
                    for( let i = 0; i < comments.length; i++ ) {
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
        for(let i = 0; i < giftImgs.length; i++) {
            (function(i){
                if (giftImgs[i].alt != '') {
                    console.log(giftImgs[i].alt);
                    spaunersList.forEach(function(cur){
                        if (giftImgs[i].alt == cur) {
                            if (giftImgs[i].style.outline != 'rgba(35, 94, 213, 0.5) solid 5px') {
                                if (!spaunersCurrent[cur]) {
                                spaunersCurrent[cur] = {};
                                spaunersCurrent[cur]['Количество'] = 0;
                                spaunersCurrent[cur]['Ссылки'] = [];
                                }
                                spaunersCurrent[cur]['Количество']++;
                                spaunersCurrent[cur]['Ссылки'].push(giftHref.href);
                            }
                            else {
                                if (!persSpaunersCurrent[cur]) {
                                persSpaunersCurrent[cur] = {};
                                persSpaunersCurrent[cur]['Количество'] = 0;
                                persSpaunersCurrent[cur]['Ссылки'] = [];
                                }
                                persSpaunersCurrent[cur]['Количество']++;
                                persSpaunersCurrent[cur]['Ссылки'].push(giftHref.href);
                            }
                        }
                    });
                };
            })(i);
        };
        if (gifts.length != 0) {            
            for(let k = 0; k < gifts.length; k++) {
                (function(k){
                    // ------------------    Обработка сокр ------------------------- //
                    if (gifts[k].href.indexOf('treasure') != -1) {
//                        console.error('Часть скрипта по сокрам');  
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
                                treasurePages = 1;
                            }, 3000);
                        }  
                        // --------- Новые сокры -------- //
                        else { 
                            var matches = 0;
                            treasureWindow.location.href = gifts[k].href;
                            setTimeout(function(){
                                // ------------ Проход по сокрам ---------- //
                                for( let m = 0; m < treasurePages; m++ ) {
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
                                    treasurePages = treasurePages + 1;
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
    treasureKeys[currentNumber] = [];
    treasureKeysHav[currentNumber] = [];
    if (currentTreasureWindow.document.querySelector('.treasure_main_keys')) {
		if ( devastation > 2) console.log('Тут, кстати, еще даже что-то есть :) \nПравда, опустошили уже ' + devastation + ' раз(а). На многое рассчитывать не стоит. Зато около 0.2 баллов опыта, что тоже неплохо!');
		else console.log('Тут, кстати, еще даже что-то есть :) \nА мы в числе первых!');
		if (treasureList.filling[currentNumber] != 'nothingElse') treasureList.filling[currentNumber] = true;
		treasureList.devTimes[currentNumber] = devastation;        
        var keys = currentTreasureWindow.document.querySelector('.treasure_main_keys').querySelectorAll('img');
        for(let i = 0; i < keys.length; i++) {
            treasureKeys[currentNumber][i] = keys[i].src.slice(24,-4);
            treasureKeysHav[currentNumber][i] = keys[i].parentElement.style.backgroundColor;
            if ((keys[i].src.slice(24,-4) == 620) || (keys[i].src.slice(24,-4) == 621) || (keys[i].src.slice(24,-4) == 622) || (keys[i].src.slice(24,-4) == 623)) treasureKeysHav[currentNumber][i] = 'red';
        }
	} else {
//        console.warn('Часть скрипта присваивания ключей');
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
    if (treasureKeysHav[i] == 0) {
        var keyBlock = document.createElement('span');
            keyBlock.style.width = '100%';
            keyBlock.style.textAlign = 'center';
            keyBlock.style.fontSize = '12px';
        keyBlock.innerText = 'cокровищница уже вскрыта!';
        treasureList.keys[i].appendChild(keyBlock);
    }
    else {
        for(let u = 0; u < 4; u++) {  
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
    }
        
    treasureList.diggBtn[i] = document.createElement('button');
    treasureList.diggBtn[i].style.display = 'block';
    treasureList.diggBtn[i].style.width = '180px';
    treasureList.diggBtn[i].style.boxSizing = 'border-box';
    treasureList.diggBtn[i].style.textAlign = 'center';
    treasureList.diggBtn[i].style.margin = '10px auto';
    treasureList.diggBtn[i].style.marginBottom = '10px';
    treasureList.diggBtn[i].innerText = 'Искать ключи';    
    
    panel.insertBefore(treasureList.treasuresNames[i], runParse);    
    treasureList.treasuresNames[i].classList.add('parserText');
    treasureList.treasuresNames[i].classList.add('parserTreasureInfo');
	panel.insertBefore(treasureList.treasuresLeft[i], runParse);
    treasureList.treasuresLeft[i].classList.add('parserText');
    treasureList.treasuresLeft[i].classList.add('parserTreasureInfo');
	panel.insertBefore(treasureList.devastation[i], runParse);
    treasureList.devastation[i].classList.add('parserText');
    treasureList.devastation[i].classList.add('parserTreasureInfo');
	panel.insertBefore(treasureList.worth[i], runParse);
    treasureList.worth[i].classList.add('parserText');
    treasureList.worth[i].classList.add('parserTreasureInfo');
	panel.insertBefore(treasureList.hrefs[i], runParse);
    treasureList.hrefs[i].classList.add('parserText');
    treasureList.hrefs[i].classList.add('parserTreasureInfo');
    panel.insertBefore(treasureList.time[i], runParse);
    treasureList.time[i].classList.add('parserText');
    treasureList.time[i].classList.add('parserTreasureTime');
    panel.insertBefore(treasureList.keys[i], runParse);
    treasureList.keys[i].classList.add('parserText');
    treasureList.keys[i].classList.add('parserKeys');
    if (demoRegime == false) {
        panel.insertBefore(treasureList.diggBtn[i], runParse);
        treasureList.diggBtn[i].classList.add('parserButton');
        treasureList.diggBtn[i].classList.add('diggButton');
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
    if (demoRegime == false) {
        (function(i){
            if (stoleCheck.checked) {
                treasureList.diggBtn[i].click();
            }
            else console.warn('Сокровищница №' + treasureNumbers[i] + ' добавлена в список. Автоматическая обработка отключена. Кайеф! Копайте сами!');
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
    checkForChest(activeTreasurePage, number, treasureList);
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
        console.error('Cокровищница №' + treasureNumbers[number] + '. Запускается механизм перезапуска поиска ключей!');  
        activeTreasurePage[number].close();
        setTimeout(function(){
            firstUseOfTreasure(number);
        }, 5000);        
		return false;
	}    
    if ((treasureList.filling[number] == 'nothingElse') || (!treasureList.filling[number])) {
		console.error('Cокровищница №' + treasureNumbers[number] + ' опустошена либо недоступна. Функция обрывается');
        treasureList.diggBtn[number].innerText = 'Вскрыта!';
        treasureList.diggBtn[number].disabled = 'true';
        activeTreasurePage[number].close();
		return false;
	}    
    if (!activeTreasurePage[number].document.querySelector('.treasure_main_text')) {
		console.error('Cокровищница №' + treasureNumbers[number] + '. На искомой странице отсутствует сокровищница. Функция обрывается. ');  
        console.error('Cокровищница №' + treasureNumbers[number] + '. Запускается механизм перезапуска поиска ключей!');  
        activeTreasurePage[number].close();
        setTimeout(function(){
            firstUseOfTreasure(number);
        }, 5000);        
		return false;
	}        
    if (activeTreasurePage[number].document.querySelector('.treasure_main_text').childElementCount == 1) {
		console.error('Сокровищница опустошена!');        
        activeTreasurePage[number].close();
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
                console.warn('Сокровищница №' + treasureNumbers[number] + '. Не нашел времени, поиск ключей будет перезапущен!');
                console.error('Cокровищница №' + treasureNumbers[number] + '. Запускается механизм перезапуска поиска ключей!');  
                var beginWaitingTime = new Date();
                var beginWaitingHours = beginWaitingTime.getHours(),
                    beginWaitingMinutes = beginWaitingTime.getMinutes(),
                    beginWaitingSeconds = beginWaitingTime.getSeconds();
                if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
                if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes;
                if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
                console.log('Время: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);
                activeTreasurePage[number].close();
                treasurePageClones[number].close();
                setTimeout(function(){
                    firstUseOfTreasure(number);
                }, 5000);        
                return false;      
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
        console.error('Cокровищница №' + treasureNumbers[number] + '. Запускается механизм перезапуска поиска ключей!');  
        treasurePageClones[number].close();
        activeTreasurePage[number].close();
        setTimeout(function(){
            firstUseOfTreasure(number);
        }, 5000);        
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
            
            if (activeTreasuresStep[number] >= 4) {
                console.log('На следующем проходе работа с сокровищницей будет завершена!');
                console.log('Сокровищница №' + treasureNumbers[number] + '. setTimeout установлен! Время ожидания: ' + timeOfKeyFinding[number] + ' сек.');
                var beginWaitingTime = new Date();
				var beginWaitingHours = beginWaitingTime.getHours(),
		   		    beginWaitingMinutes = beginWaitingTime.getMinutes(),
		    		    beginWaitingSeconds = beginWaitingTime.getSeconds();
				if (beginWaitingHours < 10) beginWaitingHours = '0' + beginWaitingHours;
				if (beginWaitingMinutes < 10) beginWaitingMinutes = '0' + beginWaitingMinutes;
				if (beginWaitingSeconds < 10) beginWaitingSeconds = '0' + beginWaitingSeconds;
				console.log('Время: ' + beginWaitingHours + ':' + beginWaitingMinutes + ':' + beginWaitingSeconds);
                setTimeout(function(){
                    checkForChest(activeTreasurePage, number, treasureList);
                }, timeOfKeyFinding[number]*1000);
            } 
            else {
                setTimeout(function(){
                    getOptimalTime(activeTreasurePage, number, treasureList);
                }, timeOfKeyFinding[number]*1000);
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
        activeTreasurePage[number].close();
		return true;
	}
    
    var keys = activeTreasurePage[number].document.querySelectorAll('.treasure_main_keys span'),
	    keyImgs = activeTreasurePage[number].document.querySelectorAll('.treasure_main_keys span img'),
	    redKeys = 0,
	    splinters = 0;
    
    for(let i = 0; i < keys.length; i++) {
        if (keys[i].style.backgroundColor == 'red') redKeys++;
        if ((keyImgs[i].src.slice(24,-4) == 621) || (keyImgs[i].src.slice(24,-4) == 620) || (keyImgs[i].src.slice(24,-4) == 623) || (keyImgs[i].src.slice(24,-4) == 622)) splinters++;
    }
    
    if ((redKeys == 0) && (splinters == 0) && (activeTreasuresStep[number] == 4) && (activeTreasurePage[number].document.querySelector('.treasure_main_text').children[2].children[3])) {       if ((howMuch(number)) > minTreasure) {
            console.warn('Сокровищница №' + treasureNumbers[number] + '. Решено! Буду грабить!');
            activeTreasurePage[number].document.querySelector('.treasure_main_text form').children[3].click();
            console.warn('Сокровищница №' + treasureNumbers[number] + '. Сундук удачно забран :)'); 
            treasureList.diggBtn[number].innerText = 'Вскрыта!';
            treasureList.diggBtn[number].disabled = 'true';
            treasureList.filling[number] = false;
            treasureList.treasuresLeft[number].innerText = 'Опустошена';
            chests[number] = true;
            (function(number){
                setTimeout(function(){
                    activeTreasurePage[number].close();
                }, 2000); 
            })(number);               
            return true;
        }
        else {
            console.warn('Сокровищница №' + treasureNumbers[number] + '. Фактическая стоимость менее ' + minTreasure + ' зол.! Ключи дороже стоят!');
            treasureList.diggBtn[number].innerText = 'Дешман!';
            activeTreasurePage[number].close();
        }
    } else {
        console.warn('Сокровищница №' + treasureNumbers[number] + '. Не могу взять сундук!');
        console.log('Сокровищница №' + treasureNumbers[number] + '. Недоступных ключей/осколков: ' + redKeys);
        console.log('Сокровищница №' + treasureNumbers[number] + '. Из них осколков: ' + splinters);
        if (activeTreasuresStep[number] >= 4) {
            console.warn('Сокровищница №' + treasureNumbers[number] + '. Использовано попыток: ' + activeTreasuresStep[number] + '. Сундук не взять! Уходим гордо!');
            treasureList.diggBtn[number].innerText = 'Ну и не надо!';
            activeTreasurePage[number].close();
        }
		return false;
    }
};

                /* Функция расчета текущей стоимости сокры */

function howMuch(number) {
    var cost = treasureWorth[number],
        indexNumber = treasureList.devTimes[number],
        coeffs = [1,0.85,0.75,0.65,0.55,0.45,0.4,0.35,0.31,0.27,0.24,0.21,0.19,0.17,0.15,0.14,0.13,0.12,0.11,0.1];
        console.log('В этой сокре будем ' + (indexNumber+1) + '-ми!');
    var curWorth = Math.round(cost*coeffs[indexNumber]);
    console.log('Фактическая стоимость сокры №' + treasureNumbers[number] + ': ' + curWorth + ' зол.!');
    return curWorth;
}

                /* Функция отображения актуальных спаунеров */

function whatDigg() {
    var spaunersItemList;
    var persSpaunersList;
    if (iteration == 1) {
        spaunersItemList = spaunersCurrent;
        persSpaunersList = persSpaunersCurrent;
    }
    else {
        spaunersItemList = spaunersPrev;
        persSpaunersList = persSpaunersPrev;
    }
    var counter = 0;
    for (var key in spaunersItemList) {
        counter++;
    }
    if  (counter == 0) {
        console.warn('Пока спаунеров не найдено! Пдажжи!');
    }
    else {
        console.warn('Список актуальных спаунеров:');
        for (var key in spaunersItemList) {
            console.warn(key);
            console.log('Количество: ' + spaunersItemList[key]['Количество']);
            spaunersItemList[key]['Ссылки'] = unique(spaunersItemList[key]['Ссылки']);
            console.log(spaunersItemList[key]['Ссылки']);
        }        
    }
    counter = 0;
    for (var key in persSpaunersList) {
        counter++;
    }
    if  (counter == 0) {
        console.warn('Персональных спаунеров не ма!');
    }
    else {
        console.warn('Список актуальных персональных спаунеров:');
        for (var key in persSpaunersList) {
            console.warn(key);
            console.log('Количество: ' + persSpaunersList[key]['Количество']);
            persSpaunersList[key]['Ссылки'] = unique(persSpaunersList[key]['Ссылки']);
            console.log(persSpaunersList[key]['Ссылки']);
        }        
    }
}

                /* Функция уникализации элементов массива */

function unique(arr) {
    var obj = {};
    for (let i = 0; i < arr.length; i++) {
        var str = arr[i];
        obj[str] = true;
    }
    return Object.keys(obj);
}

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
        panelNextStepTime = document.createElement('div'),
        checkerWrapper = document.createElement('div'),
        stoleCheck = document.createElement('input'),        
        checkBoxText = document.createElement('label');
}

				/* Добавление DOM объектов на страницу */
{
    logo.parentNode.removeChild(logo);
    if (document.querySelector('.block_3')) {
        mainArray.removeChild(document.querySelector('.block_3'));
    }    
    wrapper.removeChild(document.querySelector('.reclama468'));
    wrapper.insertBefore(panel, navigation);
    top_brand.style = '';
    top_brand.style.backgroundImage = 'url(http://beloweb.ru/wp-content/uploads/2014/05/1234567112.jpg)';
    top_brand.style.height = '450vh';
    panel.classList.add('contentWrapper');
    panel.appendChild(panelTitle);
    panelTitle.classList.add('parserTitle');
    panelTitle.classList.add('parserText');
    panel.appendChild(panelVersion);
    panelVersion.classList.add('parserText');
    panelVersion.classList.add('parserVersion');
    panel.appendChild(panelTreasures);
    panelTreasures.classList.add('parserText');
    panelTreasures.classList.add('parserTreasures');
    panel.appendChild(checkerWrapper);
    checkerWrapper.appendChild(stoleCheck);
    stoleCheck.classList.add('parserCkeck');
    checkerWrapper.appendChild(checkBoxText);
    checkBoxText.classList.add('parserText');
    checkBoxText.classList.add('parserCheckBoxText');
    panel.appendChild(emptyTreasures);
    emptyTreasures.classList.add('parserText');
    panel.appendChild(runParse);
    runParse.classList.add('parserButton');
    runParse.classList.add('parserStart');
    panel.appendChild(refreshBtn);
    refreshBtn.classList.add('parserButton');
    refreshBtn.classList.add('parserRefresh');
    panel.appendChild(clearEmpty);
    clearEmpty.classList.add('parserButton');
    clearEmpty.classList.add('parserClear');
    panel.appendChild(stopParse);
    stopParse.classList.add('parserButton');
    stopParse.classList.add('parserStop');
    panel.appendChild(scriptIteration);
    scriptIteration.classList.add('parserText');
    panel.appendChild(scriptStep);
    scriptStep.classList.add('parserText');
    panel.appendChild(panelTimer);
    panelTimer.classList.add('parserText');
    panelTimer.classList.add('parserTimer');
    panel.appendChild(panelStartTime);
    panelStartTime.classList.add('parserText');
    panelStartTime.classList.add('parserTime');
    panel.appendChild(panelNextStepTime);
    panelNextStepTime.classList.add('parserText');
    panelNextStepTime.classList.add('parserTime');
}

				/* Стилизация DOM объектов */
{
    panel.style.margin = '-100px auto 25px';
    panel.style.width = '1000px';
    panel.style.height = '';
    panel.style.paddingBottom = '15px';    
    panel.style.background = 'linear-gradient(rgba(60, 79, 212, 0.82), rgba(98, 210, 147, 0.9))';
    panel.style.borderRadius = '85px';
    panel.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 2px 5px';
    "inset 1px 1px 0px #f1d490, 0px 2px 5px rgba(0, 0, 0, 0.5)";
    panel.style.border = '3px solid rgba(255, 255, 255, 0.75)';
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
    panelTreasures.style.marginBottom = '5px';
    panelTreasures.style.textAlign = 'center';
    panelTreasures.innerText = 'Список сокровищниц';
    runParse.style.display = 'inline-block';
    runParse.style.margin = '5px auto 10px';
    runParse.style.marginLeft = '23.5%';
    runParse.innerText = 'Запустить скрипт';
    refreshBtn.style.display = 'inline-block';
    refreshBtn.style.margin = '5px auto 10px';
    refreshBtn.style.marginLeft = '2%';
    refreshBtn.innerText = 'Что копать?';
    stopParse.style.display = 'inline-block';
    stopParse.style.margin = '5px auto 10px';
    stopParse.style.marginLeft = '2%';
    stopParse.innerText = 'Остановить скрипт';
    clearEmpty.style.display = 'inline-block';
    clearEmpty.style.margin = '5px auto 10px';
    clearEmpty.style.marginLeft = '2%';
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
    stoleCheck.type = 'checkbox';
    stoleCheck.checked = '';
    stoleCheck.style.marginBottom = '15px';
    stoleCheck.style.marginLeft = '45%';
    stoleCheck.style.verticalAlign = 'middle';
    checkBoxText.innerText = 'автовскрытие';
    checkBoxText.style.verticalAlign = 'middle';
    checkBoxText.style.marginBottom = '15px';
    checkBoxText.style.fontSize = '12px';
    checkBoxText.style.display = 'inline-block';
    stoleCheck.id = 'autoStolen';
    checkBoxText.setAttribute('for', 'autoStolen');
}
{
    var css = "@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap&subset=cyrillic'); .parserText {color: #fff; font-family: 'Roboto', Arial, sans-serif; font-size: 14px; font-weight: 400;} .parserTitle {font-weight: 700; font-size: 20px;}; .parserVersion {font-weight: 500; font-size: 15px;} .parserTreasures {font-weight: 500; font-size: 16px;} .parserCheckBoxText {font-weight: 300; font-size: 12px;} .parserButton {background-color: rgba(162, 37, 177, 0.66); font-family: 'Roboto', Arial, sans-serif; font-weight: 300; font-size: 14px; color: #fff; box-shadow: 0px 0px 5px rgba(0,0,0,0.8); transition: box-shadow .5s, background-color .5s; border: none; border-radius: 10px; padding: 5px 10px; outline: none;} .parserButton:hover {box-shadow: 0px 0px 8px rgba(0,0,0,0.85); background-color: rgba(177, 37, 82, 0.8);} .parserButton:disabled {background-color: rgba(30, 7, 33, 0.66);} .parserTreasureInfo {font-size: 15px; color: #fff;} .parserTreasureInfo a {transition: text-decoration: .5s; color: #fff; font-family: 'Roboto', Arial, sans-serif;} .parserTreasureInfo a:hover {text-decoration: none; color: #fff;} .diggButton {margin: 10px auto;} .parserTreasureTime {font-weight: 300; font-size: 13px;} .parserKeys {font-weight: 300; font-size: 12px}",
    head = document.head,
    style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
}

				/* Добавление обработчиков */

{
    top_brand.parentElement.addEventListener('click', function(evt){
        evt.preventDefault();
    });
    runParse.addEventListener('click', function(){
        runParse.innerText = 'Начать перезапуск!';
        runParse.style.marginLeft = '22.5%';
        emptyTreasures.innerText = 'Пока пусто! Ждём...';
        firstStart();
        mainTimer = setInterval(mainParsing, 3780000);        
        collectTree();
        treeID = setInterval(collectTree, 1500000);
    });
    stopParse.addEventListener('click', function() {
        clearInterval(mainTimer);
        clearInterval(treeID);
        for( var t = 0; t < pages.length; t++ ) {
		  clearTimeout(timersForPages[t]); 
		  clearInterval(stepTimers[t]);
        }
        for( var u = 0; u <= lastPage; u++) clearTimeout(timersForGifts[u]);
        firstPage = +scriptStep.innerText.match(/\d+/)[0];
        for( let i = firstPage; i <= lastPage; i++ ) {
		  pages[i-firstPage] = 'https://rpgtop.su/p' + i + '.html';
        }
        panelStartTime.innerText = '';
        panelNextStepTime.innerText = '';
        panelTimer.innerText = 'Скрипт остановлен';
    });
    refreshBtn.addEventListener('click', whatDigg);
}

                /* Чистим консоль */

//setInterval(function(){
//    console.clear();
//}, 7200000);

                /* Убираем мусор топа */

kur_current = hup_current = function(){
    return true;
};
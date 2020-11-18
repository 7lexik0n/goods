    // ---------- Глобальные переменные ------------ //

    {
        var targetWindows = [];
        var commWindow = 0;
        var giftWindow = 0;
        var timersOpen = [],
            timersClose = [],
            timersFind = [];
        var timerID = 0;
        var startTimer = 0;
        var instTimer = 0;
        var n = 0;
        var giftsArray = [];
        var showChecker = 0;
        var version = '3.3.2-2b';
        var siteTitle = '';
        var instWindow = 0;
        var workTime = 0;
        var masterMode = 0;
        var spaunID = 0;
    }   

    // ---------- Главные окна ------------ //

    {
        var giftWindow = window.open('https://rpgtop.su', 'popup2', 'width=64,height=48');
        giftWindow.moveTo(0,1050);
        giftWindow.resizeTo(0,0);
        var instActivation = window.open('https://rpgtop.su', 'popup1', 'width=64,height=48');
        instActivation.moveTo(0,1050);
        instActivation.resizeTo(0,0);
        var spaunWindow = 0;
    }    

    // ---------- ФУНКЦИИ ------------ //

    {
        var findGifts = function(winWork, curSite) {
            try {
                if (showChecker == 0) showAll();
                giftsArray[curSite].numberText.innerText = curSite+1;
                giftsArray[curSite].hrefText.innerText = targetWindows[curSite];
                giftsArray[curSite].nameText.innerText = winWork.document.title.slice(16,-10);
                giftsArray[curSite].nameText.style.textIndent = '10px';
                if ((winWork.document)&&(winWork.document.body)) {
                    var gifts = winWork.document.body.querySelectorAll('.gift a'),
                        giftImgs = winWork.document.body.querySelectorAll('.gift img');
                    try {
                        var siteID = winWork.location.href.match(/\d+/)[0];
                    }
                    catch(error) {
                        console.error('Критическая ошибка: потеря контекста рабочего окна');
                    }
                    if (masterMode == 1) {
                        checkSpaun(siteID, winWork);
                    }                
                } 
                else {
                    console.warn('Загрузка страницы не успела завершиться до начала работы скрипта! Во избежание поломки работы скрипта данная страница будет опущена.');
                    return false;
                }
                for (var key in giftsArray[curSite].giftsCount) {
                    giftsArray[curSite].wrapper.removeChild(giftsArray[curSite].giftsCount[key].wrapper);
                }
                giftsArray[curSite].giftsCount = {};
                for (var i = 0; i < giftImgs.length; i++) {
                    (function(i){
                            if (giftImgs[i].alt != '')	{
                                console.log(giftImgs[i].alt);
                                var giftBox = giftImgs[i].alt,
                                    giftName = giftImgs[i].alt;
                                if (giftsArray[curSite].giftsCount[giftBox]) {
                                    giftsArray[curSite].giftsCount[giftBox][giftName]++;
                                    giftsArray[curSite].giftsCount[giftBox].wrapper.innerText = giftName + ': ' + giftsArray[curSite].giftsCount[giftBox][giftName];
                                } else {
                                    giftsArray[curSite].giftsCount[giftBox] = {};  
                                    giftsArray[curSite].giftsCount[giftBox].wrapper = document.createElement('p');
                                    giftsArray[curSite].giftsCount[giftBox].wrapper.style.textIndent = '0px';
                                    giftsArray[curSite].giftsCount[giftBox].wrapper.style.width = '100%';
                                    giftsArray[curSite].giftsCount[giftBox].wrapper.style.textAlign = 'center';
                                    giftsArray[curSite].wrapper.appendChild(giftsArray[curSite].giftsCount[giftBox].wrapper);
                                    giftsArray[curSite].giftsCount[giftBox][giftName] = 1;                               
                                    giftsArray[curSite].giftsCount[giftBox].wrapper.innerText = giftName + ': ' + giftsArray[curSite].giftsCount[giftBox][giftName];
                                }
                            }
                    })(i);
                }
                if (gifts.length != 0) {
                    console.log('Сайт ' + winWork.document.title.slice(16,-10));
                    for (var k = 0; k < gifts.length; k++) {
                        (function(k){
                            if (k == 0) {
                                gifts[k].click();
                                console.warn('Собран 1-й предмет: ' + gifts[k].children[0].alt + ' на сайте ' + winWork.document.title.slice(16,-10));
                            }
                            else {
                                if (k < 10) {
                                    if ((winWork.document) && (winWork.document.body)) {
                                        setTimeout(function(){
                                            winWork.document.body.appendChild(gifts[k]);
                                            console.log('Добавлен ' + (k+1) + ' предмет: ' + gifts[k].children[0].alt);
                                        }, 900*k);
                                        setTimeout(function(){
                                            gifts[k].click();
                                            console.warn('Собран ' + (k+1) + ' предмет: ' + gifts[k].children[0].alt);
                                        }, 900*k+20); 
                                    } else {
                                        console.log('Загрузка страницы не успела за скриптом!. Предмет будет пропущен во избежание нарушений работы скрипта.');
                                    }
                                } else {
                                    console.log('Переполнение стэка на сайте ' + winWork.document.title.slice(16,-10) + '. ' + gifts[k].children[0].alt + ' будет подобран при следующем проходе');
                                }
                            }
                        })(k);
                    }
                }
            }
            catch(e) {
                console.error('Скрипт не может продолжать работу. Цикл будет перезапущен');
            }
        };
        var checkSpaun = function(siteID, winWork) {
            var spauners = winWork.document.querySelectorAll('.gift span img');
            var siteName = winWork.document.title.slice(16,-10);
            console.log('На сайте ' + siteName + ' установлено спаунеров: ' + spauners.length + ' шт.');
            if (spauners.length < 3) setSpauner(siteID, spauners.length, siteName);
        };
        var setSpauner = function(siteID, spaunersNumb, siteName) {
            var addSpauners = 3 - spaunersNumb;
            for (var i = 0; i < addSpauners; i++) {
                spaunWindow.location.href = 'https://rpgtop.su/cgi-bin/m.cgi?a=spawns&id=' + spaunID + '&site=' + siteID + '&ver=on';
                console.warn('На сайте ' + siteName + ' установлен спаунер!');
            }            
        }
        var addSite = function(href) {
            targetWindows[n] = href;
            giftsArray[n] = {};
            giftsArray[n].wrapper = document.createElement('div');
            giftsArray[n].wrapper.style.margin = '2px auto';
            giftsArray[n].wrapper.style.textAlign = 'center';
            giftsArray[n].wrapper.style.width = 'auto';
            giftsArray[n].number = document.createElement('div');
            giftsArray[n].number.style.display = 'inline-block';
            giftsArray[n].number.style.textAlign = 'center';
            giftsArray[n].href = document.createElement('div');
            giftsArray[n].href.style.display = 'inline-block';
            giftsArray[n].href.style.textAlign = 'center';
            giftsArray[n].name = document.createElement('div');
            giftsArray[n].name.style.display = 'inline-block';
            giftsArray[n].name.style.textAlign = 'center';  
            if (showChecker == 1) showSite(n);
            n++;                                 
            workTime = targetWindows.length*12.5;
        }
        var digg = function() {
            if (targetWindows.length > 75) {
                console.error('ВНИМАНИЕ!');
                console.warn('Добавлено слишком большое число страниц! Общее количество: ' + targetWindows.length + ' шт. Допустимое количество - 75 страниц.');
                console.warn('Потребуется больше 15 минут, чтобы просмотреть их все. Пожалуйста, удалите лишние страницы и нажмите кнопку "Start".');
                return false;
            }
            for (var i = 0; i < targetWindows.length; i++) {
                (function(i){                
                    timersOpen[i] = setTimeout(function(){ 
                        console.log('Открывается ' + (i+1) + ' сайт ');
                        giftWindow.location.href = targetWindows[i];
                    }, 12500*i);
                    timersFind[i] = setTimeout(function(curSite){
                        console.log('Открыт сайт ' + giftWindow.document.title.slice(16,-10));
                        siteTitle = giftWindow.document.title.slice(16,-10);
                        try {
                            findGifts(giftWindow, i);
                        }
                        catch(e) {
                            stopDigg();
                            console.warn('Внимание! Все функции остановлены! Цикл запускается заново!');
                            i = 0;
                            giftWindow.close();
                            giftWindow = window.open('https://rpgtop.su', 'popup2', 'width=64,height=48');
                            giftWindow.moveTo(0,1050);
                            giftWindow.resizeTo(0,0);
                            instActivation.close();
                            instActivation = window.open('https://rpgtop.su', 'popup1', 'width=64,height=48');
                            instActivation.moveTo(0,1050);
                            instActivation.resizeTo(0,0);
                            workTime = targetWindows.length*12.5;
                            starBtn.click();
                        }
                    }, 12500*i+2000);
                })(i);
            }
        }
        var removeSite = function(number) {
            var num = number-1;
            targetWindows.splice(num,1);
            timersOpen.splice(num,1);
            timersFind.splice(num,1);
            timersClose.splice(num,1);
            for (var key in giftsArray[num].giftsCount) {
                giftsArray[num].wrapper.removeChild(giftsArray[num].giftsCount[key].wrapper);
            }
            giftsArray[num].name.removeChild(giftsArray[num].nameText);
            giftsArray[num].wrapper.removeChild(giftsArray[num].name);
            giftsArray[num].href.removeChild(giftsArray[num].hrefText);
            giftsArray[num].wrapper.removeChild(giftsArray[num].href);
            giftsArray[num].number.removeChild(giftsArray[num].numberText);
            giftsArray[num].wrapper.removeChild(giftsArray[num].number);
            results.removeChild(giftsArray[num].wrapper);
            giftsArray.splice(num,1);
            n--;
            for (var i = 0; i < targetWindows.length; i++) {
                giftsArray[i].numberText.innerText = i+1;
            }        
            stopDigg();
            console.warn('Все функции остановлены! Нажмите START снова!');
            workTime = targetWindows.length*12.5;
        }
        var showAll = function() {
            showChecker = 1;
            for(var j = 0; j < targetWindows.length; j++) {
                var curSite = j;
                results.appendChild(giftsArray[curSite].wrapper);
                giftsArray[curSite].wrapper.appendChild(giftsArray[curSite].number);
                giftsArray[curSite].numberText = document.createElement('p');            
                giftsArray[curSite].number.appendChild(giftsArray[curSite].numberText);
                giftsArray[curSite].numberText.style.display = 'inline';
                giftsArray[curSite].numberText.style.paddingRight = '10px';
                giftsArray[curSite].numberText.innerText = curSite+1;
                giftsArray[curSite].wrapper.appendChild(giftsArray[curSite].href);
                giftsArray[curSite].hrefText = document.createElement('a');
                giftsArray[curSite].href.appendChild(giftsArray[curSite].hrefText);
                giftsArray[curSite].hrefText.href = targetWindows[j];
                giftsArray[curSite].hrefText.innerText = targetWindows[j];
                giftsArray[curSite].wrapper.appendChild(giftsArray[curSite].name);
                giftsArray[curSite].nameText = document.createElement('p'); 
                giftsArray[curSite].name.appendChild(giftsArray[curSite].nameText);
                giftsArray[curSite].nameText.innerText = '';
                console.log((j+1) + ': ' + targetWindows[j]);
            }
        }        
        var showSite = function(n){
            var curSite = n;
            results.appendChild(giftsArray[curSite].wrapper);
            giftsArray[curSite].wrapper.appendChild(giftsArray[curSite].number);
            giftsArray[curSite].numberText = document.createElement('p');            
            giftsArray[curSite].number.appendChild(giftsArray[curSite].numberText);
            giftsArray[curSite].numberText.style.display = 'inline';
            giftsArray[curSite].numberText.style.paddingRight = '10px';
            giftsArray[curSite].numberText.innerText = curSite+1;
            giftsArray[curSite].wrapper.appendChild(giftsArray[curSite].href);
            giftsArray[curSite].hrefText = document.createElement('a');
            giftsArray[curSite].href.appendChild(giftsArray[curSite].hrefText);
            giftsArray[curSite].hrefText.href = targetWindows[n];
            giftsArray[curSite].hrefText.innerText = targetWindows[n];
            giftsArray[curSite].wrapper.appendChild(giftsArray[curSite].name);
            giftsArray[curSite].nameText = document.createElement('p'); 
            giftsArray[curSite].name.appendChild(giftsArray[curSite].nameText);
            giftsArray[curSite].nameText.innerText = '';
            console.log((n+1) + ': ' + targetWindows[n]);
        };
        var activateInst = function() {
           instActivation.location.href = instHref;
           setTimeout(function(){
              var checker = instActivation.document.querySelector('form[name="confirm"]');
              checker.querySelector('label').click();
              checker.querySelector('a').click();
           }, 10000);
        }
        var checkInst = function() {
           if (instHref == '') {
               console.warn('Нет ссылки на инструмент! Работа будет продолжена без инструмента.');
               checkInst = function(){
                   console.log('Инструмент отключен');
               };
               instActivation.close();
               return false;
           }
           if (instActivation.document.querySelector('b.warn')) {
              instValue = +instActivation.document.querySelector('b.warn').innerText;
              if ((instValue == 0) || (isNaN(instValue))) {
                 console.log('Инструмент закончился');
                 activateInst();
              } else {
                  console.warn('Проверка инструмента завершена! Остаток прочности: ' + instValue);
              }
           } else {
              console.log('Инструмент закончился');
              activateInst();
           }
        }   
        var stopDigg = function() {
            if (targetWindows.length > 0) {
                for (var i = 0; i < targetWindows.length; i++) {
                    clearTimeout(timersOpen[i]);
                    clearTimeout(timersFind[i]);
                    clearTimeout(timersClose[i]);
                }
            }
            if (timerID) clearInterval(timerID);
            if (startTimer) clearTimeout(startTimer);
            if (instTimer) clearInterval(instTimer);
        };
    }  

    // ---------- Внешний вид ------------ //

    {

    // ---------- Переменные ------------ //

    {
        var container = document.querySelector('.container');
        var topBrand = document.querySelector('#top_brand');
        // var merch1 = document.querySelector('.android');
        var merch2 = document.querySelector('.reclama468');
        var nav = container.querySelector('#nav_bar');
        var but = document.createElement('button');
        var area = document.createElement('textarea');
        var spaunerInput = document.createElement('input');
        var spaunerCheck = document.createElement('input');
        spaunerCheck.type = 'checkbox';
        spaunerCheck.checked = '';
        var checkBoxText = document.createElement('span');
        var logo = document.querySelector('#logo');
        var stopBtn = document.createElement('button');
        var clearBtn = document.createElement('button');
        var starBtn = document.createElement('button');
        var showBtn = document.createElement('button');
        var clearInput = document.createElement('input');
        var wrapper = document.createElement('div');
        var title = document.createElement('p');
        var profile = document.createElement('input');
        var inst = document.createElement('input');
        var profileHref = '';
        var inventory = 0;
        var instHref = '';
        var instValue = 0; 
        var results = document.createElement('div');
    }

    // ---------- Главный блок ------------ //

    {
        logo.parentNode.removeChild(logo);
        topBrand.style = '';
		// topBrand.style.backgroundImage = 'url(http://beloweb.ru/wp-content/uploads/2014/05/1234567112.jpg)';
		topBrand.style.height = '450vh';
        // merch1.style.display = 'none';
        merch2.style.display = 'none';

        container.insertBefore(wrapper, nav);
        container.style.paddingTop = '30px';

        wrapper.style.width = '90%';
        wrapper.style.margin = '30px auto';
        wrapper.style.padding = '25px';
        wrapper.style.textAlign = 'center';
		wrapper.style.background = 'linear-gradient(rgba(60, 79, 212, 0.82), rgba(98, 210, 147, 0.9))';
		wrapper.style.borderRadius = '85px';
		wrapper.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 2px 5px';
		wrapper.style.border = '3px solid rgba(255, 255, 255, 0.75)';
		wrapper.classList.add('contentWrapper');
    }

    // ---------- Заголовок ------------ //

    {
        wrapper.appendChild(title);
        title.innerText = 'Digger-Master v ' + version;        
        title.style.textAlign = 'center';
        title.style.marginBottom = '25px';
		title.classList.add('parserTitle');
		title.classList.add('parserText');
    }

    // ---------- Ввод ссылок ------------ //

    {
        wrapper.appendChild(area);
        area.style.display = 'block';
        area.style.margin = '10px auto';
        area.style.padding = '0px 5px 0px 5px';
        area.style.textAlign = 'center';
        area.style.outline = 'none';
		area.classList.add('parserText');
		area.classList.add('textAreaStyle');
    }

    // ---------- Кнопка добавить сайты ------------ //

    {
        wrapper.appendChild(but);
        but.innerText = 'Add sites';
        but.style.display = 'block';
        but.style.margin = '10px auto';
        but.style.outline = 'none';
		but.classList.add('parserButton');
    }
        
    // ---------- Инпут спаунера ------------ //

    {
        wrapper.appendChild(spaunerInput);
        spaunerInput.style.display = 'block';
        spaunerInput.style.margin = '10px auto';
        spaunerInput.style.textAlign = 'center';
        spaunerInput.style.padding = '0px 5px 0px 5px';
        spaunerInput.style.height = '23px';
        spaunerInput.style.width = '500px';
        spaunerInput.placeholder = 'Add spauner activation href';
        spaunerInput.style.outline = 'none';
        spaunerInput.addEventListener('change', function(){
            instHref = inst.value;
        });
		spaunerInput.classList.add('parserText');
		spaunerInput.classList.add('inputStyle');
    }
        
    // ---------- Чекбокс ------------ //
        
    {
        wrapper.appendChild(spaunerCheck);
		spaunerCheck.style.verticalAlign = 'middle';
		spaunerCheck.id = 'autoSpaun';
        wrapper.appendChild(checkBoxText);
        checkBoxText.innerText = 'Ставить спаунеры';
		checkBoxText.style.verticalAlign = 'middle';
		checkBoxText.style.display = 'inline-block';
		checkBoxText.classList.add('parserText');
		checkBoxText.classList.add('parserCheckBoxText');
		checkBoxText.setAttribute('for', 'autoSpaun');
		
    }    
        
    // ---------- Кнопка показать сайты ------------ //

    {
        wrapper.appendChild(showBtn);
        showBtn.innerText = 'Show all';
        showBtn.style.display = 'block';
        showBtn.style.margin = '10px auto';
        showBtn.style.outline = 'none';
		showBtn.classList.add('parserButton');
    }

    // ---------- Кнопка стоп ------------ //

    {
        wrapper.appendChild(stopBtn);
        stopBtn.innerText = 'Stop';
        stopBtn.style.display = 'block';
        stopBtn.style.margin = '10px auto';
        stopBtn.style.outline = 'none';
		stopBtn.classList.add('parserButton');
    }

    // ---------- Инпут удаления сайта ------------ //

    {
        wrapper.appendChild(clearInput);
        clearInput.style.display = 'block';
        clearInput.style.margin = '10px auto';
        clearInput.style.textAlign = 'center';
        clearInput.style.padding = '0px 5px 0px 5px';
        clearInput.style.height = '23px';
        clearInput.style.outline = 'none';
        clearInput.placeholder = 'Site number';
		clearInput.classList.add('parserText');
		clearInput.classList.add('inputStyle');
		
    }

    // ---------- Кнопка удаления сайта ------------ //

    {
        wrapper.appendChild(clearBtn);
        clearBtn.innerText = 'Remove this site';
        clearBtn.style.display = 'block';
        clearBtn.style.margin = '10px auto';
        clearBtn.style.outline = 'none';
		clearBtn.classList.add('parserButton');
    }

    // ---------- Инпут профиля ------------ //

    {
        wrapper.appendChild(profile);
        profile.style.display = 'block';
        profile.style.margin = '10px auto';
        profile.style.textAlign = 'center';
        profile.style.padding = '0px 5px 0px 5px';
        profile.style.height = '23px';
        profile.style.width = '500px';
        profile.style.outline = 'none';
        profile.placeholder = 'Add profile href';
        profile.addEventListener('change', function(){
            profileHref = profile.value;
        });
		profile.classList.add('parserText');
		profile.classList.add('inputStyle');
    }

    // ---------- Инпут инструмента ------------ //

    {
        wrapper.appendChild(inst);
        inst.style.display = 'block';
        inst.style.margin = '10px auto';
        inst.style.textAlign = 'center';
        inst.style.padding = '0px 5px 0px 5px';
        inst.style.height = '23px';
        inst.style.width = '500px';
        inst.placeholder = 'Add instrument activation href';
        inst.style.outline = 'none';
        inst.addEventListener('change', function(){
            instHref = inst.value;
        });
		inst.classList.add('parserText');
		inst.classList.add('inputStyle');
    }

    // ---------- Кнопка старта ------------ //  

    {
        wrapper.appendChild(starBtn);
        starBtn.innerText = 'Start';
        starBtn.style.display = 'block';
        starBtn.style.margin = '10px auto';
        starBtn.style.outline = 'none';
		starBtn.classList.add('parserButton');
    }

     // ---------- Блок отображения информации ------------ //    

    {
        container.insertBefore(results, nav);
        results.style.width = '90%';
        results.style.margin = '30px auto';
        results.style.padding = '25px';
        results.style.textAlign = 'center';
		results.style.background = 'linear-gradient(rgba(60, 79, 212, 0.82), rgba(98, 210, 147, 0.9))';
		results.style.borderRadius = '85px';
		results.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 2px 5px';
		results.style.border = '3px solid rgba(255, 255, 255, 0.75)';
		results.classList.add('contentWrapper');
    }
        
    }        

    // ---------- Обработчики ------------ //

    {
        var str = 0;
        var hrefArray = 0;
        but.addEventListener('click', function(){
            stopDigg();            
            str = area.value;
            hrefArray = str.match(/https:\/\/\S+/g);
            for (var i = 0; i < hrefArray.length; i++) {
                hrefArray[i] = hrefArray[i].replace(/['"]+/g, '');
                addSite(hrefArray[i]);
            }
            area.value = '';
            if (hrefArray.length > 0) console.log('Сайты успешно добавлены: ' + hrefArray.length + ' шт.'); 
            console.warn('Все функции остановлены! Нажмите START снова!');   
        });
        stopBtn.addEventListener('click', stopDigg);
        clearBtn.addEventListener('click', function(){
            var number = clearInput.value;
            removeSite(number);
            clearInput.value = '';
        });
        starBtn.addEventListener('click', function(){
            if (spaunerCheck.checked) {
                masterMode = 1;
            } else {
                masterMode = 0;
            }
            if ((masterMode == 1)&&(spaunID == 0)) {
                str = spaunerInput.value;
                spaunID = str.match(/\d+/)[0];
            }
            if ((!spaunWindow)&&(masterMode == 1)) {
                spaunWindow = window.open('https://rpgtop.su', 'popup3', 'width=64,height=48');
                spaunWindow.moveTo(0,1050);
                spaunWindow.resizeTo(0,0);
            }
            startTimer = setTimeout(function(){
                digg();
            }, 4);
                timerID = setInterval(function(){digg();}, (workTime*1000 + 30000));
                setInterval(function(){console.clear();}, 2700000);
                instTimer = setInterval(function(){
                   instActivation.location.href = profileHref;
                   if ((instHref == '') || (profileHref == '')) {
                       console.warn('Ссылки не обнаружены! Новые проверки инструмента будут отключены.');
                       clearInterval(instTimer);
                   } else {
                       setTimeout(function(){
                          checkInst();
                       }, 15000);
                   }                   
                }, 95000);
        });
        showBtn.addEventListener('click', function(){
            showAll();
        })
    }
	
	// -------------- Стили ----------------- //
	{
    var css = "@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap&subset=cyrillic'); .parserText {color: #fff; font-family: 'Roboto', Arial, sans-serif; font-size: 14px; font-weight: 400;} .parserTitle {font-weight: 700; font-size: 20px;}; .parserVersion {font-weight: 500; font-size: 15px;} .parserTreasures {font-weight: 500; font-size: 16px;} .parserCheckBoxText {font-weight: 300; font-size: 12px;} .parserButton {padding: 10px 15px; background-color: rgba(162, 37, 177, 0.66); font-family: 'Roboto', Arial, sans-serif; font-weight: 300; font-size: 14px; color: #fff; box-shadow: 0px 0px 5px rgba(0,0,0,0.8); transition: box-shadow .5s, background-color .5s; border: none; border-radius: 10px; outline: none;} .parserButton:hover {box-shadow: 0px 0px 8px rgba(0,0,0,0.85); background-color: rgba(177, 37, 82, 0.8);} .parserButton:disabled {background-color: rgba(30, 7, 33, 0.66);} .parserTreasureInfo {font-size: 15px; color: #fff;} .parserTreasureInfo a {transition: text-decoration: .5s; color: #fff; font-family: 'Roboto', Arial, sans-serif;} .parserTreasureInfo a:hover {text-decoration: none; color: #fff;} .diggButton {margin: 10px auto;} .parserTreasureTime {font-weight: 300; font-size: 13px;} .parserKeys {font-weight: 300; font-size: 12px} .textAreaStyle {border-radius: 15px; border: 1px solid #fff; font-size: 14px; color: #fff; text-shadow: none; background: transparent; min-height: 160px; box-shadow: inset 0px 0px 25px rgba(4, 8, 72, 0.65);} .inputStyle {border-radius: 15px; border: 1px solid #fff; font-size: 14px; color: #fff; text-shadow: none; background: transparent; min-height: 25px; box-shadow: inset 0px 0px 10px rgba(4, 8, 72, 0.65);} .inputStyle::-webkit-input-placeholder {color: #fff;} .inputStyle::placeholder {color: #fff;} .contentWrapper p {color: #fff; font-family: 'Roboto', Arial, sans-serif;} .contentWrapper a {color: #fff; font-family: 'Roboto', Arial, sans-serif;}",
    head = document.head,
    style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
}
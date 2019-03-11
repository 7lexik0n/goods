(function() {
    class Loader {
        constructor(options) {
            this._status = 0
            this.options = options

            this.init()
        }
        init() {
            this._loader = $('<div class="loader"></div>').appendTo(this.options.place)
            this.status = 0
        }
        get status() {
            return this._status
        }
        set status(value) {
            const {text, max} = this.options
            const relative = parseInt(100 / max * value)

            this._status = relative
            this._loader[0].style.setProperty('--status', relative)
            this._loader[0].dataset.loader = text + value + ' / ' + max
        }
    }
    const clean = () => {
        if($('.bod .gifts').length > 0) {
            return
        }

        document.write(`
        <!doctype html>
        <html lang="ru">
            <head>
                <meta name="http-equiv" content="Content-type: text/html; charset=UTF-8" charset="UTF-8">
                <style>
                :root {
                    --status: 0;
                }
                .loader {
                    position: relative;
                    overflow: hidden;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 10px;
                    display: block;
                    margin: 10px 0;
                }
                .loader:before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: blue;
                    transform: translateX(calc(-100% + var(--status) * 1%));
                    transition: transform .2s ease-out;
                }
                .loader:after {
                    content: attr(data-loader);
                    position: relative;
                }
                .giftBlock {
                    position: relative;
                    display: inline-block;
                    padding: 20px;
                    text-align: center;
                }
                .gift {
                    position: relative;
                    display: inline-block;
                }
                .gift a {
                    position: relative;
                    z-index: 2;
                    display: block;
                }
                .gift a:after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    box-shadow: 0 0 15px 10px red;
                    opacity: .5;
                    animation-name: highlight;
                    animation-duration: 3s;
                    animation-iteration-count: infinite;
                }
                .gift .num {
                    display: table;
                    position: absolute;
                    margin-top: -61px;
                    margin-left: 5px;
                }
                @keyframes highlight {
                    0% {opacity: .5;}
                    50% {opacity: 1;}
                    100% {opacity: .5;}
                }
                </style>
                </head>
                <body class="bod">
                </body>
            </html>
        `)
    }

    const loadAnchor = async(url,query)=>{
        const resource = await fetch(url).then((resource)=>resource.text())
        const anchor = await $(`<span> ${resource} </span>`).find(query)

        return anchor
    }

    const getLinks = (arr) => arr.map((index,link) => link.href)

    const getSites = (pages) => {
        const loader = new Loader({
            place: $('.bod'),
            text: 'Ищем сайты на страницах: ',
            max: pages.length
        })
        return Promise.all(pages.map(async(item,index,arr) => {
            const sites = await loadAnchor('/p'+index+'.html','.comments a')
            const links = await getLinks(sites)
            loader.status = index + 1

            return links
        }))
    }

    const flatten = (arr) => arr.reduce((acc,item) => acc.concat(...Array.from(item)), [])

    const getGifts = (links) => {
        const loader = new Loader({
            place: $('.bod'),
            text: 'Загрузка: ',
            max: links.length
        })
        return Promise.all(links.map(async(link,index) => {
            const gift = await loadAnchor(link,'.gift')
            
            if (gift.length < 1) {
                return
            }
            
            loader.status = index + 1  
            const fullGift = {
                'gift': gift,
                'link': link
            }
            return fullGift
        }))
    }

    const filterGifts = (gifts) => gifts.filter((item)=>typeof item !== 'undefined')

    const displayGifts = (gifts) => {
        $('.bod').append(`<div class="gifts"></div>`)
        $('.bod .gifts:last-child').append(gifts)  
        var finalArr = []
        var finalTres = []
        gifts.forEach(function(el){
            for (var num in el.gift) {
                if (typeof el.gift[num] == 'object') {                    
                    if (typeof el.gift[num].children[0] !== 'undefined') {
                        $('.bod .gifts:last-child').append(`<div class="giftBlock"></div>`)
                        $('.giftBlock:last-child').append(el.gift[num])
                        if (el.gift[num].children[0].alt) {
                            var name = el.gift[num].children[0].src.slice(24,-4)
                            var val = el.gift[num].children[1].innerHTML
                            $('.giftBlock:last-child').append(`<p>${name} [${val}]</p>`)
                            var adress = el.link
                            $('.giftBlock:last-child').append(`<a href="${adress}">ССЫЛКА</a>`)
                            finalArr.push(adress)                      
                        }
                        else {
                            var name = el.gift[num].children[0].children[0].alt
                            $('.giftBlock:last-child').append(`<p>СОКРА</p>`)
                            var adress = el.link
                            $('.giftBlock:last-child').append(`<a href="${adress}">ССЫЛКА</a>`)
                            finalTres.push(adress) 
                        }
                    }                                         
                }                
            }
        })
        finalArr = unique(finalArr)
        finalTres = unique(finalTres)
        console.log(finalArr)
        $('.bod .gifts:last-child').append(`<hr>`)
        $('.bod .gifts:last-child').append(`ПРЕДМЕТЫ`)
        finalArr.forEach(function(el){
            $('.bod .gifts:last-child').append(`<p><a href="${el}">${el}</a></p>`)
        })
        $('.bod .gifts:last-child').append(`<hr>`)
        $('.bod .gifts:last-child').append(`СОКРЫ`)
        finalTres.forEach(function(el){
            $('.bod .gifts:last-child').append(`<p><a href="${el}">${el}</a></p>`)
        })        
    }

    const main = async() => {
        clean()
        const lastPage = 5
        const pages = new Array(lastPage).fill(1)
        const links = flatten(await getSites(pages))
        const fullGifts = filterGifts(await getGifts(links))
        displayGifts(fullGifts)
    }
    
    function unique(arr) {
          var obj = {};

          for (var i = 0; i < arr.length; i++) {
            var str = arr[i];
            obj[str] = true;
          }

          return Object.keys(obj);
    }

    main()
}
)()
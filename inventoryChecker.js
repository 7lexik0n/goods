var table = document.createElement('table')
var mainPage = document.querySelector('.cin');
var firstGift = document.querySelector('.gift');
mainPage.insertBefore(table, firstGift);
let giftBlocks = document.querySelectorAll('.gift');
var itemList = {};
for (let i = 0; i < giftBlocks.length; i++) {
//	let name = giftBlocks[i].getAttribute('data-title');	
	tmp = giftBlocks[i].firstElementChild.firstElementChild.getAttribute('src');
	let name = tmp.slice(7,tmp.length-4);
	let number = giftBlocks[i].querySelector('.num').innerText;	
	itemList[name] = number;
}
let orderedList = {};
Object.keys(itemList).sort().forEach(function(key) {
  orderedList[key] = itemList[key];
});
for (var key in orderedList) {
	var tableStroke = document.createElement('tr');
	table.appendChild(tableStroke);
	var tableCell = document.createElement('td');
	tableStroke.appendChild(tableCell);
	tableCell.innerText = key;
	var tableCell = document.createElement('td');
	tableStroke.appendChild(tableCell);
	tableCell.innerText = orderedList[key];
} 

let collectionBlocks = document.querySelectorAll('.block_6');
let collections = [];
for (let i = 0; i < collectionBlocks.length - 1; i++) {
	var collection = {
		title: collectionBlocks[i].querySelector('h3').innerText
	}
	var itemBlocks = collectionBlocks[i].querySelectorAll('.gift');
	var count = 0;
	for (let j = 0; j < itemBlocks.length; j++) {		
		var name = itemBlocks[j].children[0].children[0].alt;
		if (itemBlocks[j].children[0].tagName != 'A') {
			var success = '+';
			count++;
		} else var success = '-';
		collection[name] = success;
	}
	collection['count'] = count + '/' + itemBlocks.length;
	collections.push(collection);
}
var table = document.createElement('table')
var mainPage = document.querySelector('.main_aray');
var firstBlock = document.querySelector('.block_6');
mainPage.insertBefore(table, firstBlock);
for (let i = 0; i < collections.length; i++) {
	var tableStroke = document.createElement('tr');
	table.appendChild(tableStroke);
	var tableCell = document.createElement('td');
	tableStroke.appendChild(tableCell);
    if (+collections[i].title.slice(0,3) < 10) {
        tableCell.innerText = collections[i].title.slice(3) + ' (' + collections[i].count + ')';
    } else tableCell.innerText = collections[i].title.slice(4) + ' (' + collections[i].count + ')';	
	tableStroke.style.fontWeight = 'bold';
	tableStroke.style.fontSize = '18px';
	tableCell.style.borderTop = '1px solid #333';
	tableCell.style.borderBottom = '1px solid #333';
	delete collections[i].title;
	delete collections[i].count;
	Object.keys(collections[i]).sort().forEach(function(key) {
		var tableStroke = document.createElement('tr');
		table.appendChild(tableStroke);
		var tableCell = document.createElement('td');
		tableStroke.appendChild(tableCell);
		tableCell.innerText = key;
		var tableCell = document.createElement('td');
		tableStroke.appendChild(tableCell);
		tableCell.innerText = collections[i][key];
		if (collections[i][key] == '+') tableStroke.style.fontWeight = 'bold'
		else tableStroke.style.color = '#7c1b1b';
	});
}
table.style.backgroundColor = '#e8c77b';
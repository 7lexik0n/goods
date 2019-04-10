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
    delete collections[i].count;
    var collectionTitle = '';
    if (+collections[i].title.slice(0,3) < 10) {
        collectionTitle = collections[i].title.slice(3);
    } else collectionTitle = collections[i].title.slice(4);	
	delete collections[i].title;

	Object.keys(collections[i]).sort().forEach(function(key) {
		var tableStroke = document.createElement('tr');
		table.appendChild(tableStroke);
		var tableCell = document.createElement('td');
		tableStroke.appendChild(tableCell);
		tableCell.innerText = key;
        tableCell.style.padding = '5px 25px';
        var tableCell = document.createElement('td');
		tableStroke.appendChild(tableCell);
		tableCell.innerText = collectionTitle;
		var tableCell = document.createElement('td');
		tableStroke.appendChild(tableCell);
		tableCell.innerText = collections[i][key];
        tableCell.style.padding = '5px 25px';
		if (collections[i][key] == '+') tableStroke.style.fontWeight = 'bold'
		else tableStroke.style.color = '#7c1b1b';
	});
    
    var tableStroke = document.createElement('tr');
    table.appendChild(tableStroke);
    for (let j = 0; j < 3; j++) {
        var tableCell = document.createElement('td');
        tableStroke.appendChild(tableCell);
        tableCell.style.borderTop = '1px solid #333';
	    tableCell.style.borderBottom = '1px solid #333';
    }    
}
table.style.backgroundColor = '#e8c77b';
table.style.borderCollapse = 'collapse';
var questions = document.querySelector('#qlist').querySelectorAll('a[href*="qst"]'),
	questionHrefs = [],
	questionPage = 0,
	questionNumber = 1,
	answerStep = [],
	previousAnswer = [],
	questionPages = [],
	stats = [],
	questionForm = [],
	questionsDesc = [],
	questionsInputs = [],
	questionsText = [],
	submitButton = [];

for (var i = 1; i < questions.length; i++) {
	questionHrefs[i] =  questions[i].href;
	questionPages[i] = window.open(questions[i].href);
	answerStep[i] = 0;
}

setTimeout (function(){
	for (var i = 1; i < questionPages.length; i++) {
		(function(i){
			findAnswer(i);
		})(i);
	}
}, 15000);


function findAnswer(i) {
		stats[i] = questionPages[i].document.querySelector('.q_stat');
		if (stats[i].childElementCount >= 3) {
			questionForm[i] = questionPages[i].document.querySelectorAll('form')[1];
			if (answerStep[i] == 0) {
				questionsDesc[i] = questionForm[i].childNodes[7].innerText;
				console.log('[' + i + ']: ' + questionsDesc[i]);
			}
			questionsInputs[i] = [];
			questionsText[i] = [];
			submitButton[i] = questionForm[i].querySelector('input[type="submit"]');
			for (var j = 0; j < 5; j++) {
					questionsInputs[i][j] = questionForm[i].childNodes[9+j*4];
					questionsText[i][j] = questionForm[i].childNodes[10+j*4].data;
			}
			setTimeout(function() {
				questionsInputs[i][answerStep[i]].click();
				previousAnswer[i] = '[' +  i + ']: ' + questionsText[i][answerStep[i]];
				submitButton[i].click();
				setTimeout(function() {
					answerStep[i]++;
					setTimeout(function() {findAnswer(i);}, 15000);
				}, 10000);
			}, 15000);
		} else {
			console.log(previousAnswer[i]);
			console.log('Вопросник номер ' + i + ' отвечен!')
			questionPages[i].close();
			return false;
		}
};

setTimeout (function(){
	console.log('Все ответы получены!');
	for (var i = 0; i < questionPages.length; i++) {
		(function(i){
			console.log(questionsDesc[i]);
			console.log(previousAnswer[i]);
		})(i);
	}
}, 300000);
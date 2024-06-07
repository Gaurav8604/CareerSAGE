// Quiz Creator;
function CQuiz(que, o1, o2, o3, o4, ans, d) {
	this.question = que;
	this.opt1 = o1;
	this.opt2 = o2;
	this.opt3 = o3;
	this.opt4 = o4;
	this.answer = ans;
	this.asked = d;
}



let apiLink = 'https://opentdb.com/api.php?amount=10&difficulty=medium&category=12&type=multiple';

var totQ=[];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function getQuestions() {

	await fetch('/get_url_params_for_api',{
        method:'POST',
    })
    .then((response) => response.json())
    .then((data)=>{
        apiLink=`https://opentdb.com/api.php?amount=10&difficulty=${data.difficulty}&category=${data.genre_id}&type=multiple`
		console.log(apiLink)
    })
    .catch((error) => {
        console.error("Error:", error);
    });

	await fetch(apiLink)
	.then(response => {
		if (!response.ok) {
		alert('Network response was not ok! \nReload Page?')
		location.reload();
		}
		return response.json();
	})
	.then(data => {


		for(let i = 0; i < data.results.length; i++) {
			
			let lst=[data.results[i].correct_answer,data.results[i].incorrect_answers[0],data.results[i].incorrect_answers[1],data.results[i].incorrect_answers[2]]
			lst=shuffleArray(lst);
			let ind=0;
			for(let j=0;j<4;j++){
				if(lst[j]==data.results[i].correct_answer){
					ind=j+1;
				}
			}
			var tmp=new CQuiz(
				data.results[i].question,
				lst[0],lst[1],lst[2],lst[3],
				ind,
				0
			);
			totQ.push(tmp);
		}
		steps(totQ.length)
		startQuiz();
	})
	.catch(error => {
		console.error('There was a problem with your fetch operation:', error);
		alert("Problem with fetch operation \nReload Page?")
		location.reload
	});
}
getQuestions();


// // Question 1
// var q1 = new CQuiz(
// 	'Which function among the following lets to register a function to be invoked repeatedly after a certain time?',
// 	'setTimeout()',
// 	'setTotaltime()',
// 	'setInterval()',
// 	'none of the mentioned',
// 	3,
// 	0
// );

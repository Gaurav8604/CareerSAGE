function handleInputChange() {
    var textBoxValue = document.getElementById("displaySpokenText").value;
    var submitButton = document.getElementById("nextButton");
    submitButton.disabled = textBoxValue.trim() === "";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.getElementById("nextButton").click();
    }
});

function disableButtons() {
    document.getElementById("nextButton").disabled = true;
    document.getElementById("speakButton").disabled = true;
    document.getElementById("repeatButton").disabled = true;
    document.getElementById("displaySpokenText").disabled = true;
}
function enableButtons() {
    document.getElementById("nextButton").disabled = false;
    document.getElementById("speakButton").disabled = false;
    document.getElementById("repeatButton").disabled = false;
    document.getElementById("displaySpokenText").disabled = false;
}


document.addEventListener("DOMContentLoaded", function () {
    var modal = new bootstrap.Modal(
        document.getElementById("modal-notification 1")
    );
    modal.show();
    get_questions();
    localStorage.setItem("index",0);
    document.getElementById("repeatButton").disabled = true;
});


let currentData;

function get_questions(){
    fetch("/questions", {method: "POST",})
    .then((response) => response.json())
    .then((data) => {
        localStorage.setItem("questions", JSON.stringify(data.data));
    })
    .catch((error) => {
        console.error("Error:", error);
        document.getElementById("nextButton").disabled = false;
    });
}

function displayAndAnnounce(displayText) {
    const displayElement = document.getElementById("displayText");
    document.getElementById("displaySpokenText").value="";

    displayElement.value = "";
    let text = displayText;

    let currentIndex = 0;
    function displayNextLetter() {
        if (currentIndex < text.length) {
            displayElement.value += text[currentIndex];
            currentIndex++;
            setTimeout(displayNextLetter, 1); // put 20 after testing
        }
    }

    const speechSynthesis = window.speechSynthesis;
    const speechText = new SpeechSynthesisUtterance(text);
    speechText.rate = 10; //put 2 after testing
    speechText.onstart = function () {
        disableButtons();
        document.getElementById("talkingperson").src = '/static/assets/characters/Talking Man 1.gif';
        displayNextLetter();
    };
    speechText.onend = function () {
        enableButtons();
        document.getElementById('nextButton').disabled = true;
        document.getElementById("talkingperson").src = '/static/assets/characters/Not Talking Man 1.gif';
        document.getElementById("displaySpokenText").focus();
    };
    speechSynthesis.speak(speechText);
}


document.getElementById("proceedButton").addEventListener("click", () => {
    window.location.href = "/question_submission.html";
});

document.getElementById("startButton").addEventListener("click", () => {
    displayGreetings();
});



function displayGreetings(){
    displayAndAnnounce("Hello there. I am John. Let's start with your questionnaire!");
}


document.getElementById("repeatButton").addEventListener("click", () => {
    document.getElementById("speakButton").disabled = true;
    var currentData= document.getElementById("displayText").value;
    var currAnswer= document.getElementById("displaySpokenText").value;
    document.getElementById("displayText").value = "";
    displayAndAnnounce(currentData);
    document.getElementById("displaySpokenText").value = currAnswer;
    document.getElementById("speakButton").disabled = false;
});

function getSetQuestionsAnswers(index){
    var questions = JSON.parse(localStorage.getItem("questions"));
    var textInput = document.getElementById("displaySpokenText").value;
    if(index==0){
        displayAndAnnounce(questions[index].Questions);
        document.getElementById("displaySpokenText").value=questions[index].Answers;
    }
    if(index>0)
    {
        questions[index-1].Answers = textInput;
        localStorage.setItem("questions", JSON.stringify(questions));
        displayAndAnnounce(questions[index].Questions);
        document.getElementById("displaySpokenText").value=questions[index].Answers;
    }
}

document.getElementById("nextButton").addEventListener("click", () => {
    var questions = JSON.parse(localStorage.getItem("questions"));
    var index = parseInt(localStorage.getItem("index"));
    if(index>=questions.length){
        questions[index-1].Answers = document.getElementById("displaySpokenText").value;
        localStorage.setItem("questions", JSON.stringify(questions));

        fetch('/get_table', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: localStorage.getItem("questions"),
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error sending data:', error);
        });

        document.getElementById("currentQuestion").innerHTML = "-- / --";
        var modal = new bootstrap.Modal(
            document.getElementById("modal-notification 2")
        );
        modal.show();
        setTimeout(() => {
            window.location.href = "/question_submission.html";
        }, 5000);
    } else if(index>=0) {
        document.getElementById("currentQuestion").innerHTML = `${index+1} / ${questions.length}`;
        getSetQuestionsAnswers(index);
    }
    localStorage.setItem("index", index+1);
});



document.getElementById("speakButton").addEventListener("click", () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.onstart = function () {
            disableButtons();
        };
        recognition.onresult = function (event) {
            enableButtons();
            var transcript = event.results[0][0].transcript;
            document.getElementById("displaySpokenText").value = transcript;
        };
        recognition.onerror = function (event) {
            console.error('Speech recognition error:', event.error);
        };
        recognition.start();
    } else {
        alert('Speech recognition is not supported in this browser.');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    fetch('/send_scores',{
        method:'POST',
    })
    .then(response => response.json())
    .then(data => {   
        let RColor='red';
        let percentage=data.score[2];
        if (percentage == 100) {
            RColor = '#007000';
        } else if (percentage >= 70) {
            RColor = '#238823';
        } else if (percentage >= 50) {
            RColor = 'yellow';
        } else if (percentage >= 30) {
            RColor = 'orange';
        } else {
            RColor = '#D2222D';
        }
        const progressBars=[{course:"Scored "+data.score[0],percent:data.score[2],color:RColor},
        {course:"Accuracy",percent:data.score[3],color:RColor}]
        createProgressBars(progressBars);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });        
});


function createProgressBars(courses) {
    const container = document.querySelector(".cntnr");
    courses.forEach((course) => {
    container.innerHTML += `
    <div class="progess-group">
    <div class="circular-progress " >
        <span class="course-value" style="color:${course.color}">0%</span>
    </div>
    <label class="text" style="color:${course.color}">${course.course}</label>
    </div>
    `;
    });

    //style="  background: conic-gradient(${course.color} ${3.6 * course.percent}deg, #fff 0deg);"

    const progressGroups = document.querySelectorAll(".progess-group");

    progressGroups.forEach((progress, index) => {
    let progressStartValue = 0;
    let progressStartEnd = courses[index].percent;
    let speed = 10;
    let progessTimer = setInterval(() => {
        if (progressStartValue >= progressStartEnd) {
        clearInterval(progessTimer);
        }
        progress.querySelector(".circular-progress").style.background = `
        conic-gradient(${courses[index].color} ${3.6 * progressStartValue}deg, #fff 0deg)`;

        progress.querySelector(".course-value").innerHTML = progressStartValue + "%";
        progressStartValue++;
    }, speed);
    });
}


document.getElementById("submit_button").addEventListener("click", function () {
    document.getElementById('submit_button').disabled=true;
    document.getElementById('submit_button').textContent="Submitting...";
    fetch('/get_score_quiz_info',{
        method:'POST',
    })
    .then((response) => response.json())
    .then((data)=>{
        document.getElementById('submit_button').textContent="Submitted!";   
        window.location.href = '/final_quiz.html';
    })
    .catch((error) => {
        console.error("Error:", error);
    });
    
});
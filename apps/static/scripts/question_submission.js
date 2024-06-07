
document.addEventListener("DOMContentLoaded", function () {
    fetch('/set_table',{
        method:'POST',
    })
    .then((response) => response.json())
    .then((data)=>{
        var tableBody = document.getElementById('table-body');
        data.data.forEach(function (row,index) {
            var newRow = tableBody.insertRow(tableBody.rows.length);

            // Create cells for each column
            var questionNoCell = newRow.insertCell(0);
            var questionCell = newRow.insertCell(1);
            var answerCell = newRow.insertCell(2);

            // Populate cells with data
            questionNoCell.innerHTML = index+1;
            questionCell.innerHTML = row.Questions==NaN?"":row.Questions;
            answerCell.innerHTML = row.Answers==NaN?"":row.Answers;
        });
        
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});

document.getElementById("submit_button").addEventListener("click", function () {
    document.getElementById('submit_button').disabled=true;
    document.getElementById('submit_button').textContent="Submitting...";
    fetch('/submit_questions',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: localStorage.getItem("questions"),
    })
    .then((response) => response.json())
    .then((data)=>{
        document.getElementById('submit_button').textContent="Submitted!";   
        window.location.href = '/games_selection.html';
    })
    .catch((error) => {
        console.error("Error:", error);
    });
    
});

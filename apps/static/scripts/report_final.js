document.addEventListener("DOMContentLoaded", function () {
    fetch('/get_final_report',{
        method:'POST',
    })
    .then((response) => response.json())
    .then((data)=>{
        for(let i=0;i<data.careers.length;i++){
            var career=data.careers[i];
            var status="info"
            if(career[1]>50){
                status="success"
            }
            else if(career[1]>30){
                status="warning"
            }
            else {
                status="danger"
            }
            document.getElementById('progresses').innerHTML+=`
                <div class="container mt-5">
                <div class="row">
                <div class="col-md-3">
                    <h4 class="text-center py-2">${career[0]}</h4>
                </div>
                <div class="col-md-1">
                    <h4 class="text-center py-2">${career[1].toFixed(2)}</h4>
                </div>
                <div class="col-md-8">
                    <div class="progress" role="progressbar" example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="height:50px">
                    <div class="progress-bar bg-${status}" style="width: ${career[1]}%"></div>
                    </div>
                </div>
                </div>
            </div>
                `
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});

document.getElementById("print_button").addEventListener("click",function(){
    fetch('/get_all_data',{
        method:'POST',
    })
    .then((response) => response.json())
    .then((data)=>{
        let questionanswertable="";
        let careertable="";
        for(let i=0;i<20;i++){
            questionanswertable+=`<tr>
            <td>${i+1}</td>
            <td>${data.question_answer.Questions[i]}</td>
            <td>${data.question_answer.Answers[i]}</td>
            </tr>`
        }
        for(let i=0;i<3;i++){
            careertable+=`<tr>
            <td>${data.careers[i][0]}</td>
            <td>${data.careers[i][1]}</td>
            </tr>`
        }

        let printer=document.createElement('div');
        printer.innerHTML+=`    
        <div class="watermark">CareerSAGE</div>
        <div class="header">
            <img src="/static/assets/img/logo.png" alt="Logo" width="1020">
        </div>
    
        <div class="page">        
            <div class="title">FINAL REPORT</div>
            <div class="content">

                    <div class="text"><strong>Full Name: </strong>${data.name}</div>
                    <div class="text"><strong>Class: </strong>${data.class}</div>
                    <div class="text"><strong>Marks: </strong>${data.marks}</div>
                    <div class="text"><strong>Interests/Hobbies: </strong>${data.hobbies}</div>

                    <div class="section-title">Estimated Future Predictions</div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Genre</th>
                                <th>Probability</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${careertable}
                        </tbody>
                    </table>


                    <div class="section-title">Questionnaire Session</div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>QNo.</th>
                                <th>Question</th>
                                <th>Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${questionanswertable}
                        </tbody>
                    </table>


                     <div class="text"><strong>Genre Predicted: </strong>${data.genre}</div>
                    <div class="text"><strong>Games Played: </strong>${data.games}</div>
                    <div class="text"><strong>Game Score: </strong>${data.game_score[0]}</div>
                    <div class="text"><strong>Game Percentage: </strong>${data.game_score[2]}</div>
                    <div class="text"><strong>Game Accuracy: </strong>${data.game_score[3]}</div>
                    <div class="text"><strong>Trivia Quiz Score (Final Quiz): </strong>${data.quiz_score}</div>
                    
                    <div class="terms">
                        <div class="section-title">Terms and Conditions</div>
                        <ul>
                            <li>CareerSAGE does not take any responsibility for incorrect genre prediction as the software is in Beta Phase.</li>
                            <li>CareerSAGE guarantees predictions only based on the data provided by the user.</li>
                            <li>Users are advised to validate recommendations independently for accuracy.</li>
                            <li>The software's beta status implies ongoing development and potential errors.</li>
                            <li>Users understand that CareerSAGE does not assure career success; final decisions remain with the user.</li>
                            <li>User discretion is advised; inaccurate input may affect prediction quality.</li>
                            <li>CareerSAGE prioritizes the privacy of user data, ensuring all information is handled securely.</li>
                            <li>CareerSAGE reserves the right to change their terms and conditions for the user’s and company’s benefits.</li>
    
                        </ul>
                    
                        <div class="signature">
                            <div class="text"><strong>Name: </strong>${data.name}</div>
                            <div class="text"><strong>Signature: </strong>____________</div>
                            <div class="text" style="text-align: center;"><strong>VERIFIED BY CAREERSAGE</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        printer.style.fontFamily = 'Arial, sans-serif';
        printer.style.margin = '0';
        printer.style.padding = '0';
        printer.style.width = '210mm';
        printer.style.height = '297mm';
        printer.style.background = '#fff';

        const page = printer.querySelector('.page');
        page.style.width='100%';
        page.style.height='100%';
        page.style.position='relative';
        page.style.padding='10mm';
        page.style.paddingTop='0mm';

        // Apply styles to children elements
        const watermark = printer.querySelector('.watermark');
        watermark.style.position = 'fixed';
        watermark.style.top = '50%';
        watermark.style.left = '50%';
        watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
        watermark.style.fontSize = '160px';
        watermark.style.color = 'rgba(0, 0, 0, 0.1)';

        const header = printer.querySelector('.header');
        header.style.textAlign = 'center';

        const title = printer.querySelector('.title');
        title.style.textAlign = 'center';
        title.style.fontSize = '24px';
        title.style.fontWeight = 'bold';

        const sectionTitles = printer.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            title.style.fontSize = '18px';
            title.style.fontWeight = 'bold';
            title.style.textAlign = 'center';
            title.style.marginBottom = '0px';
        });

        const texts = printer.querySelectorAll('.text');
        texts.forEach(text => {
            text.style.fontSize = '18px';
            text.style.lineHeight = '1.5';
        });

        const terms = printer.querySelector('.terms');
        terms.style.fontSize = '1px';
        terms.style.marginTop = '20px';
        terms.style.background = '#cfe2f3';
        terms.style.padding = '10px';
        terms.style.border = '1px solid #6fa8dc';

        const table = printer.querySelectorAll('.table');
        table.forEach(tbl => {
            tbl.style.width = '100%';
            tbl.style.borderCollapse = 'collapse';
            tbl.style.marginTop = '10px';
        });

        const tableCells = printer.querySelectorAll('.table th, .table td');
        tableCells.forEach(cell => {
            cell.style.border = '1px solid #000';
            cell.style.padding = '2px';
            cell.style.paddingLeft='4px';
            cell.style.textAlign = 'left';
        });
        let temp=document.body.innerHTML;
        document.body.innerHTML="";
        document.body.appendChild(printer);
        setTimeout(()=>{
            window.print();
        },1000);
        
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});
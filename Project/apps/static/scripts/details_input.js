document.getElementById('btn-submit').addEventListener('click', function() {
    fetch('/set_user_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'name': document.getElementById('fullname').value,
            'class': document.getElementById('class').value,
            'marks': document.getElementById('marks').value,
            'hobbies': document.getElementById('hobbies').value,
        })
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data);
        window.location.href = '/guide.html';
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
});
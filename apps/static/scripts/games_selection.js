function createCard(game,index) {
    return `
      <div class="col-3 m-5">
        <div class="card bg-primary text-white rounded" style="width: 300px; height:300px; cursor:pointer" data-index="${index}">
          <img src="static/assets/img/games/${game}.jpg" class="card-img-top img-fluid" style="height: 250px; object-fit: cover;" alt="${game}">
          <div class="card-body text-center">
            <h5 class="card-title m-0 p-0">${game.toUpperCase().replaceAll("_"," ")}</h5>
          </div>
        </div>
      </div>
    `;
  }




document.addEventListener("DOMContentLoaded", function () {
    fetch('/get_game_info',{
          method:'POST',
      })
      .then((response) => response.json())
      .then((data)=>{
        const genre=data.genre
        const games=data.games_list
        document.getElementById("genre").textContent = genre;
        const container = document.getElementById("card-container");
        container.innerHTML = ""; 
        games.forEach((game,index) => {
          const cardHTML = createCard(game,index);
          container.innerHTML += cardHTML;
        })
        container.addEventListener("click", function(event) {
            const card = event.target.closest(".card");
            if (card) {
              const index = card.getAttribute("data-index");
              const selectedGame = games[index];
              window.location.href = `/games/${selectedGame}`;
            }
          })})
      .catch((error) => {
          console.error("Error:", error);
      }) 
});
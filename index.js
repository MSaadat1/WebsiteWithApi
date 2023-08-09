const AppUrl =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=292d28af09f533ab9997061f40cb0cfe";

const imagePath = "https://image.tmdb.org/t/p/w1280/";

const main = document.getElementById("main");
const favorite = document.getElementById("favorite");
const buttonAsc = document.querySelector('button[data-sort="asc"]');
const buttonDesc = document.querySelector('button[data-sort="desc"]');
const sortBtns = document.querySelectorAll(".sortBtn");

getMovies(AppUrl);
const movieData = [];

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  movieData.push(...data.results);
  displayMovies(data.results);
  console.log(data.results);
}

function createMovieElement(movie) {
  const { title, poster_path, vote_average, overview } = movie;
  const movieElement = document.createElement("div");
  movieElement.classList.add("movie");
  movieElement.innerHTML = `
    <img src="${imagePath + poster_path}" alt="${title}" />
    <div class="movie-info">
      <h3>${title}</h3>
      <span class="rating">${vote_average}</span>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>
      <button class="favorite-button">Add</button>
    </div>
  `;

  const voteTotal = movieData.reduce((total, item) => {
    return total + item.vote_average;
  }, 0);

  const sumDisplay = document.getElementById("sumDisplay");
  sumDisplay.textContent = `Total Vote: ${voteTotal.toFixed(2)}`;

  const favoriteButton = movieElement.querySelector(".favorite-button");
  favoriteButton.addEventListener("click", () => toggleFavorite(movieElement));

  return movieElement;
}

function displayMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const movieElement = createMovieElement(movie);
    main.appendChild(movieElement);
  });
}

function toggleFavorite(movieElement) {
  const params =
    movieElement.parentElement === favorite
      ? [removeFromFavorites, main]
      : [addToFavorites, favorite];
  params[0](movieElement);
}

function addToFavorites(movieElement) {
  favorite.appendChild(movieElement);
}

function removeFromFavorites(movieElement) {
  main.appendChild(movieElement);
}

sortBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const target = e.target;
    const containerToSort =
      target.dataset.container === "favorite" ? favorite : main;
    const items = containerToSort.querySelectorAll(".movie");
    const direction = target.dataset.sort;

    const sortedData = Array.from(items).sort((a, b) => {
      const valOne = a.getElementsByTagName("h3")[0].innerText;
      const valTwo = b.getElementsByTagName("h3")[0].innerText;
      if (valOne > valTwo) return direction === "asc" ? 1 : -1;
      else if (valOne < valTwo) return direction === "asc" ? -1 : 1;
      else return 0;
    });

    sortedData.forEach((movie) => {
      containerToSort.append(movie);
    });
  });
});

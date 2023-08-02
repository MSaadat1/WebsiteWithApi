const AppUrl =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=292d28af09f533ab9997061f40cb0cfe";

const imagePath = "https://image.tmdb.org/t/p/w1280/";

const main = document.getElementById("main");
const favorite = document.getElementById("favorite");

getMovies(AppUrl);
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
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
  if (movieElement.parentElement === favorite) {
    removeFromFavorites(movieElement);
    sortMoviesAlphabetically(main);
  } else {
    addToFavorites(movieElement);
    sortMoviesAlphabetically(favorite);
  }
}

function addToFavorites(movieElement) {
  favorite.appendChild(movieElement);
}

function removeFromFavorites(movieElement) {
  main.appendChild(movieElement);
}

function sortMoviesAlphabetically(section) {
  const movies = Array.from(section.children);
  movies.sort((a, b) => {
    const titleA = a.querySelector("h3").innerText.toUpperCase();
    const titleB = b.querySelector("h3").innerText.toUpperCase();
    if (titleA < titleB) return -1;
    if (titleA > titleB) return 1;
    return 0;
  });
  section.innerHTML = "";
  movies.forEach((movie) => section.appendChild(movie));
}


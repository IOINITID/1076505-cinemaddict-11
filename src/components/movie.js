import AbstractComponent from "./abstract-component";
import moment from "moment";

const createMovieTemplate = (movieData) => {
  const {image, title, rating, releaseDate, runtime, description, genres, comments, inWatchlist, watched, favorite} = movieData;
  const movieReleaseDate = moment(releaseDate).format(`YYYY`);
  const movieRuntime = moment(runtime).format(`h[h] mm[m]`);
  const movieGenres = genres.map((genre) => genre).join(`, `);
  const movieDescription = (description.length > 140) ? `${description.slice(0, 140)}...` : description;
  const movieComments = comments.length;
  const movieInWatchlist = inWatchlist ? `film-card__controls-item--active` : ``;
  const movieWatched = watched ? `film-card__controls-item--active` : ``;
  const movieFavorite = favorite ? `film-card__controls-item--active` : ``;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${movieReleaseDate}</span>
            <span class="film-card__duration">${movieRuntime}</span>
            <span class="film-card__genre">${movieGenres}</span>
          </p>
        <img src="./${image}" alt="" class="film-card__poster">
        <p class="film-card__description">${movieDescription}</p>
        <a class="film-card__comments">${movieComments} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${movieInWatchlist}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${movieWatched}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${movieFavorite}">Mark as favorite</button>
        </form>
    </article>`
  );
};

export default class Movie extends AbstractComponent {
  constructor(movieData) {
    super();

    this._movieData = movieData;
  }

  getTemplate() {
    return createMovieTemplate(this._movieData);
  }

  setAddToWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setMarkAsWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setMarkAsFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}

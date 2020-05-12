import AbstractComponent from "./abstract-component";
import moment from "moment";

const createMovieCard = (filmDetails) => {
  const {image, title, rating, releaseDate, runtime, description, genres, comments, inWatchlist, watched, favorite} = filmDetails;
  const filmReleaseDate = moment(releaseDate).format(`YYYY`);
  const filmRuntime = moment(runtime).format(`h[h] mm[m]`);
  const getGenres = () => {
    return genres.map((genre) => genre).join(`, `);
  };

  return (
    `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${filmReleaseDate}</span>
            <span class="film-card__duration">${filmRuntime}</span>
            <span class="film-card__genre">${getGenres()}</span>
          </p>
          <img src="./images/posters/${image}" alt="" class="film-card__poster">
          <p class="film-card__description">${description.length > 140 ? `${description.slice(0, 140)}...` : description}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${inWatchlist ? `film-card__controls-item--active` : ``}">Add to
              watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watched ? `film-card__controls-item--active` : ``}">Mark as
              watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${favorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
          </form>
      </article>`
  );
};

export default class MovieCard extends AbstractComponent {
  constructor(filmDetails) {
    super();

    this._filmDetails = filmDetails;
  }

  getTemplate() {
    return createMovieCard(this._filmDetails);
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

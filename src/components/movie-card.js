import AbstractComponent from "../components/abstract-components";

/**
 * Возвращает разметку блока (Карточка фильма | Movie card).
 * @param {Array} filmDetails массив с объектами, которые содержат данные с описанием дял карточек фильмов.
 * @return {String} возвращает HTML разметку в виде строки.
 */
const createMovieCard = (filmDetails) => {
  const {image, title, rating, releaseDate, runtime, description, genres, comments, state} = filmDetails;
  const {year} = releaseDate;
  const {hours, minutes} = runtime;
  const {inWatchlist, watched, favorite} = state;
  const getGenres = () => {
    return genres.map((genre) => genre).join(`, `);
  };

  return (
    `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${year}</span>
            <span class="film-card__duration">${hours}h ${minutes}m</span>
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

/**
 * Класс (Карточка фильма | Movie card).
 */
export default class MovieCard extends AbstractComponent {
  /**
   * Конструктор, принимающий параметры.
   * @param {Array} filmDetails массив объектов, которые содержат данные с описаниями для картоек фильмов.
   */
  constructor(filmDetails) {
    super();

    this._filmDetails = filmDetails;
  }

  getTemplate() {
    return createMovieCard(this._filmDetails);
  }

  /**
   * Метод, который принимает функцию обработчик события при нажатия на кнопку (Add to watchlist).
   * @param {Function} handler функция обработчик события, которая будет выполнена.
   */
  setAddToWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  /**
   * Метод, который принимает функцию обработчик события при нажатия на кнопку (Mark as watched).
   * @param {Function} handler функция обработчик события, которая будет выполнена.
   */
  setMarkAsWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  /**
   * Метод, который принимает функцию обработчик события при нажатия на кнопку (Mark as favorite).
   * @param {Function} handler функция обработчик события, которая будет выполнена.
   */
  setMarkAsFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}

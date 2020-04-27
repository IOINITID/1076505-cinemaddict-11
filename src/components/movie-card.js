import AbstractComponent from "../components/abstract-components";

// Возвращает разметку блока карточка
const createMovieCard = (filmDetails) => {
  const {image, title, rating, releaseDate, runtime, description, genres, comments} = filmDetails;
  const {year} = releaseDate;
  const {hours, minutes} = runtime;
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
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to
              watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as
              watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
          </form>
      </article>`
  );
};

// Класс карточка фильма
export default class MovieCard extends AbstractComponent {
  constructor(filmDetails) {
    super();

    this._filmDetails = filmDetails;
  }

  getTemplate() {
    return createMovieCard(this._filmDetails);
  }
}

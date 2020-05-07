import AbstractSmartComponent from "../components/abstract-smart-component";
import {MONTH_NAMES} from "../const";

// Возвращает разметку блока подробного описания фильма
const createFilmDetails = (filmDetails) => {
  const {image, age, title, originalTitle, rating, director, writers, actors, releaseDate, runtime, country, genres, description, comments, state} = filmDetails;
  const posterDetails = {image, age};
  const infoDetails = {title, originalTitle, rating, director, writers, actors, releaseDate, runtime, country, genres, description};
  const {inWatchlist, watched, favorite} = state;

  return (
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">

        ${createFilmDetailsPoster(posterDetails)}

        ${createFilmDetailsInfo(infoDetails)}

      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${inWatchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">

      ${createFilmDetailsComments(comments)}

    </div>
  </form>
</section>`);
};

// Возвращает разметку блока с обложкой фильма и рейтингом
const createFilmDetailsPoster = (details) => {
  const {image, age} = details;

  return (
    `<div class="film-details__poster">
    <img class="film-details__poster-img" src="./images/posters/${image}" alt="">

    <p class="film-details__age">${age}</p>
  </div>`
  );
};

// Возвращает разметку блока с информацией о фильме
const createFilmDetailsInfo = (info) => {
  const {title, originalTitle, rating, director, writers, actors, releaseDate, runtime, country, genres, description} = info;
  const {hours, minutes} = runtime;
  const {day, month, year} = releaseDate;
  const getGenres = () => {
    return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`);
  };

  return (
    `<div class="film-details__info">
  <div class="film-details__info-head">
    <div class="film-details__title-wrap">
      <h3 class="film-details__title">${title}</h3>
      <p class="film-details__title-original">Original: ${originalTitle}</p>
    </div>

    <div class="film-details__rating">
      <p class="film-details__total-rating">${rating}</p>
    </div>
  </div>

  <table class="film-details__table">
    <tr class="film-details__row">
      <td class="film-details__term">Director</td>
      <td class="film-details__cell">${director}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Writers</td>
      <td class="film-details__cell">${writers}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Actors</td>
      <td class="film-details__cell">${actors}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Release Date</td>
      <td class="film-details__cell">${day} ${MONTH_NAMES[month]} ${year}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Runtime</td>
      <td class="film-details__cell">${hours}h ${minutes}m</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Country</td>
      <td class="film-details__cell">${country}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
      <td class="film-details__cell">
      ${getGenres()}
    </tr>
  </table>

  <p class="film-details__film-description">
    ${description}
  </p>
</div>`
  );
};

// Возвращает разметку блока с коментариями
const createFilmDetailsComments = (comments) => {
  // Возвращает разметку с комментариями. Не уверен на счет этой записи
  const getComments = () => {
    return comments.map((comment) => {
      const {emoji, text, author, date} = comment;
      const {day, month, year, hours, minutes} = date;

      return (`<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${year}/${month}/${day} ${hours}:${minutes}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`);
    }).join(`\n`);
  };

  return (
    `<section class="film-details__comments-wrap">
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

  <ul class="film-details__comments-list">
    ${getComments()}
  </ul>

  <div class="film-details__new-comment">
    <div for="add-emoji" class="film-details__add-emoji-label"></div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>
</section>`
  );
};

// Класс подробное описание фильма
export default class FilmDetails extends AbstractSmartComponent {
  constructor(filmDetails) {
    super();

    this._filmDetails = filmDetails;
    this._setPopupCloseButtonClick = null;
    this._removePopupCloseButtonClick = null;

    this._subscribeOnEvents();
  }

  recoveryListeners() {
    this.setPopupCloseButtonClick(this._setPopupCloseButtonClick);
    this.removePopupCloseButtonClick(this._removePopupCloseButtonClick);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  getTemplate() {
    return createFilmDetails(this._filmDetails);
  }

  reset() {
    const filmDetails = this._filmDetails;

    this._inWatchlist = !!filmDetails.state.inWatchlist;
    this._watched = !!filmDetails.state._watched;
    this._favorite = !!filmDetails.state._favorite;

    this.rerender();
  }

  setPopupCloseButtonClick(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._setPopupCloseButtonClick = handler;
  }

  removePopupCloseButtonClick(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, handler);
    this._removePopupCloseButtonClick = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, () => {
      this._inWatchlist = !this._inWatchlist;
      this.rerender();
    });

    element.querySelector(`.film-details__control-label--watched`).addEventListener(`click`, () => {
      this._watched = !this._watched;
      this.rerender();
    });

    element.querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, () => {
      this._favorite = !this._favorite;
      this.rerender();
    });
  }
}

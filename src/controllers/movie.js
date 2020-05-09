import MovieCardComponent from "../components/movie-card";
import FilmDetailsComponent from "../components/film-details";
import {render as renderComponent, remove, replace, RenderPosition} from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  OPEN: `open`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._footerElement = document.querySelector(`.footer`);

    this._movieCardComponent = null;
    this._filmDetailsComponent = null;

    this._onPopupCloseButtonClick = this._onPopupCloseButtonClick.bind(this);
    this._onPopupEscButtonKeydown = this._onPopupEscButtonKeydown.bind(this);
  }

  render(filmDetail) {

    const oldFilm = this._movieCardComponent;
    const oldFilmDetails = this._filmDetailsComponent;

    this._movieCardComponent = new MovieCardComponent(filmDetail);

    this._filmDetailsComponent = new FilmDetailsComponent(filmDetail);

    this._movieCardComponent.setAddToWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();

      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        inWatchlist: !filmDetail.state.inWatchlist,
      }));
    });

    this._filmDetailsComponent.setAddToWatchlistButtonClickHandler(() => {
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        inWatchlist: !filmDetail.state.inWatchlist,
      }));
    });

    this._movieCardComponent.setMarkAsWatchedButtonClickHandler((evt) => {
      evt.preventDefault();

      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        watched: !filmDetail.state.watched,
      }));
    });

    this._filmDetailsComponent.setMarkAsWatchedButtonClickHandler(() => {
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        watched: !filmDetail.state.watched,
      }));
    });

    this._movieCardComponent.setMarkAsFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();

      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        favorite: !filmDetail.state.favorite,
      }));
    });

    this._filmDetailsComponent.setMarkAsFavoriteButtonClickHandler(() => {
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        favorite: !filmDetail.state.favorite,
      }));
    });

    if (oldFilm && oldFilmDetails) {
      replace(this._movieCardComponent, oldFilm);
      replace(this._filmDetailsComponent, oldFilmDetails);
    } else {
      renderComponent(this._container, this._movieCardComponent, RenderPosition.BEFOREEND);
    }

    const filmPoster = this._movieCardComponent.getElement().querySelector(`.film-card__poster`);

    const filmTitle = this._movieCardComponent.getElement().querySelector(`.film-card__title`);

    const filmComments = this._movieCardComponent.getElement().querySelector(`.film-card__comments`);

    const filmElements = [filmPoster, filmTitle, filmComments];

    filmElements.forEach((element) => {
      this._renderFilmDetails(element);
    });
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeFilmDetails();
    }
  }

  _renderFilmDetails(element) {
    element.addEventListener(`click`, () => {
      this._onViewChange();

      this._mode = Mode.OPEN;

      renderComponent(this._footerElement, this._filmDetailsComponent, RenderPosition.AFTEREND);

      this._filmDetailsComponent.setPopupCloseButtonClick(this._onPopupCloseButtonClick);

      document.addEventListener(`keydown`, this._onPopupEscButtonKeydown);
    });
  }

  _removeFilmDetails() {
    remove(this._filmDetailsComponent);

    this._filmDetailsComponent.removePopupCloseButtonClick(this._onPopupCloseButtonClick);

    document.removeEventListener(`keydown`, this._onPopupEscButtonKeydown);
  }

  _onPopupCloseButtonClick(evt) {
    evt.preventDefault();

    this._removeFilmDetails();
  }

  _onPopupEscButtonKeydown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      this._removeFilmDetails();
    }
  }
}

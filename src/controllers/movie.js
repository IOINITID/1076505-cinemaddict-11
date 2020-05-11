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
    this._filmDetail = filmDetail;

    const oldFilm = this._movieCardComponent;
    const oldFilmDetails = this._filmDetailsComponent;

    this._movieCardComponent = new MovieCardComponent(this._filmDetail);
    this._filmDetailsComponent = new FilmDetailsComponent(this._filmDetail);

    const onInWatchlistDataChange = (evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._filmDetail, Object.assign({}, this._filmDetail, {
        inWatchlist: !this._filmDetail.inWatchlist,
      }));
    };

    const onWatchedDataChange = (evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._filmDetail, Object.assign({}, this._filmDetail, {
        watched: !this._filmDetail.watched,
      }));
    };

    const onFavoriteDataChange = (evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._filmDetail, Object.assign({}, this._filmDetail, {
        favorite: !this._filmDetail.favorite,
      }));
    };

    this._movieCardComponent.setAddToWatchlistButtonClickHandler(onInWatchlistDataChange);
    this._filmDetailsComponent.setAddToWatchlistButtonClickHandler(onInWatchlistDataChange);

    this._movieCardComponent.setMarkAsWatchedButtonClickHandler(onWatchedDataChange);
    this._filmDetailsComponent.setMarkAsWatchedButtonClickHandler(onWatchedDataChange);

    this._movieCardComponent.setMarkAsFavoriteButtonClickHandler(onFavoriteDataChange);
    this._filmDetailsComponent.setMarkAsFavoriteButtonClickHandler(onFavoriteDataChange);

    this._filmDetailsComponent.setPopupCloseButtonClick(this._onPopupCloseButtonClick);

    if (oldFilm && oldFilmDetails) {
      replace(this._movieCardComponent, oldFilm);
      replace(this._filmDetailsComponent, oldFilmDetails);
    } else {
      renderComponent(this._container, this._movieCardComponent, RenderPosition.BEFOREEND);
    }

    const filmPoster = this._movieCardComponent.getElement().querySelector(`.film-card__poster`);
    const filmTitle = this._movieCardComponent.getElement().querySelector(`.film-card__title`);
    const filmComments = this._movieCardComponent.getElement().querySelector(`.film-card__comments`);

    [filmPoster, filmTitle, filmComments].forEach((element) => {
      element.addEventListener(`click`, () => {
        this._onViewChange();
        this._mode = Mode.OPEN;
        this._filmDetailsComponent.rerender();
        renderComponent(this._footerElement, this._filmDetailsComponent, RenderPosition.AFTEREND);
        document.addEventListener(`keydown`, this._onPopupEscButtonKeydown);
      });
    });
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeFilmDetails();
    }
  }

  _removeFilmDetails() {
    remove(this._filmDetailsComponent);
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

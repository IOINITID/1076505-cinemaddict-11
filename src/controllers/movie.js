import MovieCardComponent from "../components/movie-card";
import FilmDetailsComponent from "../components/film-details";
import {render as renderComponent, remove, RenderPosition} from "../utils/render";

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

    this._renderFilmDescriptionComponent = this._renderFilmDescriptionComponent.bind(this);
    this._removeFilmDetailsComponent = this._removeFilmDetailsComponent.bind(this);
    this._onPopupCloseButtonClick = this._onPopupCloseButtonClick.bind(this);
    this._onPopupEscButtonKeydown = this._onPopupEscButtonKeydown.bind(this);
  }

  render(filmDetail) {
    this._movieCardComponent = new MovieCardComponent(filmDetail);
    this._filmDetailsComponent = new FilmDetailsComponent(filmDetail);

    // Нажатие на кнопку добавить в список просмотра
    this._movieCardComponent.setAddToWatchlistButtonClickHandler(() => {
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        inWatchlist: !filmDetail.state.inWatchlist,
      }));
    });

    // Нажатие на кнопку добавить к просмотренному
    this._movieCardComponent.setMarkAsWatchedButtonClickHandler(() => {
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        watched: !filmDetail.state.watched,
      }));
    });

    // Нажатие на кнопку добавить в избранное
    this._movieCardComponent.setMarkAsFavoriteButtonClickHandler(() => {
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        favorite: !filmDetail.state.favorite,
      }));
    });

    // Нажатие на кнопку добавить в избранное
    this._movieCardComponent.setMarkAsFavoriteButtonClickHandler(() => {
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        favorite: !filmDetail.state.favorite,
      }));
    });

    // Добавление карточки фильма в DOM
    renderComponent(this._container, this._movieCardComponent, RenderPosition.BEFOREEND);

    // Получение елементов для добавления в DOM
    const filmPoster = this._movieCardComponent.getElement().querySelector(`.film-card__poster`);
    const filmTitle = this._movieCardComponent.getElement().querySelector(`.film-card__title`);
    const filmComments = this._movieCardComponent.getElement().querySelector(`.film-card__comments`);

    // Получает список из DOM элементов карточки фильма
    const filmElements = [filmPoster, filmTitle, filmComments];

    // Обработчик нажатия на элементы списка карточки фильма
    filmElements.forEach((element) => {
      this._renderFilmDescriptionComponent(element);
    });
  }

  // Закрывает все попапы
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeFilmDetailsComponent();
      this._mode = Mode.DEFAULT;
    }
  }

  // Отрисовка подробного описания фильма и создание обработчиков
  _renderFilmDescriptionComponent(element) {
    element.addEventListener(`click`, () => {
      renderComponent(this._footerElement, this._filmDetailsComponent, RenderPosition.AFTEREND);
      this._filmDetailsComponent.setPopupCloseButtonClick(this._onPopupCloseButtonClick);
      document.addEventListener(`keydown`, this._onPopupEscButtonKeydown);
      this._onViewChange();
      this._mode = Mode.OPEN;
    });
  }

  // Удаление компонента описание фильма и обработчиков
  _removeFilmDetailsComponent() {
    remove(this._filmDetailsComponent);
    this._filmDetailsComponent.removePopupCloseButtonClick(this._onPopupCloseButtonClick);
    document.removeEventListener(`keydown`, this._onPopupEscButtonKeydown);
  }

  // Обработчик закрытия модального окна на кнопку закрыть
  _onPopupCloseButtonClick(evt) {
    evt.preventDefault();
    this._removeFilmDetailsComponent();
  }

  // Обработчик закрытия модального окна по клавише Esc
  _onPopupEscButtonKeydown(evt) {
    evt.preventDefault();
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._removeFilmDetailsComponent();
    }
  }
}

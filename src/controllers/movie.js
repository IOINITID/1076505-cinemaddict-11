import MovieCardComponent from "../components/movie-card";
import FilmDetailsComponent from "../components/film-details";
import {render as renderComponent, remove, RenderPosition} from "../utils/render";

/**
 * Объявляет список с состояниями карточек фильма.
 */
const Mode = {
  DEFAULT: `default`,
  OPEN: `open`,
};

/**
 * Класс (Контроллер карточки фильма | Movie controller).
 */
export default class MovieController {
  /**
   * Конструктор, принимающий параметры.
   * @param {Element} container элемент, в который будет отрисован компонент.
   * @param {Function} onDataChange функция, которая отрисовывает измененную карточку фильма.
   * @param {Function} onViewChange функция, которая вызывает состояние по умолчанию для карточек фильма, закрывает попапы.
   */
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

  /**
   * Метод, который отрисовывает карточку фильма.
   * @param {Object} filmDetail объект с данными для отрисовки карточки фильма.
   */
  render(filmDetail) {
    /**
     * Объявление экземпляра класса (Карточка фильма | Movie card).
     */
    this._movieCardComponent = new MovieCardComponent(filmDetail);

    /**
     * Объявление экземпляра класса (Подробная карточка фильма | Film details).
     */
    this._filmDetailsComponent = new FilmDetailsComponent(filmDetail);

    /**
     * Нажатие на кнопку (Добавить в список просмотра | Add to watchlist) на компоненте (Карточка фильма | Movie card).
     */
    this._movieCardComponent.setAddToWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();

      /**
       * Вызов метода для отрисовки измененной карточки фильма с новыми данными.
       */
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        inWatchlist: !filmDetail.state.inWatchlist,
      }));
    });

    /**
     * Нажатие на кнопку (Добавить в список просмотра | Add to watchlist) на компоненте (Подробная карточка фильма | Film details).
     */
    this._filmDetailsComponent.setAddToWatchlistButtonClickHandler(() => {
      /**
       * Вызов метода для отрисовки измененной карточки фильма с новыми данными.
       */
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        inWatchlist: !filmDetail.state.inWatchlist,
      }));
    });

    /**
     * Нажатие на кнопку (Добавить к просмотренному | Mark as watched) на компоненте (Карточка фильма | Movie card).
     */
    this._movieCardComponent.setMarkAsWatchedButtonClickHandler((evt) => {
      evt.preventDefault();

      /**
       * Вызов метода для отрисовки измененной карточки фильма с новыми данными.
       */
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        watched: !filmDetail.state.watched,
      }));
    });

    /**
     * Нажатие на кнопку (Добавить к просмотренному | Mark as watched) на компоненте (Подробная карточка фильма | Film details).
     */
    this._filmDetailsComponent.setMarkAsWatchedButtonClickHandler(() => {
      /**
       * Вызов метода для отрисовки измененной карточки фильма с новыми данными.
       */
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        watched: !filmDetail.state.watched,
      }));
    });

    /**
     * Нажатие на кнопку (Добавить в избранное | Mark as favorite) на компоненте (Карточка фильма | Movie card).
     */
    this._movieCardComponent.setMarkAsFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();

      /**
       * Вызов метода для отрисовки измененной карточки фильма с новыми данными.
       */
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        favorite: !filmDetail.state.favorite,
      }));
    });

    /**
     * Нажатие на кнопку (Добавить в избранное | Mark as favorite) на компоненте (Подробная карточка фильма | Film details).
     */
    this._filmDetailsComponent.setMarkAsFavoriteButtonClickHandler(() => {
      /**
       * Вызов метода для отрисовки измененной карточки фильма с новыми данными.
       */
      this._onDataChange(this, filmDetail, Object.assign({}, filmDetail, {
        favorite: !filmDetail.state.favorite,
      }));
    });

    /**
     * Отрисовка блока (Карточка фильма | Movie card) в DOM.
     */
    renderComponent(this._container, this._movieCardComponent, RenderPosition.BEFOREEND);

    /**
     * Объявление элемента (Film card poster) DOM для добавления разметки.
     */
    const filmPoster = this._movieCardComponent.getElement().querySelector(`.film-card__poster`);

    /**
     * Объявление элемента (Film card title) DOM для добавления разметки.
     */
    const filmTitle = this._movieCardComponent.getElement().querySelector(`.film-card__title`);

    /**
     * Объявление элемента (Film card comments) DOM для добавления разметки.
     */
    const filmComments = this._movieCardComponent.getElement().querySelector(`.film-card__comments`);

    /**
     * Объявляет список из DOM элементов карточки фильма.
     */
    const filmElements = [filmPoster, filmTitle, filmComments];

    /**
     * Обработчик нажатия на элементы списка карточки фильма.
     */
    filmElements.forEach((element) => {
      /**
       * Отрисовка блока (Подробная карточка фильма | Film details) в DOM.
       */
      this._renderFilmDetails(element);
    });
  }

  // Закрывает все попапы
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeFilmDetails();
    }
  }

  /**
   * Отрисовка блока (Подробное описание фильма | Film details), создание обработчиков и изменение состояния.
   * @param {Element} element элемент, который будет отрисован в блоке (Подробное описание фильма | Film details).
   */
  _renderFilmDetails(element) {
    element.addEventListener(`click`, () => {
      /**
       * Вызывает состояние карточек фильма по умолчанию, закрывает попапы.
       */
      this._onViewChange();

      /**
       * Меняет состояние карточки фильма.
       */
      this._mode = Mode.OPEN;

      /**
       * Отрисовка блока (Подробное описание фильма | Film details) в DOM.
       */
      renderComponent(this._footerElement, this._filmDetailsComponent, RenderPosition.AFTEREND);

      /**
       * Добавление обработчика события нажатия на кнопку закрыть, для блока (Подробное описание фильма | Film details).
       */
      this._filmDetailsComponent.setPopupCloseButtonClick(this._onPopupCloseButtonClick);

      /**
       * Добавление обработчика события нажатия на кнопку Esc, для всего документа.
       */
      document.addEventListener(`keydown`, this._onPopupEscButtonKeydown);
    });
  }

  /**
   * Удаление компонента (Подробное описание фильма | Film details) и обработчиков.
   */
  _removeFilmDetails() {
    /**
     * Удаляет компонент (Подробное описание фильма | Film details) из DOM.
     */
    remove(this._filmDetailsComponent);

    /**
     * Удаляет обработчик события нажатия на кнопку закрыть, для блока (Подробное описание фильма | Film details).
     */
    this._filmDetailsComponent.removePopupCloseButtonClick(this._onPopupCloseButtonClick);

    /**
     * Удаляет обработчик события нажатия на кнопку Esc, для всего документа.
     */
    document.removeEventListener(`keydown`, this._onPopupEscButtonKeydown);
  }

  /**
   * Обработчик закрытия модального окна на кнопку закрыть.
   * @param {Object} evt объект event для работы с событиями.
   */
  _onPopupCloseButtonClick(evt) {
    evt.preventDefault();

    /**
     * Удаялет компонент (Подробное описание фильма | Film details) из DOM.
     */
    this._removeFilmDetails();
  }

  /**
   *  Обработчик закрытия модального окна по клавише Esc.
   * @param {Object} evt объект event для работы с событиями.
   */
  _onPopupEscButtonKeydown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      /**
       * Удаялет компонент (Подробное описание фильма | Film details) из DOM.
       */
      this._removeFilmDetails();
    }
  }
}

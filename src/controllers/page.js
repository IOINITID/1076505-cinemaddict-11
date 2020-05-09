import MoviesComponent from "../components/movies";
import NoMoviesComponent from "../components/no-movies";
import ShowMoreButtonComponent from "../components/show-more-button";
import MovieTopRated from "../components/movie-top-rated";
import MovieMostCommented from "../components/movie-most-commented";
import SortComponent, {SortType} from "../components/sort";
import {render as renderComponent, remove, RenderPosition} from "../utils/render";
import MovieController from "../controllers/movie";

const MOVIE_CARD_COUNT_ON_START = 5;
const MOVIE_CARD_COUNT_BY_BUTTON = 5;
const MOVIE_CARD_EXTRA_COUNT = 2;

/**
 * Функция, которая отрисовывает карточки фильмов в DOM и созвращает экземпляр класса (Контроллер карточки фильма | Movie controller).
 * @param {Element} filmsListContainer элемент, куда будут добавлены карточки фильмов.
 * @param {Array} filmDetails массив объектов, в которых содержатся данные фильмов.
 * @param {Function} onDataChange функция, которая отрисовывает измененную карточку фильма.
 * @param {Function} onViewChange функция, которая вызывает состояние по умолчанию для карточек фильма, закрывает попапы.
 * @return {Object} экземпляр класса (Контроллер карточки фильма | Movie controller).
 */
const renderFilms = (filmsListContainer, filmDetails, onDataChange, onViewChange) => {
  return filmDetails.map((card) => {
    const movieController = new MovieController(filmsListContainer, onDataChange, onViewChange);

    movieController.render(card);

    return movieController;
  });
};

/**
 * Функция, которая возвращает массив отсортированных данных фильмов по условию.
 * @param {Array} filmDetails массив с объектами, которые содержат данные фильмов.
 * @param {String} sortType строка, которая указывает тип сортировки.
 * @param {Number} from индекс, с которого будет возвращен массив с отсортированными данными.
 * @param {Number} to индекс, до которого бдует возвращен массив с отсортированными данными.
 * @return {Array} массив, с отсортированными данными.
 */
const getSortedFilms = (filmDetails, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = filmDetails.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.releaseDate.year - a.releaseDate.year);
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

// Класс контроллер страницы
export default class PageController {
  /**
   * Конструктор, принимающий параметры.
   * @param {Element} container элемент DOM, в который он будет добавлен.
   */
  constructor(container) {
    this._container = container;

    this._filmDetais = [];
    this._showedFilmControllers = [];
    this._showingMovieCardCount = MOVIE_CARD_COUNT_ON_START;

    this._noMoviesComponent = new NoMoviesComponent();
    this._moviesComponent = new MoviesComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._movieTopRated = new MovieTopRated();
    this._movieMostCommented = new MovieMostCommented();
    this._sortComponent = new SortComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  /**
   * Метод, который отрисовывает карточки фильмов на странице.
   * @param {Array} filmDetails массив объектов с данными, в которых описание фильмов.
   */
  render(filmDetails) {
    this._filmDetais = filmDetails;

    /**
     * Отрисовка блока (Сортировка | Sort) в DOM.
     */
    renderComponent(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    /**
     * Объявление наличия фильмов.
     */
    const isFilmDetails = !!this._filmDetais.length;

    /**
     * Отрисовка блока (Нет фильмов | No movies) в DOM.
     */
    if (!isFilmDetails) {
      renderComponent(this._container, this._noMoviesComponent, RenderPosition.BEFOREEND);
      return;
    }

    /**
     * Отрисовка блока (Карточка фильма | Movie card) в DOM.
     */
    renderComponent(this._container, this._moviesComponent, RenderPosition.BEFOREEND);

    /**
    * Объявление элемента (Films) DOM для добавления разметки.
    */
    const filmsElement = this._container.querySelector(`.films`);

    /**
    * Объявление элемента (Films list) DOM для добавления разметки.
    */
    const filmsListElement = filmsElement.querySelector(`.films-list`);

    /**
    * Объявление элемента (Films list container) DOM для добавления разметки.
    */
    const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

    /**
     * Объявление массива с экземплярами классов (Контроллер карточки фильма | Movie controller) и отрисовка карточек фильмов в DOM.
     */
    const newFilms = renderFilms(filmsListContainer, this._filmDetais.slice(0, this._showingMovieCardCount), this._onDataChange, this._onViewChange);

    /**
     * Объявление списка с экземплярами класса (Контроллер карточки фильма | Movie controller), добавление элементов в (Наблюдателя | Observer).
     */
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    /**
     * Отрисовка кнопки (Показать еще | Show more) в DOM.
     */
    this._renderShowMoreButton();

    /**
     * Отрисовка блока (Фильмы с высоким рейтингом | Movie top rated) в DOM.
     */
    renderComponent(filmsElement, this._movieTopRated, RenderPosition.BEFOREEND);

    /**
     * Отрисовка блока (Фильмы со множеством комментариев | Movie most commented) в DOM.
     */
    renderComponent(filmsElement, this._movieMostCommented, RenderPosition.BEFOREEND);

    /**
    * Объявление элемента (Films list extra) DOM для добавления разметки.
    */
    const filmsExtraElement = filmsElement.querySelectorAll(`.films-list--extra`);

    /**
    * Объявление первого элемента (Films list container) DOM для добавления разметки.
    */
    const filmsListTopRatedContainer = filmsExtraElement[0].querySelector(`.films-list__container`);

    /**
    * Объявление второго элемента (Films list container) DOM для добавления разметки.
    */
    const filmsListMostCommentedContainer = filmsExtraElement[1].querySelector(`.films-list__container`);

    /**
     * Отрисовка блока (Фильмы с высоким рейтингом | Movie top rated) в DOM.
     */
    renderFilms(filmsListTopRatedContainer, filmDetails.slice(0, MOVIE_CARD_EXTRA_COUNT));

    /**
     * Отрисовка блока (Фильмы со множеством комментариев | Movie most commented) в DOM.
     */
    renderFilms(filmsListMostCommentedContainer, filmDetails.slice(0, MOVIE_CARD_EXTRA_COUNT));
  }

  /**
   * Метод, который отрисовывает кнопку (Загрузить еще | Show more) и содержит логику ее работы.
   */
  _renderShowMoreButton() {
    if (this._showingMovieCardCount >= this._filmDetais.length) {
      return;
    }

    /**
    * Объявление элемента (Films) DOM для добавления разметки.
    */
    const filmsElement = this._container.querySelector(`.films`);

    /**
    * Объявление элемента (Films list) DOM для добавления разметки.
    */
    const filmsListElement = filmsElement.querySelector(`.films-list`);

    /**
    * Объявление элемента (Films list container) DOM для добавления разметки.
    */
    const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

    /**
     * Отрисовывает блок с кнопкой (Загрузить еще | Show more) в DOM.
     */
    renderComponent(filmsListElement, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    /**
     * Обработчик нажатия на кнопку (Загрузить еще | Show more).
     */
    this._showMoreButtonComponent.setClickHandler(() => {
      /**
       * Объявляет текущее количество карточек фильмов.
       */
      const prevMovieCardCount = this._showingMovieCardCount;

      /**
       * Объявляет увеличение значения показываемых карточек фильма.
       */
      this._showingMovieCardCount = this._showingMovieCardCount + MOVIE_CARD_COUNT_BY_BUTTON;

      /**
       * Объявляет список с отсортированными данными карточек фильмов.
       */
      const sortedFilms = getSortedFilms(this._filmDetais, this._sortComponent.getSortType(), prevMovieCardCount, this._showingMovieCardCount);

      /**
       * Объявление массива с экземплярами классов (Контроллер карточки фильма | Movie controller) и отрисовка карточек фильмов в DOM.
       */
      const newFilms = renderFilms(filmsListContainer, sortedFilms, this._onDataChange, this._onViewChange);

      /**
       * Объявление списка с экземплярами класса (Контроллер карточки фильма | Movie controller), добавление элементов в (Наблюдателя | Observer).
       */
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingMovieCardCount >= this._filmDetais.length) {
        /**
         * Удаление компонента кнопки (Загрузить еще | Show more) из DOM.
         */
        remove(this._showMoreButtonComponent);
      }
    });
  }

  /**
   * Метод, который отрисовывает измененную карточку фильма.
   * @param {Object} movieController экземпляр класса (Контроллер карточки | Movie controller).
   * @param {Object} oldData объект со старыми данными карточки фильма.
   * @param {Object} newData объект с новыми данными карточки фильма.
   */
  _onDataChange(movieController, oldData, newData) {
    const index = this._filmDetais.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._filmDetais = [].concat(this._filmDetais.slice(0, index), newData, this._filmDetais.slice(index + 1));

    movieController.render(this._filmDetais[index]);
  }

  /**
   * Метод, который вызывает состояние карточки фильма по умолчанию, закрывает все попапы.
   */
  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  /**
   * Метод, который отрисовывет карточки фильмов при изменении сортировки.
   * @param {String} sortType строка, содержащая тип сортировки.
   */
  _onSortTypeChange(sortType) {
    /**
     * Объявление начального количества карточек фильмов для отрисовки.
     */
    this._showingMovieCardCount = MOVIE_CARD_COUNT_ON_START;

    /**
     * Объявление списка с отсортированными данными карточек фильмов.
     */
    const sortedFilms = getSortedFilms(this._filmDetais, sortType, 0, this._showingMovieCardCount);

    /**
    * Объявление элемента (Films) DOM для добавления разметки.
    */
    const filmsElement = this._container.querySelector(`.films`);

    /**
    * Объявление элемента (Films list) DOM для добавления разметки.
    */
    const filmsListElement = filmsElement.querySelector(`.films-list`);

    /**
    * Объявление элемента (Films list container) DOM для добавления разметки.
    */
    const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

    /**
     * Очищение контейнера для добавления элементов в DOM.
     */
    filmsListContainer.innerHTML = ``;

    /**
     * Объявление массива с экземплярами классов (Контроллер карточки фильма | Movie controller) и отрисовка карточек фильмов в DOM.
     */
    const newFilms = renderFilms(filmsListContainer, sortedFilms, this._onDataChange, this._onViewChange);

    /**
     * Объявление списка с экземплярами класса (Контроллер карточки фильма | Movie controller), добавление элементов в (Наблюдателя | Observer).
     */
    this._showedFilmControllers = newFilms;

    if (!this._showMoreButtonComponent) {
      /**
       * Отрисовка кнопки (Показать еще | Show more) в DOM.
       */
      this._renderShowMoreButton();
    }
  }

}

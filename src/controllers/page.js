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

// Отрисовывает фильмы
const renderFilms = (filmsListContainer, films) => {
  return films.map((card) => {
    const movieController = new MovieController(filmsListContainer);

    movieController.render(card);

    return movieController;
  });
};

// Сортирует фильмы по условию
const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

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
  constructor(container) {
    this._container = container;

    this._films = [];
    this._showedFilmControllers = [];
    this._showingMovieCardCount = MOVIE_CARD_COUNT_ON_START;

    this._noMoviesComponent = new NoMoviesComponent();
    this._moviesComponent = new MoviesComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._movieTopRated = new MovieTopRated();
    this._movieMostCommented = new MovieMostCommented();
    this._sortComponent = new SortComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(films) {
    this._films = films;

    // Добавление блока сортировки в DOM
    renderComponent(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    // Наличие фильмов
    const isFilmDetails = !!this._films.length;

    // Проверка на наличие фильмов и отрисовка компонента нет фильмов
    if (!isFilmDetails) {
      renderComponent(this._container, this._noMoviesComponent, RenderPosition.BEFOREEND);
      return;
    }

    // Добавление блока карточка в DOM
    renderComponent(this._container, this._moviesComponent, RenderPosition.BEFOREEND);

    // Объявление контейнеров для добавления разметки
    const filmsElement = this._container.querySelector(`.films`);
    const filmsListElement = filmsElement.querySelector(`.films-list`);
    const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

    // Добавление карточек в DOM
    const newFilms = renderFilms(filmsListContainer, this._films.slice(0, this._showingMovieCardCount));
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    // Добавление кнопки показать еще в DOM
    this._renderShowMoreButton();

    // Добавление шаблона с дополнительными фильмами в DOM
    renderComponent(filmsElement, this._movieTopRated, RenderPosition.BEFOREEND);

    // Добавление шаблона с дополнительными фильмами в DOM
    renderComponent(filmsElement, this._movieMostCommented, RenderPosition.BEFOREEND);

    // Объявление контейнеров для добавление разметки
    const filmsExtraElement = filmsElement.querySelectorAll(`.films-list--extra`);
    const filmsListTopRatedContainer = filmsExtraElement[0].querySelector(`.films-list__container`);
    const filmsListMostCommentedContainer = filmsExtraElement[1].querySelector(`.films-list__container`);

    // Добавление карточек с высоким рейтингом в DOM
    renderFilms(filmsListTopRatedContainer, films.slice(0, MOVIE_CARD_EXTRA_COUNT));


    // Добавление карточек с большим количеством комментарив в DOM
    renderFilms(filmsListMostCommentedContainer, films.slice(0, MOVIE_CARD_EXTRA_COUNT));
  }

  _renderShowMoreButton() {
    if (this._showingMovieCardCount >= this._films.length) {
      return;
    }

    // Объявление контейнеров для добавления разметки
    const filmsElement = this._container.querySelector(`.films`);
    const filmsListElement = filmsElement.querySelector(`.films-list`);
    const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

    renderComponent(filmsListElement, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevMovieCardCount = this._showingMovieCardCount;
      this._showingMovieCardCount = this._showingMovieCardCount + MOVIE_CARD_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._films, this._sortComponent.getSortType(), prevMovieCardCount, this._showingMovieCardCount);
      const newFilms = renderFilms(filmsListContainer, sortedFilms);

      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingMovieCardCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    this._showingMovieCardCount = MOVIE_CARD_COUNT_BY_BUTTON;

    const sortedFilms = getSortedFilms(this._films, sortType, 0, this._showingMovieCardCount);

    // Объявление контейнеров для добавления разметки
    const filmsElement = this._container.querySelector(`.films`);
    const filmsListElement = filmsElement.querySelector(`.films-list`);
    const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

    filmsListContainer.innerHTML = ``;

    const newFilms = renderFilms(filmsListContainer, sortedFilms);
    this._showedFilmControllers = newFilms;

    if (!this._showMoreButtonComponent) {
      this._renderShowMoreButton();
    }
  }

}

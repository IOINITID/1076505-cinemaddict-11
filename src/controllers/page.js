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

// // Отрисовывает карточку с фильмом
// const renderMovieCard = (container, filmDetail) => {

//   const movieCardComponent = new MovieCardComponent(filmDetail);
//   const filmDetailsComponent = new FilmDetailsComponent(filmDetail);

//   // Добавление карточки фильма в DOM
//   renderComponent(container, movieCardComponent, RenderPosition.BEFOREEND);

//   // Получение елементов для добавления в DOM
//   const footerElement = document.querySelector(`.footer`);
//   const filmPoster = movieCardComponent.getElement().querySelector(`.film-card__poster`);
//   const filmTitle = movieCardComponent.getElement().querySelector(`.film-card__title`);
//   const filmComments = movieCardComponent.getElement().querySelector(`.film-card__comments`);

//   // Получает список из DOM элементов карточки фильма
//   const filmElements = [filmPoster, filmTitle, filmComments];

//   // Отрисовка подробного описания фильма и создание обработчиков
//   const renderFilmDescriptionComponent = (element) => {
//     element.addEventListener(`click`, () => {
//       renderComponent(footerElement, filmDetailsComponent, RenderPosition.AFTEREND);
//       filmDetailsComponent.setPopupCloseButtonClick(onPopupCloseButtonClick);
//       document.addEventListener(`keydown`, onPopupEscButtonKeydown);
//     });
//   };

//   // Обработчик нажатия на элементы списка карточки фильма
//   filmElements.forEach((element) => {
//     renderFilmDescriptionComponent(element);
//   });

//   // Удаление компонента описание фильма и обработчиков
//   const removeFilmDetailsComponent = () => {
//     remove(filmDetailsComponent);
//     filmDetailsComponent.removePopupCloseButtonClick(onPopupCloseButtonClick);
//     document.removeEventListener(`keydown`, onPopupEscButtonKeydown);
//   };

//   // Обработчик закрытия модального окна на кнопку закрыть
//   const onPopupCloseButtonClick = (evt) => {
//     evt.preventDefault();
//     removeFilmDetailsComponent();
//   };

//   // Обработчик закрытия модального окна по клавише Esc
//   const onPopupEscButtonKeydown = (evt) => {
//     evt.preventDefault();
//     if (evt.key === `Escape` || evt.key === `Esc`) {
//       removeFilmDetailsComponent();
//     }
//   };
// };

const renderFilms = (filmsListContainer, films) => {
  films.forEach((card) => {
    // renderMovieCard(filmsListContainer, card);
    const movieController = new MovieController(filmsListContainer);
    movieController.render(card);
  });
};


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
    renderFilms(filmsListContainer, films.slice(0, this._showingMovieCardCount));

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

      renderFilms(filmsListContainer, sortedFilms.slice(0, this._showingMovieCardCount));

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

    renderFilms(filmsListContainer, sortedFilms);

    if (!this._showMoreButtonComponent) {
      this._renderShowMoreButton();
    }
  }

}

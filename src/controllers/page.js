import MoviesComponent from "../components/movies";
import NoMoviesComponent from "../components/no-movies";
import MovieCardComponent from "../components/movie-card";
import ShowMoreButtonComponent from "../components/show-more-button";
import MovieTopRated from "../components/movie-top-rated";
import MovieMostCommented from "../components/movie-most-commented";
import FilmDetailsComponent from "../components/film-details";
import {render as renderComponent, remove, RenderPosition} from "../utils/render";

const MOVIE_CARD_COUNT_ON_START = 5;
const MOVIE_CARD_COUNT_BY_BUTTON = 5;
const MOVIE_CARD_EXTRA_COUNT = 2;

// Отрисовывает карточку с фильмом
const renderMovieCard = (container, filmDetail) => {

  const movieCardComponent = new MovieCardComponent(filmDetail);
  const filmDetailsComponent = new FilmDetailsComponent(filmDetail);

  // Добавление карточки фильма в DOM
  renderComponent(container, movieCardComponent, RenderPosition.BEFOREEND);

  // Получение елементов для добавления в DOM
  const footerElement = document.querySelector(`.footer`);
  const filmPoster = movieCardComponent.getElement().querySelector(`.film-card__poster`);
  const filmTitle = movieCardComponent.getElement().querySelector(`.film-card__title`);
  const filmComments = movieCardComponent.getElement().querySelector(`.film-card__comments`);

  // Получает список из DOM элементов карточки фильма
  const filmElements = [filmPoster, filmTitle, filmComments];

  // Обработчик нажатия на элементы списка карточки фильма
  filmElements.forEach((element) => {
    element.addEventListener(`click`, () => {
      renderComponent(footerElement, filmDetailsComponent, RenderPosition.AFTEREND);
      filmDetailsComponent.setPopupCloseButtonClick(onPopupCloseButtonClick);
      document.addEventListener(`keydown`, onPopupEscButtonKeydown);
    });
  });

  // Удаление компонента описание фильма и обработчиков
  const removeFilmDetailsComponent = () => {
    remove(filmDetailsComponent, true);
    filmDetailsComponent.removePopupCloseButtonClick(onPopupCloseButtonClick);
    document.removeEventListener(`keydown`, onPopupEscButtonKeydown);
  };

  // Обработчик закрытия модального окна на кнопку закрыть
  const onPopupCloseButtonClick = (evt) => {
    evt.preventDefault();
    removeFilmDetailsComponent();
  };

  // Обработчик закрытия модального окна по клавише Esc
  const onPopupEscButtonKeydown = (evt) => {
    evt.preventDefault();
    if (evt.key === `Escape` || evt.key === `Esc`) {
      removeFilmDetailsComponent();
    }
  };
};

// Класс контроллер страницы
export default class PageController {
  constructor(container) {
    this._container = container;

    this._noMoviesComponent = new NoMoviesComponent();
    this._moviesComponent = new MoviesComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._movieTopRated = new MovieTopRated();
    this._movieMostCommented = new MovieMostCommented();
  }

  render(films) {
    // Наличие фильмов
    const isFilmDetails = !!films.length;

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

    // Показывает количество карточек в начале
    let showingMovieCardCount = MOVIE_CARD_COUNT_ON_START;

    // Добавление карточек в DOM
    films.slice(0, showingMovieCardCount).forEach((card) => {
      renderMovieCard(filmsListContainer, card);
    });

    // Добавление кнопки показать еще в DOM
    renderComponent(filmsListElement, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    // Обработчик события нажатия на кнопку загрузить еще
    this._showMoreButtonComponent.setClickHandler(() => {
      // Получает количество карточек отображаемых изначально
      const prevMovieCardCount = showingMovieCardCount;

      // Увеличение счетчика отображаемых карточек
      showingMovieCardCount = showingMovieCardCount + MOVIE_CARD_COUNT_BY_BUTTON;

      // Добавление новых карточек
      films.slice(prevMovieCardCount, showingMovieCardCount).forEach((card) => {
        renderMovieCard(filmsListContainer, card);
      });

      // Удаление кнопки загрузить еще по условию
      if (showingMovieCardCount >= films.length) {
        remove(this._showMoreButtonComponent, true);
      }
    });

    // Добавление шаблона с дополнительными фильмами в DOM
    renderComponent(filmsElement, this._movieTopRated, RenderPosition.BEFOREEND);

    // Добавление шаблона с дополнительными фильмами в DOM
    renderComponent(filmsElement, this._movieMostCommented, RenderPosition.BEFOREEND);

    // Объявление контейнеров для добавление разметки
    const filmsExtraElement = filmsElement.querySelectorAll(`.films-list--extra`);
    const filmsListTopRatedContainer = filmsExtraElement[0].querySelector(`.films-list__container`);
    const filmsListMostCommentedContainer = filmsExtraElement[1].querySelector(`.films-list__container`);

    // Добавление карточек с высоким рейтингом в DOM
    films.slice(0, MOVIE_CARD_EXTRA_COUNT).forEach((card) => {
      renderMovieCard(filmsListTopRatedContainer, card);
    });

    // Добавление карточек с большим количеством комментарив в DOM
    films.slice(0, MOVIE_CARD_EXTRA_COUNT).forEach((card) => {
      renderMovieCard(filmsListMostCommentedContainer, card);
    });
  }
}

import UserRankComponent from "./components/user-rank";
import SiteMenuComponent from "./components/site-menu";
import SortComponent from "./components/sort";
import MoviesComponent from "./components/movies";
import MovieCardComponent from "./components/movie-card";
import ShowMoreButtonComponent from "./components/show-more-button";
import MovieTopRated from "./components/movie-top-rated";
import MovieMostCommented from "./components/movie-most-commented";
import SiteFooterStatiscticsComponent from "./components/site-footer-statistics";
import FilmDetailsComponent from "./components/film-details";
import {generateFilmsDetails} from "./mock/film-details";
import {render, RenderPosition} from "./utils";

const MOVIE_CARD_MAX_COUNT = 20;
const MOVIE_CARD_COUNT_ON_START = 5;
const MOVIE_CARD_COUNT_BY_BUTTON = 5;
const MOVIE_CARD_EXTRA_COUNT = 2;

// Объявление контейнеров для добавление разметки
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const filmDetails = generateFilmsDetails(MOVIE_CARD_MAX_COUNT);

// Добавление блока звание пользователя в DOM
render(siteHeaderElement, new UserRankComponent().getElement(), RenderPosition.BEFOREEND);

// Добавление блока меню в DOM
render(siteMainElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);

// Добавление блока сортировки в DOM
render(siteMainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

// Добавление блока карточка в DOM
render(siteMainElement, new MoviesComponent().getElement(), RenderPosition.BEFOREEND);

// Объявление контейнеров для добавление разметки
const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

// Показывает количество карточек в начале
let showingMovieCardCount = MOVIE_CARD_COUNT_ON_START;

// Добавление карточек в DOM
filmDetails.slice(0, showingMovieCardCount).forEach((card) => {
  render(filmsListContainer, new MovieCardComponent(card).getElement(), RenderPosition.BEFOREEND);
});

// Поучает кнопку загрузить еще
const showMoreButtonComponent = new ShowMoreButtonComponent();

// Добавление кнопки показать еще в DOM
render(filmsListElement, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

// filmsElement.querySelector(`.films-list__show-more`);

// Обработчик события нажатия на кнопку загрузить еще
showMoreButtonComponent.getElement().addEventListener(`click`, () => {
  // Получает количество карточек отображаемых изначально
  const prevMovieCardCount = showingMovieCardCount;

  // Увеличение счетчика отображаемых карточек
  showingMovieCardCount = showingMovieCardCount + MOVIE_CARD_COUNT_BY_BUTTON;

  // Добавление новых карточек
  filmDetails.slice(prevMovieCardCount, showingMovieCardCount).forEach((card) => {
    render(filmsListContainer, new MovieCardComponent(card).getElement(), RenderPosition.BEFOREEND);
  });

  // Удаление кнопки загрузить еще по условию
  if (showingMovieCardCount >= filmDetails.length) {
    showMoreButtonComponent.getElement().remove();
    showMoreButtonComponent.removeElement();
  }
});

// Добавление шаблона с дополнительными фильмами в DOM
render(filmsElement, new MovieTopRated().getElement(), RenderPosition.BEFOREEND);

// Добавление шаблона с дополнительными фильмами в DOM
render(filmsElement, new MovieMostCommented().getElement(), RenderPosition.BEFOREEND);

// Объявление контейнеров для добавление разметки
const filmsExtraElement = filmsElement.querySelectorAll(`.films-list--extra`);
const filmsListTopRatedContainer = filmsExtraElement[0].querySelector(`.films-list__container`);
const filmsListMostCommentedContainer = filmsExtraElement[1].querySelector(`.films-list__container`);

// Добавление карточек с высоким рейтингом в DOM
filmDetails.slice(0, MOVIE_CARD_EXTRA_COUNT).forEach((card) => {
  render(filmsListTopRatedContainer, new MovieCardComponent(card).getElement(), RenderPosition.BEFOREEND);
});

// Добавление карточек с большим количеством комментарив в DOM
filmDetails.slice(0, MOVIE_CARD_EXTRA_COUNT).forEach((card) => {
  render(filmsListMostCommentedContainer, new MovieCardComponent(card).getElement(), RenderPosition.BEFOREEND);
});

// Объявление контейнеров для добавление разметки
const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);

// Добавление блока статистика в DOM
render(footerStatisticsElement, new SiteFooterStatiscticsComponent(filmDetails.length).getElement(), RenderPosition.BEFOREEND);

// Добавление блока с описанием фильма в DOM
render(footerElement, new FilmDetailsComponent(filmDetails[0]).getElement(), RenderPosition.AFTEREND);

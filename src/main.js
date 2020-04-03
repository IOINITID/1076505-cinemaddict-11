import {createUserRank} from "./components/user-rank";
import {createSiteMenu} from "./components/site-menu";
import {createSortList} from "./components/sort";
import {createMovieTemplate} from "./components/movie";
import {createMovieCard} from "./components/movie-card";
import {createShowMoreButton} from "./components/show-more-button";
import {createMovieExtraTemplate} from "./components/movie-extra";
import {createSiteFooterStatisctics} from "./components/site-footer-statistics";
import {createFilmDetails} from "./components/film-details";

const MOVIE_CARD_COUNT = 5;
const MOVIE_CARD_EXTRA_COUNT = 2;

// Добавляет разметку в DOM дерево
const render = (container, template, place = `beforeend`) => {
  return container.insertAdjacentHTML(place, template);
};

// Объявление контейнеров для добавление разметки
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

// Добавление блока звание пользователя в DOM
render(siteHeaderElement, createUserRank());

// Добавление блока меню в DOM
render(siteMainElement, createSiteMenu());

// Добавление блока сортировки в DOM
render(siteMainElement, createSortList());

// Добавление блока карточка в DOM
render(siteMainElement, createMovieTemplate());

// Объявление контейнеров для добавление разметки
const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

// Добавление карточек в DOM
for (let i = 0; i < MOVIE_CARD_COUNT; i++) {
  render(filmsListContainer, createMovieCard());
}

// Добавление кнопки показать еще в DOM
render(filmsListElement, createShowMoreButton());

// Добавление шаблона с дополнительными фильмами в DOM
render(filmsElement, createMovieExtraTemplate());

// Объявление контейнеров для добавление разметки
const filmsExtraElement = filmsElement.querySelectorAll(`.films-list--extra`);
const filmsListTopRatedContainer = filmsExtraElement[0].querySelector(`.films-list__container`);
const filmsListMostCommentedContainer = filmsExtraElement[1].querySelector(`.films-list__container`);

// Добавление карточек с высоким рейтингом в DOM
for (let i = 0; i < MOVIE_CARD_EXTRA_COUNT; i++) {
  render(filmsListTopRatedContainer, createMovieCard());
}

// Добавление карточек с большим количеством комментарив в DOM
for (let i = 0; i < MOVIE_CARD_EXTRA_COUNT; i++) {
  render(filmsListMostCommentedContainer, createMovieCard());
}

// Объявление контейнеров для добавление разметки
const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);

// Добавление блока статистика в DOM
render(footerStatisticsElement, createSiteFooterStatisctics());

// Добавление блока с описанием фильма в DOM
render(footerElement, createFilmDetails(), `afterend`);

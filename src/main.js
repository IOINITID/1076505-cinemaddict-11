import UserRankComponent from "./components/user-rank";
import SiteMenuComponent from "./components/site-menu";
// import SortComponent from "./components/sort";
import PageController from "./controllers/page";
import SiteFooterStatiscticsComponent from "./components/site-footer-statistics";
import {generateFilmsDetails} from "./mock/film-details";
import {render, RenderPosition} from "./utils/render";

const MOVIE_CARD_MAX_COUNT = 20;

// Объявление контейнеров для добавление разметки
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

// Создание моков с описанием фильмов
const filmDetails = generateFilmsDetails(MOVIE_CARD_MAX_COUNT);

// Добавление блока звание пользователя в DOM
render(siteHeaderElement, new UserRankComponent(), RenderPosition.BEFOREEND);

// Добавление блока меню в DOM
render(siteMainElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);

// // Добавление блока сортировки в DOM
// render(siteMainElement, new SortComponent(), RenderPosition.BEFOREEND);

// Объявление контейнеров для добавление разметки
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

// Добавление блока статистика в DOM
render(footerStatisticsElement, new SiteFooterStatiscticsComponent(filmDetails.length), RenderPosition.BEFOREEND);

// Получает экземпляр класса контроллер страницы
const pageController = new PageController(siteMainElement);

// Добавляет карточки фильмов в DOM
pageController.render(filmDetails);

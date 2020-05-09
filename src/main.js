import UserRankComponent from "./components/user-rank";
import SiteMenuComponent from "./components/site-menu";
import SiteFooterStatiscticsComponent from "./components/site-footer-statistics";
import PageController from "./controllers/page";
import {generateFilmsDetails} from "./mock/film-details";
import {render, RenderPosition} from "./utils/render";

/**
 * Объявление количества карточек с фильмами.
 */
const MOVIE_CARD_MAX_COUNT = 20;

/**
 * Объявление элемента (Header) DOM для добавления разметки.
 */
const siteHeaderElement = document.querySelector(`.header`);

/**
 * Объявление элемента (Main) DOM для добавления разметки.
 */
const siteMainElement = document.querySelector(`.main`);

/**
 * Объявление данных с описанием фильмов.
 */
const filmDetails = generateFilmsDetails(MOVIE_CARD_MAX_COUNT);

/**
 * Отрисовка блока (Звание пользователя | User rank) в DOM.
 */
render(siteHeaderElement, new UserRankComponent(), RenderPosition.BEFOREEND);

/**
 * Отрисовка блока (Меню | Site menu) в DOM.
 */
render(siteMainElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);

/**
 * Объявление элемента (Footer statistics) DOM для добавления разметки.
 */
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

/**
 * Отрисовка блока (Cтатистика | Site footer statistics) в DOM.
 */
render(footerStatisticsElement, new SiteFooterStatiscticsComponent(filmDetails.length), RenderPosition.BEFOREEND);

/**
 * Объявление экземпляра класса (Контроллер страницы | Page controller).
 */
const pageController = new PageController(siteMainElement);

/**
 * Отрисовка карточек фильмов в DOM.
 */
pageController.render(filmDetails);

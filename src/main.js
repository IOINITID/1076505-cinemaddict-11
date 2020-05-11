import UserRankComponent from "./components/user-rank";
import SiteMenuComponent from "./components/site-menu";
import SiteFooterStatiscticsComponent from "./components/site-footer-statistics";
import PageController from "./controllers/page";
import {generateFilmsDetails} from "./mock/film-details";
import {render, RenderPosition} from "./utils/render";

const MOVIE_CARD_MAX_COUNT = 20;

const siteHeaderElement = document.querySelector(`.header`);

const siteMainElement = document.querySelector(`.main`);

const filmDetails = generateFilmsDetails(MOVIE_CARD_MAX_COUNT);

render(siteHeaderElement, new UserRankComponent(), RenderPosition.BEFOREEND);

render(siteMainElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);

const footerStatisticsElement = document.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new SiteFooterStatiscticsComponent(filmDetails.length), RenderPosition.BEFOREEND);

const pageController = new PageController(siteMainElement);

pageController.render(filmDetails);

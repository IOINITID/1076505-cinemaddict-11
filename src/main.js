import RatingComponent from "./components/rating";
import FilterComponent from "./components/filter";
import StatisticsComponent from "./components/statistics";
import PageController from "./controllers/page";
import MoviesModel from "./models/movies";
import {generateMoviesData} from "./mocks/movies-data";
import {render, RenderPosition} from "./utils/render";

const MOVIES_MAX_QUANTITY = 20;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const moviesData = generateMoviesData(MOVIES_MAX_QUANTITY);
const moviesModel = new MoviesModel();
moviesModel.setMovies(moviesData);

render(headerElement, new RatingComponent(), RenderPosition.BEFOREEND);
render(mainElement, new FilterComponent(), RenderPosition.BEFOREEND);

const statisticsElement = document.querySelector(`.footer__statistics`);

render(statisticsElement, new StatisticsComponent(moviesData.length), RenderPosition.BEFOREEND);

const pageController = new PageController(mainElement, moviesModel);
pageController.render(moviesData);

import RatingComponent from "./components/rating";
import FilterController from "./controllers/filter";
import MoviesStatisticsComponent from "./components/movies-statistics";
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

render(headerElement, new RatingComponent(moviesData), RenderPosition.BEFOREEND);

const pageController = new PageController(mainElement, moviesModel);

const filterController = new FilterController(mainElement, moviesModel);

filterController.setOnStatisticsClickHangler(pageController.hide);
filterController.setOnFilterClickHangler(pageController.show);

filterController.render();

const statisticsElement = document.querySelector(`.footer__statistics`);

render(statisticsElement, new MoviesStatisticsComponent(moviesData.length), RenderPosition.BEFOREEND);
pageController.render(moviesData);

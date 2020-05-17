import RatingComponent from "./components/rating";
import FilterController from "./controllers/filter";
import MoviesStatisticsComponent from "./components/movies-statistics";
import PageController from "./controllers/page";
import MoviesModel from "./models/movies";
import StatisticsComponent from "./components/statistics";
import {generateMoviesData} from "./mocks/movies-data";
import {render, RenderPosition} from "./utils/render";

const MOVIES_MAX_QUANTITY = 20;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const moviesData = generateMoviesData(MOVIES_MAX_QUANTITY);
const moviesModel = new MoviesModel();
moviesModel.setMovies(moviesData);

render(headerElement, new RatingComponent(moviesData), RenderPosition.BEFOREEND);

const filterController = new FilterController(mainElement, moviesModel);
filterController.render();

const statisticsElement = document.querySelector(`.footer__statistics`);

render(statisticsElement, new MoviesStatisticsComponent(moviesData.length), RenderPosition.BEFOREEND);

const pageController = new PageController(mainElement, moviesModel);
pageController.render(moviesData);

const statisticsComponent = new StatisticsComponent(moviesModel);

render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);

statisticsComponent.hide();

filterController.getFilterComponent().setStatisticsClickHandler(() => {
  pageController.hide();
  statisticsComponent.show();
  statisticsComponent.render();
});

filterController.getFilterComponent().setFilterChangeHandler(() => {
  pageController.show();
  statisticsComponent.hide();
});

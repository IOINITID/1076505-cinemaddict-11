import API from "./api";
import FilterController from "./controllers/filter";
import MoviesModel from "./models/movies";
import MoviesStatisticsComponent from "./components/movies-statistics";
import PageController from "./controllers/page";
import RatingComponent from "./components/rating";
import {render, RenderPosition} from "./utils/render";

const AUTORIZATION = `Basic ekfjdcndjfkrltj`;
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const statisticsElement = document.querySelector(`.footer__statistics`);

const api = new API(AUTORIZATION);
const moviesModel = new MoviesModel();
const pageController = new PageController(mainElement, moviesModel);
const filterController = new FilterController(mainElement, moviesModel);

filterController.setOnStatisticsClickHangler(pageController.hide);
filterController.setOnFilterClickHangler(pageController.show);
filterController.render();

api.getMovies()
  .then((data) => {
    moviesModel.setMovies(data);
    const moviesData = moviesModel.getMovies();
    render(headerElement, new RatingComponent(moviesData), RenderPosition.BEFOREEND);
    render(statisticsElement, new MoviesStatisticsComponent(moviesData.length), RenderPosition.BEFOREEND);
    pageController.render(moviesData);
  });

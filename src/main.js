import API from "./api";
import FilterController from "./controllers/filter";
import Loading from "./components/loading";
import MoviesModel from "./models/movies";
import MoviesStatisticsComponent from "./components/movies-statistics";
import PageController from "./controllers/page";
import RatingComponent from "./components/rating";
import {render, RenderPosition, remove} from "./utils/render";

const AUTHORIZATION = `Basic ekfjdcndjfkrltj`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const statisticsElement = document.querySelector(`.footer__statistics`);

const api = new API(AUTHORIZATION, END_POINT);
const moviesModel = new MoviesModel();
const pageController = new PageController(mainElement, moviesModel, api);
const filterController = new FilterController(mainElement, moviesModel);
const loading = new Loading();

filterController.setOnStatisticsClickHangler(pageController.hide);
filterController.setOnFilterClickHangler(pageController.show);
filterController.render();

render(mainElement, loading, RenderPosition.BEFOREEND);

const afterLoading = (data) => {
  remove(loading);
  moviesModel.setMovies(data);
  const moviesData = moviesModel.getMovies();
  render(headerElement, new RatingComponent(moviesData), RenderPosition.BEFOREEND);
  render(statisticsElement, new MoviesStatisticsComponent(moviesData.length), RenderPosition.BEFOREEND);
  pageController.render(moviesData);
};

api.getMovies()
  .then((data) => afterLoading(data))
  .catch(() => afterLoading([]));

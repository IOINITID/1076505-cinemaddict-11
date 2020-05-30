import API from "./api/index";
import Provider from "./api/provider";
import Store from "./api/store";
import FilterController from "./controllers/filter";
import Loading from "./components/loading";
import MoviesModel from "./models/movies";
import MoviesStatisticsComponent from "./components/movies-statistics";
import PageController from "./controllers/page";
import RatingComponent from "./components/rating";
import {render, RenderPosition, remove} from "./utils/render";

const AUTHORIZATION = `Basic ekfjdcndjfkrltj3`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const statisticsElement = document.querySelector(`.footer__statistics`);

const api = new API(AUTHORIZATION, END_POINT);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const moviesModel = new MoviesModel();
const pageController = new PageController(mainElement, moviesModel, apiWithProvider);
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

apiWithProvider.getMovies()
  .then((data) => afterLoading(data))
  .catch(() => afterLoading([]));

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
    .then(() => {})
    .catch((error) => {
      throw error;
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (!apiWithProvider.getSyncIsNeeded) {
    return;
  }
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

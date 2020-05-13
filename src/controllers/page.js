import MoviesComponent from "../components/movies";
import NoMoviesComponent from "../components/no-movies";
import ShowMoreButtonComponent from "../components/show-more-button";
import MoviesTopRated from "../components/movies-top-rated";
import MoviesMostCommented from "../components/movies-most-commented";
import SortingComponent, {SortType} from "../components/sorting";
import MovieController from "../controllers/movie";
import {render, remove, RenderPosition} from "../utils/render";

const MOVIES_QUANTITY_ON_START = 5;
const MOVIES_QUANTITY_BY_BUTTON = 5;
const MOVIES_EXTRA_QUANTITY = 2;

const renderMovies = (moviesListContainer, moviesData, onDataChange, onViewChange) => {
  return moviesData.map((movieData) => {
    const movieController = new MovieController(moviesListContainer, onDataChange, onViewChange);

    movieController.render(movieData);

    return movieController;
  });
};

const getSortedMovies = (moviesData, sortType, from, to) => {
  let sortedMovies = [];
  const showingMovies = moviesData.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedMovies = showingMovies.sort((a, b) => b.releaseDate.year - a.releaseDate.year);
      break;
    case SortType.RATING:
      sortedMovies = showingMovies.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedMovies = showingMovies;
      break;
  }

  return sortedMovies.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._moviesData = [];
    this._showedMovieControllers = [];
    this._moviesQuantityToShow = MOVIES_QUANTITY_ON_START;

    this._moviesComponent = new MoviesComponent();
    this._noMoviesComponent = new NoMoviesComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._moviesTopRated = new MoviesTopRated();
    this._moviesMostCommented = new MoviesMostCommented();
    this._sortingComponent = new SortingComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(moviesData) {
    this._moviesData = moviesData;

    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);

    const isMoviesData = !!this._moviesData.length;

    if (!isMoviesData) {
      render(this._container, this._noMoviesComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._moviesComponent, RenderPosition.BEFOREEND);

    const moviesElement = this._container.querySelector(`.films`);
    const moviesListElement = moviesElement.querySelector(`.films-list`);
    const moviesListContainer = moviesListElement.querySelector(`.films-list__container`);

    const newMovies = renderMovies(moviesListContainer, this._moviesData.slice(0, this._moviesQuantityToShow), this._onDataChange, this._onViewChange);

    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);

    this._renderShowMoreButton();

    render(moviesElement, this._moviesTopRated, RenderPosition.BEFOREEND);
    render(moviesElement, this._moviesMostCommented, RenderPosition.BEFOREEND);

    const moviesExtraElement = moviesElement.querySelectorAll(`.films-list--extra`);
    const moviesListTopRatedContainer = moviesExtraElement[0].querySelector(`.films-list__container`);
    const moviesListMostCommentedContainer = moviesExtraElement[1].querySelector(`.films-list__container`);

    renderMovies(moviesListTopRatedContainer, this._moviesData.slice(0, MOVIES_EXTRA_QUANTITY));
    renderMovies(moviesListMostCommentedContainer, this._moviesData.slice(0, MOVIES_EXTRA_QUANTITY));
  }

  _renderShowMoreButton() {
    if (this._moviesQuantityToShow >= this._moviesData.length) {
      return;
    }

    const moviesElement = this._container.querySelector(`.films`);
    const moviesListElement = moviesElement.querySelector(`.films-list`);
    const moviesListContainer = moviesListElement.querySelector(`.films-list__container`);

    render(moviesListElement, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const previousMovieQuantity = this._moviesQuantityToShow;

      this._moviesQuantityToShow = this._moviesQuantityToShow + MOVIES_QUANTITY_BY_BUTTON;

      const sortedMovies = getSortedMovies(this._moviesData, this._sortingComponent.getSortType(), previousMovieQuantity, this._moviesQuantityToShow);

      const newMovies = renderMovies(moviesListContainer, sortedMovies, this._onDataChange, this._onViewChange);

      this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);

      if (this._moviesQuantityToShow >= this._moviesData.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._moviesData.findIndex((movieData) => movieData === oldData);

    if (index === -1) {
      return;
    }

    this._moviesData = [].concat(this._moviesData.slice(0, index), newData, this._moviesData.slice(index + 1));

    movieController.render(this._moviesData[index]);
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((movieController) => movieController.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._moviesQuantityToShow = MOVIES_QUANTITY_ON_START;

    const sortedMovies = getSortedMovies(this._moviesData, sortType, 0, this._moviesQuantityToShow);

    const moviesElement = this._container.querySelector(`.films`);
    const moviesListElement = moviesElement.querySelector(`.films-list`);
    const moviesListContainer = moviesListElement.querySelector(`.films-list__container`);

    moviesListContainer.innerHTML = ``;

    const newMovies = renderMovies(moviesListContainer, sortedMovies, this._onDataChange, this._onViewChange);

    this._showedMovieControllers = newMovies;

    if (!this._showMoreButtonComponent) {
      this._renderShowMoreButton();
    }
  }
}

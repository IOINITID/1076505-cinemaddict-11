import MovieController from "../controllers/movie";
import MoviesComponent from "../components/movies";
import MoviesMostCommented from "../components/movies-most-commented";
import MoviesTopRated from "../components/movies-top-rated";
import NoMoviesComponent from "../components/no-movies";
import ShowMoreButtonComponent from "../components/show-more-button";
import SortingComponent, {SortType} from "../components/sorting";
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
      sortedMovies = showingMovies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
      break;
    case SortType.RATING:
      sortedMovies = showingMovies.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.COMMENTS:
      sortedMovies = showingMovies.sort((a, b) => b.comments.length - a.comments.length);
      break;
    case SortType.DEFAULT:
      sortedMovies = showingMovies;
      break;
  }

  return sortedMovies.slice(from, to);
};

export default class PageController {
  constructor(container, moviesModel, apiWithProvider) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._apiWithProvider = apiWithProvider;

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
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const moviesData = this._moviesModel.getMovies();

    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);

    const isMoviesData = !!moviesData.length;

    if (!isMoviesData) {
      render(this._container, this._noMoviesComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._moviesComponent, RenderPosition.BEFOREEND);

    const moviesElement = this._container.querySelector(`.films`);

    this._renderMovies(moviesData.slice(0, this._moviesQuantityToShow));
    this._renderShowMoreButton();

    render(moviesElement, this._moviesTopRated, RenderPosition.BEFOREEND);
    render(moviesElement, this._moviesMostCommented, RenderPosition.BEFOREEND);

    this._renderMoviesExtra(moviesData);
  }

  hide() {
    this._sortingComponent.hide();
    this._moviesComponent.hide();
  }

  show() {
    this._sortingComponent.show();
    this._moviesComponent.show();
  }

  _removeMovies() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
    remove(this._showMoreButtonComponent);
  }

  _renderMovies(moviesData) {
    const moviesElement = this._container.querySelector(`.films`);
    const moviesListElement = moviesElement.querySelector(`.films-list`);
    const moviesListContainer = moviesListElement.querySelector(`.films-list__container`);

    const newMovies = renderMovies(moviesListContainer, moviesData, this._onDataChange, this._onViewChange);

    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
    this._moviesQuantityToShow = this._showedMovieControllers.length;
  }

  _renderMoviesExtra(moviesData) {
    const moviesElement = this._container.querySelector(`.films`);
    const moviesExtraElement = moviesElement.querySelectorAll(`.films-list--extra`);
    const moviesListTopRatedContainer = moviesExtraElement[0].querySelector(`.films-list__container`);
    const moviesListMostCommentedContainer = moviesExtraElement[1].querySelector(`.films-list__container`);

    const sortedMoviesByRating = getSortedMovies(moviesData, SortType.RATING, 0, MOVIES_EXTRA_QUANTITY);
    const sortedMoviesByComments = getSortedMovies(moviesData, SortType.COMMENTS, 0, MOVIES_EXTRA_QUANTITY);

    const ratingInfo = moviesData.filter((item) => item.rating > 0);
    const commentsInfo = moviesData.filter((item) => item.comments > 0);

    if (ratingInfo.length > 0) {
      renderMovies(moviesListTopRatedContainer, sortedMoviesByRating, this._onDataChange, this._onViewChange);
    }

    if (commentsInfo.length > 0) {
      renderMovies(moviesListMostCommentedContainer, sortedMoviesByComments, this._onDataChange, this._onViewChange);
    }
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    const moviesElement = this._container.querySelector(`.films`);
    const moviesListElement = moviesElement.querySelector(`.films-list`);

    render(moviesListElement, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _updateMovies(quantity) {
    this._removeMovies();
    this._renderMovies(this._moviesModel.getMovies().slice(0, quantity));

    if (this._moviesModel.getMovies().length > quantity) {
      this._renderShowMoreButton();
    }
  }

  _onDataChange(movieController, oldData, newData) {
    this._apiWithProvider.updateMovie(oldData.id, newData)
      .then((movieData) => {
        const isSuccess = this._moviesModel.updateMovie(oldData.id, movieData);

        if (isSuccess) {
          movieController.render(movieData);
        }
      });
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((movieController) => movieController.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._moviesQuantityToShow = MOVIES_QUANTITY_ON_START;

    const sortedMovies = getSortedMovies(this._moviesModel.getMovies(), sortType, 0, this._moviesQuantityToShow);

    this._removeMovies();

    this._renderMovies(sortedMovies);

    if (this._moviesModel.getMovies().length > this._moviesQuantityToShow) {
      this._renderShowMoreButton();
    }
  }

  _onShowMoreButtonClick() {
    const previousMovieQuantity = this._moviesQuantityToShow;
    const moviesData = this._moviesModel.getMovies();

    this._moviesQuantityToShow = this._moviesQuantityToShow + MOVIES_QUANTITY_BY_BUTTON;

    const sortedMovies = getSortedMovies(moviesData, this._sortingComponent.getSortType(), previousMovieQuantity, this._moviesQuantityToShow);

    this._renderMovies(sortedMovies);

    if (this._moviesQuantityToShow >= this._moviesModel.getMovies().length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onFilterChange() {
    this._updateMovies(MOVIES_QUANTITY_ON_START);
    this._sortingComponent.setDefaultActiveState();
  }
}

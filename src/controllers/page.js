import MoviesComponent from "../components/movies";
import NoMoviesComponent from "../components/no-movies";
import ShowMoreButtonComponent from "../components/show-more-button";
import MovieTopRated from "../components/movie-top-rated";
import MovieMostCommented from "../components/movie-most-commented";
import SortComponent, {SortType} from "../components/sort";
import {render as renderComponent, remove, RenderPosition} from "../utils/render";
import MovieController from "../controllers/movie";

const MOVIE_CARD_COUNT_ON_START = 5;
const MOVIE_CARD_COUNT_BY_BUTTON = 5;
const MOVIE_CARD_EXTRA_COUNT = 2;

const renderFilms = (filmsListContainer, filmDetails, onDataChange, onViewChange) => {
  return filmDetails.map((card) => {
    const movieController = new MovieController(filmsListContainer, onDataChange, onViewChange);

    movieController.render(card);

    return movieController;
  });
};

const getSortedFilms = (filmDetails, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = filmDetails.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.releaseDate.year - a.releaseDate.year);
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._filmDetais = [];
    this._showedFilmControllers = [];
    this._showingMovieCardCount = MOVIE_CARD_COUNT_ON_START;

    this._noMoviesComponent = new NoMoviesComponent();
    this._moviesComponent = new MoviesComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._movieTopRated = new MovieTopRated();
    this._movieMostCommented = new MovieMostCommented();
    this._sortComponent = new SortComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(filmDetails) {
    this._filmDetais = filmDetails;

    renderComponent(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    const isFilmDetails = !!this._filmDetais.length;

    if (!isFilmDetails) {
      renderComponent(this._container, this._noMoviesComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderComponent(this._container, this._moviesComponent, RenderPosition.BEFOREEND);

    const filmsElement = this._container.querySelector(`.films`);

    const filmsListElement = filmsElement.querySelector(`.films-list`);

    const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

    const newFilms = renderFilms(filmsListContainer, this._filmDetais.slice(0, this._showingMovieCardCount), this._onDataChange, this._onViewChange);

    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._renderShowMoreButton();

    renderComponent(filmsElement, this._movieTopRated, RenderPosition.BEFOREEND);

    renderComponent(filmsElement, this._movieMostCommented, RenderPosition.BEFOREEND);

    const filmsExtraElement = filmsElement.querySelectorAll(`.films-list--extra`);

    const filmsListTopRatedContainer = filmsExtraElement[0].querySelector(`.films-list__container`);

    const filmsListMostCommentedContainer = filmsExtraElement[1].querySelector(`.films-list__container`);

    renderFilms(filmsListTopRatedContainer, filmDetails.slice(0, MOVIE_CARD_EXTRA_COUNT));

    renderFilms(filmsListMostCommentedContainer, filmDetails.slice(0, MOVIE_CARD_EXTRA_COUNT));
  }

  _renderShowMoreButton() {
    if (this._showingMovieCardCount >= this._filmDetais.length) {
      return;
    }

    const filmsElement = this._container.querySelector(`.films`);

    const filmsListElement = filmsElement.querySelector(`.films-list`);

    const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

    renderComponent(filmsListElement, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevMovieCardCount = this._showingMovieCardCount;

      this._showingMovieCardCount = this._showingMovieCardCount + MOVIE_CARD_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._filmDetais, this._sortComponent.getSortType(), prevMovieCardCount, this._showingMovieCardCount);

      const newFilms = renderFilms(filmsListContainer, sortedFilms, this._onDataChange, this._onViewChange);

      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingMovieCardCount >= this._filmDetais.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._filmDetais.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._filmDetais = [].concat(this._filmDetais.slice(0, index), newData, this._filmDetais.slice(index + 1));

    movieController.render(this._filmDetais[index]);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingMovieCardCount = MOVIE_CARD_COUNT_ON_START;

    const sortedFilms = getSortedFilms(this._filmDetais, sortType, 0, this._showingMovieCardCount);

    const filmsElement = this._container.querySelector(`.films`);

    const filmsListElement = filmsElement.querySelector(`.films-list`);

    const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

    filmsListContainer.innerHTML = ``;

    const newFilms = renderFilms(filmsListContainer, sortedFilms, this._onDataChange, this._onViewChange);

    this._showedFilmControllers = newFilms;

    if (!this._showMoreButtonComponent) {
      this._renderShowMoreButton();
    }
  }

}

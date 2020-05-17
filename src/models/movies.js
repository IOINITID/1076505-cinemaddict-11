import {getMoviesByFilter} from "../utils/filter";
import {FilterType} from "../const.js";

export default class Movies {
  constructor() {
    this._moviesData = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getMovies() {
    return getMoviesByFilter(this._moviesData, this._activeFilterType);
  }

  getMoviesAll() {
    return this._moviesData;
  }

  setMovies(moviesData) {
    this._moviesData = Array.from(moviesData);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateMovie(id, movieData) {
    const index = this._moviesData.findIndex((data) => data.id === id);

    if (index === -1) {
      return false;
    }

    this._moviesData = [].concat(this._moviesData.slice(0, index), movieData, this._moviesData.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

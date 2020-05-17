import {getMoviesByFilter} from "../utils/filter";
import {FilterType, RatingLevel} from "../const";

const sortData = (list) => {
  let sortedData = [];

  for (let key in list) {
    if (Object.prototype.hasOwnProperty.call(list, key)) {
      sortedData.push([key, list[key]]);
    }
  }

  sortedData.sort((a, b) => {
    if (a[1] > b[1]) {
      return -1;
    } else {
      if (a[1] > b[1]) {
        return 1;
      } else {
        return 0;
      }
    }
  });

  let resultData = {};

  for (let id in sortedData) {
    if (Object.prototype.hasOwnProperty.call(sortedData, id)) {
      resultData[sortedData[id][0]] = sortedData[id][1];
    }
  }

  return resultData;
};

const StatisticsFilter = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const MINUTES_PER_HOUR = 60;

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

  getMoviesByWatched(timeName = StatisticsFilter.ALL_TIME) {
    let moviesWatched = this._moviesData.filter((movie) => movie.watched);

    if (timeName === StatisticsFilter.ALL_TIME) {
      return moviesWatched;
    }

    const date = new Date();

    switch (timeName) {
      case StatisticsFilter.YEAR:
        date.setFullYear(date.getFullYear() - 1);
        break;
      case StatisticsFilter.MONTH:
        date.setMonth(date.getMonth() - 1);
        break;
      case StatisticsFilter.WEEK:
        date.setDate(date.getDate() - 7);
        break;
      case StatisticsFilter.TODAY:
        date.setDate(date.getDate() - 1);
        break;
      default:
        return moviesWatched;
    }

    return moviesWatched.filter((item) => {
      return item.watchingDate > date;
    });
  }

  getRating() {
    const moviesQuantity = this._moviesData.filter((movieData) => movieData.watched === true).length;

    if (moviesQuantity > 0 && moviesQuantity <= 10) {
      return RatingLevel.NOVICE;
    } else if (moviesQuantity > 10 && moviesQuantity <= 20) {
      return RatingLevel.FAN;
    } else if (moviesQuantity >= 21) {
      return RatingLevel.MOVIEBUFF;
    }

    return ``;
  }

  getGenresStatistics(filter) {
    let genres = {};

    this.getMoviesByWatched(filter).forEach((movie) => {
      movie.genres.forEach((genre) => {
        genres[genre] = genres[genre] === undefined ? 1 : genres[genre] + 1;
      });
    });

    let sortedGenres = sortData(genres);

    return sortedGenres;
  }

  getTopGenre(filter) {
    const genres = this.getGenresStatistics(filter);

    return Object.keys(genres).reduce((topGenre, genre) => {
      if (topGenre === ``) {
        return genre;
      }

      return genres[genre] > genres[topGenre] ? genre : topGenre;
    }, ``);
  }

  getTotalDuration(filter) {
    const totalDuration = this.getMoviesByWatched(filter).reduce((total, movie) => {
      return total + movie.runtime;
    }, 0);

    const hours = parseInt(totalDuration / MINUTES_PER_HOUR, 10);
    const minutes = totalDuration - hours * MINUTES_PER_HOUR;

    return {
      hours,
      minutes,
    };
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

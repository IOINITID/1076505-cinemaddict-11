import Movie from "../models/movie";
// import {nanoid} from "nanoid";

const getSyncedTasks = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, storeMovies, storeComments) {
    this._api = api;
    this._storeMovies = storeMovies;
    this._storeComments = storeComments;
  }

  getMovies() {
    if (this._isOnline) {
      return this._api.getMovies()
      .then((moviesData) => {
        const items = createStoreStructure(moviesData.map((movieData) => movieData.toRAW()));

        this._storeMovies.setItems(items);

        return moviesData;
      });
    }

    const storeMovies = Object.values(this._storeMovies.getItems());

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  getComments(id) {
    if (this._isOnline) {
      return this._api.getComments(id);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  updateMovie(id, data) {
    if (this._isOnline) {
      return this._api.updateMovie(id, data);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  addComment(movieData, commentData) {
    if (this._isOnline) {
      return this._api.addComment(movieData, commentData);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  deleteComment(commentId) {
    if (this._isOnline) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  sync() {
    if (this._isOnline) {
      return this._api.sync();
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

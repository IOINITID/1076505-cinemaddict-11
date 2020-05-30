// import Movie from "../models/movie";
// import {nanoid} from "nanoid";

// const createStorageStructure = (items) => {
//   return items.reduce((acc, item) => {
//     acc[item.id] = item;
//     return acc;
//   }, {});
// };

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._syncIsNeeded = false;
  }

  getSyncIsNeeded() {
    return this._syncIsNeeded;
  }

  getMovies() {
    if (this._isOnline) {
      return this._api.getMovies();
    }

    return Promise.reject(`offline logic is not implemented`);
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

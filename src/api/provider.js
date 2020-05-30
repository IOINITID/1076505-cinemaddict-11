import Movie from "../models/movie";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const createStorageStructure = (items) => {
  return items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
};

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
    if (isOnline()) {
      return this._api.getMovies()
        .then((moviesData) => {
          const items = createStorageStructure(moviesData.map((movieData) => movieData.toRAW()));

          this._store.setItems(items);
        });
    }

    const storeMovies = Object.values(this._store.getItems());

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  getComments(id) {
    if (isOnline()) {
      return this._api.getComments(id);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  updateMovie(id, data) {
    if (isOnline()) {
      return this._api.updateTask(id, data)
        .then((newMovie) => {
          this._store.setItem(newMovie.id, newMovie.toRAW());
          this._syncIsNeeded = true;
          return newMovie;
        });
    }

    const localMovie = Movie.clone(Object.assign(data, {id}));

    this._store.setItem(id, localMovie.toRAW());

    return Promise.resolve(localMovie);
  }

  addComment(movieData, commentData) {
    if (isOnline()) {
      return this._api.addComment(movieData, commentData)
        .then((movie, comment) => {
          this._store.setItem(movie.id, movie.toRAW());
          this._store.setItem(comment.id, comment.toRAW());
          return {movie, comment};
        });
    }

    const localNewMovieCommentId = nanoid();
    const localNewMovieComment = Movie.clone(Object.assign(commentData, {id: localNewMovieCommentId}));

    this._store.setItem(localNewMovieComment.id, localNewMovieComment.toRAW());

    return Promise.resolve(localNewMovieComment);
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => this._store.removeItem(commentId));
    }

    this._store.removeItem(commentId);

    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeMovies = Object.values(this._store.getItems());

      return this._api.sync(storeMovies)
        .then((response) => {
          const updatedMovies = createStorageStructure(response.updated);

          this._storage.setItems(updatedMovies);
          this._syncIsNeeded = false;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}

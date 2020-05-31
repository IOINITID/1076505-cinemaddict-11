import Movie from "../models/movie";

const getSyncedMovies = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.movie);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (this._isOnline()) {
      return this._api.getMovies()
      .then((moviesData) => {
        const items = createStoreStructure(moviesData.map((movieData) => movieData.toRAW()));

        this._store.setItems(items);

        return moviesData;
      });
    }

    const storeMovies = Object.values(this._store.getItems());

    return Promise.resolve(Movie.parseMovies(storeMovies));
  }

  getComments(id) {
    if (this._isOnline()) {
      return this._api.getComments(id);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  updateMovie(id, data) {
    if (this._isOnline()) {
      return this._api.updateMovie(id, data)
      .then((newMovie) => {
        this._store.setItem(newMovie.id, newMovie.toRAW());

        return newMovie;
      });
    }

    const localMovie = Movie.clone(Object.assign(data, {id}));

    this._store.setItem(id, localMovie.toRAW());

    return Promise.resolve(localMovie);
  }

  addComment(movieData, commentData) {
    if (this._isOnline()) {
      return this._api.addComment(movieData, commentData);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  deleteComment(commentId) {
    if (this._isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  sync() {
    if (this._isOnline()) {
      const storeMovies = Object.values(this._store.getItems());

      return this._api.sync(storeMovies)
        .then((response) => {
          const updatedMovies = getSyncedMovies(response.updated);
          const items = createStoreStructure([...updatedMovies]);
          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}

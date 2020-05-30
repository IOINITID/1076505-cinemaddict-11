export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getMovies() {
    return this._api.getMovies();
  }

  getComments(id) {
    return this._api.getComments(id);
  }

  updateMovie(id, data) {
    return this._api.updateMovie(id, data);
  }

  addComment(movieData, commentData) {
    return this._api.addComment(movieData, commentData);
  }

  deleteComment(commentId) {
    return this._api.deleteComment(commentId);
  }
}

import {getMoviesByFilter} from "../utils/filter";

export default class Comments {
  constructor() {
    this._comments = [];

    this._dataChangeHandlers = [];
  }

  getComments() {
    return this._comments;
  }

  setComments(commentsData) {
    this._comments = commentsData;
  }

  deleteComment(id) {
    // логика по удалению

    this._comments = this._comments.filter((comment) => comment.id !== id);

    this._callHandlers(this._dataChangeHandlers);
  }

  createComment(commentData) {
    this._comments.push(commentData);

    this._callHandlers(this._dataChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

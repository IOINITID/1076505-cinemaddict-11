export default class Comments {
  constructor() {
    this._commentsData = [];
    this._dataChangeHandlers = [];
  }

  getComments() {
    return this._commentsData;
  }

  setComments(commentsData) {
    this._commentsData = commentsData;
  }

  deleteComment(id) {
    this._commentsData = this._commentsData.filter((commentData) => commentData.id !== id);
    this._callHandlers(this._dataChangeHandlers);
  }

  createComment(commentData) {
    this._commentsData.push(commentData);
    this._callHandlers(this._dataChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

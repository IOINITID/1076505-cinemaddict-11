import API from "../api/index";
import Provider from "../api/provider";
import Store from "../api/store";
import CommentsModel from "../models/comments";
import Movie from "../models/movie";
import MovieComponent from "../components/movie";
import MovieDetailsComponent from "../components/movie-details";
import {render, remove, replace, RenderPosition} from "../utils/render";

const AUTHORIZATION = `Basic ekfjdcndjfkrltfkn7`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const SHAKE_ANIMATION_TIMEOUT = 600;

const Mode = {
  DEFAULT: `default`,
  OPEN: `open`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._footerElement = document.querySelector(`.footer`);

    this._commentsModel = new CommentsModel();
    this._api = new API(AUTHORIZATION, END_POINT);
    this._store = new Store(STORE_NAME, window.localStorage);
    this._apiWithProvider = new Provider(this._api, this._store);

    this._movieData = null;
    this._commentData = null;

    this._movieComponent = null;
    this._movieDetailsComponent = null;

    this._onPopupCloseButtonClick = this._onPopupCloseButtonClick.bind(this);
    this._onPopupEscButtonKeydown = this._onPopupEscButtonKeydown.bind(this);

    this._onInWatchlistDataChange = this._onInWatchlistDataChange.bind(this);
    this._onWatchedDataChange = this._onWatchedDataChange.bind(this);
    this._onFavoriteDataChange = this._onFavoriteDataChange.bind(this);

    this._onCommentDelete = this._onCommentDelete.bind(this);
    this._onCommentSubmit = this._onCommentSubmit.bind(this);
    this._onDataChangeHandler = this._onDataChangeHandler.bind(this);

    this._commentsModel.setDataChangeHandler(this._onDataChangeHandler);
  }

  render(movieData) {
    this._movieData = movieData;

    this._apiWithProvider.getComments(this._movieData.id)
      .then((commentsData) => {
        this._commentsModel.setComments(commentsData);
        this._commentData = this._commentsModel.getComments();

        this._movieDetailsComponent = new MovieDetailsComponent(this._movieData, this._commentData);

        this._movieDetailsComponent.setAddToWatchlistButtonClickHandler(this._onInWatchlistDataChange);
        this._movieDetailsComponent.setMarkAsWatchedButtonClickHandler(this._onWatchedDataChange);
        this._movieDetailsComponent.setMarkAsFavoriteButtonClickHandler(this._onFavoriteDataChange);
        this._movieDetailsComponent.setPopupCloseButtonClick(this._onPopupCloseButtonClick);
        this._movieDetailsComponent.setCommentDeleteHandler(this._onCommentDelete);
        this._movieDetailsComponent.setSubmitHandler(this._onCommentSubmit);

        if (oldMovie && oldMovieDetails) {
          replace(this._movieComponent, oldMovie);
          replace(this._movieDetailsComponent, oldMovieDetails);
        }
      });

    const oldMovie = this._movieComponent;
    const oldMovieDetails = this._movieDetailsComponent;

    this._movieComponent = new MovieComponent(this._movieData);
    this._movieComponent.setAddToWatchlistButtonClickHandler(this._onInWatchlistDataChange);
    this._movieComponent.setMarkAsWatchedButtonClickHandler(this._onWatchedDataChange);
    this._movieComponent.setMarkAsFavoriteButtonClickHandler(this._onFavoriteDataChange);

    render(this._container, this._movieComponent, RenderPosition.BEFOREEND);

    const moviePosterElement = this._movieComponent.getElement().querySelector(`.film-card__poster`);
    const movieTitleElement = this._movieComponent.getElement().querySelector(`.film-card__title`);
    const movieCommentsElement = this._movieComponent.getElement().querySelector(`.film-card__comments`);

    [moviePosterElement, movieTitleElement, movieCommentsElement].forEach((element) => {
      element.addEventListener(`click`, () => {
        this._onViewChange();
        this._mode = Mode.OPEN;
        this._movieDetailsComponent.rerender();
        render(this._footerElement, this._movieDetailsComponent, RenderPosition.AFTEREND);
        document.addEventListener(`keydown`, this._onPopupEscButtonKeydown);
        this._movieDetailsComponent.setCommentDeleteHandler(this._onCommentDelete);
        this._movieDetailsComponent.setSubmitHandler(this._onCommentSubmit);
      });
    });
  }

  shake() {
    const newCommentElement = this._movieDetailsComponent.getElement().querySelector(`.film-details__new-comment`);

    newCommentElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      newCommentElement.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeMovieDetails();
    }
  }

  destroy() {
    remove(this._movieDetailsComponent);
    remove(this._movieComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onDataChangeHandler() {
    this._movieData.comments = this._commentsModel.getComments().map((item) => String(item.id));
    this.render(this._movieData);
  }

  _onCommentSubmit(formData) {
    const commentFormData = {
      emoji: formData.get(`comment-emoji`),
      text: formData.get(`comment`),
      date: new Date().toISOString(),
    };

    const emojiList = this._movieDetailsComponent.getElement().querySelectorAll(`.film-details__emoji-item`);
    const textField = this._movieDetailsComponent.getElement().querySelector(`.film-details__comment-input`);

    this._apiWithProvider.addComment(this._movieData, commentFormData)
      .then(() => {
        emojiList.forEach((item) => {
          item.disabled = true;
        });
        textField.disabled = true;
        textField.style.border = ``;
        this._commentsModel.createComment(commentFormData);
      })
      .catch(() => {
        emojiList.forEach((item) => {
          item.disabled = false;
        });
        textField.disabled = false;
        textField.style.border = `1px solid red`;
        this.shake();
      });
  }

  _onCommentDelete(id, errorCallback) {
    this._apiWithProvider.deleteComment(id)
      .then(() => {
        this._commentsModel.deleteComment(id);
      })
      .catch(() => {
        errorCallback();
        this.shake();
      });
  }

  _onInWatchlistDataChange(evt) {
    evt.preventDefault();
    const movieData = Movie.clone(this._movieData);
    movieData.inWatchlist = !movieData.inWatchlist;
    this._onDataChange(this, this._movieData, movieData);
  }

  _onWatchedDataChange(evt) {
    evt.preventDefault();
    const movieData = Movie.clone(this._movieData);
    movieData.watched = !movieData.watched;
    this._onDataChange(this, this._movieData, movieData);
  }

  _onFavoriteDataChange(evt) {
    evt.preventDefault();
    const movieData = Movie.clone(this._movieData);
    movieData.favorite = !movieData.favorite;
    this._onDataChange(this, this._movieData, movieData);
  }

  _removeMovieDetails() {
    remove(this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._onPopupEscButtonKeydown);
  }

  _onPopupCloseButtonClick(evt) {
    evt.preventDefault();
    this._removeMovieDetails();
  }

  _onPopupEscButtonKeydown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._removeMovieDetails();
    }
  }
}

import MovieComponent from "../components/movie";
import MovieDetailsComponent from "../components/movie-details";
import CommentsModel from "../models/comments";
import {render, remove, replace, RenderPosition} from "../utils/render";
import API from "../api";
import Movie from "../models/movie";

const AUTHORIZATION = `Basic ekfjdcndjfkrltj`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

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

    this._api.getComments(this._movieData.id)
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
      } else {
        render(this._container, this._movieComponent, RenderPosition.BEFOREEND);
      }
    });

    const oldMovie = this._movieComponent;
    const oldMovieDetails = this._movieDetailsComponent;

    this._movieComponent = new MovieComponent(this._movieData);
    this._movieComponent.setAddToWatchlistButtonClickHandler(this._onInWatchlistDataChange);
    this._movieComponent.setMarkAsWatchedButtonClickHandler(this._onWatchedDataChange);
    this._movieComponent.setMarkAsFavoriteButtonClickHandler(this._onFavoriteDataChange);

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
    this._movieDetailsComponent.getElement().querySelector(`.film-details__new-comment`).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._movieDetailsComponent.getElement().querySelector(`.film-details__new-comment`).style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _onDataChangeHandler() {
    this._movieData.comments = this._commentsModel.getComments();
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

    this._api.addComment(this._movieData, commentFormData)
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

  _onCommentDelete(id) {
    const deleteButton = this._movieDetailsComponent.getElement().querySelectorAll(`.film-details__comment-delete`);

    deleteButton.forEach((button) => {
      button.addEventListener(`click`, (evt) => {
        if (evt.target === button) {
          button.textContent = `Deleting...`;
          button.disabled = true;
        }
      });
    });

    this._api.deleteComment(id)
    .then(() => {
      this._commentsModel.deleteComment(id);
    })
    .catch(() => {
      deleteButton.forEach((button) => {
        button.addEventListener(`click`, (evt) => {
          if (evt.target === button) {
            button.disabled = false;
          }
        });
      });
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

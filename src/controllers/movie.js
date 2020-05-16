import MovieComponent from "../components/movie";
import MovieDetailsComponent from "../components/movie-details";
import CommentsModel from "../models/comments";
import {render, remove, replace, RenderPosition} from "../utils/render";

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

    this._movieComponent = null;
    this._movieDetailsComponent = null;

    this._onPopupCloseButtonClick = this._onPopupCloseButtonClick.bind(this);
    this._onPopupEscButtonKeydown = this._onPopupEscButtonKeydown.bind(this);

    this._onInWatchlistDataChange = this._onInWatchlistDataChange.bind(this);
    this._onWatchedDataChange = this._onWatchedDataChange.bind(this);
    this._onFavoriteDataChange = this._onFavoriteDataChange.bind(this);

    this._onCommentDelete = this._onCommentDelete.bind(this);
    this._onCommentSubmit = this._onCommentSubmit.bind(this);

    this._commentsModel.setDataChangeHandler(() => {
      this._movieData.comments = this._commentsModel.getComments();
      this.render(this._movieData);
    });
  }

  render(movieData) {
    this._movieData = movieData;
    this._commentsModel.setComments(this._movieData.comments);

    const oldMovie = this._movieComponent;
    const oldMovieDetails = this._movieDetailsComponent;

    this._movieComponent = new MovieComponent(this._movieData);
    this._movieDetailsComponent = new MovieDetailsComponent(this._movieData);

    this._movieComponent.setAddToWatchlistButtonClickHandler(this._onInWatchlistDataChange);
    this._movieDetailsComponent.setAddToWatchlistButtonClickHandler(this._onInWatchlistDataChange);

    this._movieComponent.setMarkAsWatchedButtonClickHandler(this._onWatchedDataChange);
    this._movieDetailsComponent.setMarkAsWatchedButtonClickHandler(this._onWatchedDataChange);

    this._movieComponent.setMarkAsFavoriteButtonClickHandler(this._onFavoriteDataChange);
    this._movieDetailsComponent.setMarkAsFavoriteButtonClickHandler(this._onFavoriteDataChange);

    this._movieDetailsComponent.setPopupCloseButtonClick(this._onPopupCloseButtonClick);

    if (oldMovie && oldMovieDetails) {
      replace(this._movieComponent, oldMovie);
      replace(this._movieDetailsComponent, oldMovieDetails);
    } else {
      render(this._container, this._movieComponent, RenderPosition.BEFOREEND);
    }

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

  _onCommentSubmit(formData) {
    const comment = {
      id: String(new Date() + Math.random()),
      emoji: formData.get(`comment-emoji`) || `smile`,
      text: formData.get(`comment`),
      author: `New author`,
      date: new Date(),
    };

    this._commentsModel.createComment(comment);
  }

  _onCommentDelete(id) {
    this._commentsModel.deleteComment(id);
  }

  _onInWatchlistDataChange(evt) {
    evt.preventDefault();
    this._onDataChange(this._movieData, Object.assign({}, this._movieData, {
      inWatchlist: !this._movieData.inWatchlist,
    }));
  }

  _onWatchedDataChange(evt) {
    evt.preventDefault();
    this._onDataChange(this._movieData, Object.assign({}, this._movieData, {
      watched: !this._movieData.watched,
    }));
  }

  _onFavoriteDataChange(evt) {
    evt.preventDefault();
    this._onDataChange(this._movieData, Object.assign({}, this._movieData, {
      favorite: !this._movieData.favorite,
    }));
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

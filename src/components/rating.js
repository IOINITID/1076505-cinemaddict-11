import AbstractComponent from "./abstract-component";
import {RatingLevel} from "../const";

const getRating = (moviesWatched) => {
  const moviesQuantity = moviesWatched.filter((movieData) => movieData.watched === true).length;

  if (moviesQuantity > 0 && moviesQuantity <= 10) {
    return RatingLevel.NOVICE;
  } else if (moviesQuantity > 10 && moviesQuantity <= 20) {
    return RatingLevel.FAN;
  } else if (moviesQuantity >= 21) {
    return RatingLevel.MOVIEBUFF;
  }

  return ``;
};

const createRatingTemplate = (watched) => {
  const rating = getRating(watched);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Rating extends AbstractComponent {
  constructor(moviesData) {
    super();

    this._moviesData = moviesData;
  }

  getTemplate() {
    return createRatingTemplate(this._moviesData);
  }
}

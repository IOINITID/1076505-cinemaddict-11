import AbstractComponent from "./abstract-component";
import {getRating} from "../utils/common";

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

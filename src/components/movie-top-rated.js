import {createElement} from "../utils";

// Возвращает разметку блока фильмы из раздела дополнительно
const createMovieTopRatedTemplate = () => {
  return (
    `<section class="films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container"></div>
  </section>`
  );
};

// Класс фильмы по рейтингу
export default class MovieTopRated {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMovieTopRatedTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

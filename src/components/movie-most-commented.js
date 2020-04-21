import {createElement} from "../utils";

// Возвращает разметку блока фильмы
const createMovieMostCommentedTemplate = () => {
  return (
    `<section class="films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container"></div>
  </section>`
  );
};

// Класс фильмы из раздела дополнительно
export default class MovieMostCommented {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMovieMostCommentedTemplate();
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

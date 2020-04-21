import {createElement} from "../utils";

// Возвращает разметку блока статистика
const createSiteFooterStatisctics = (FILMS_COUNT) => {
  return (
    `<p>${FILMS_COUNT} movies inside</p>`
  );
};

// Класс статистика
export default class SiteFooterStatisctics {
  constructor(FILMS_COUNT) {
    this._filmsCount = FILMS_COUNT;
    this._element = null;
  }

  getTemplate() {
    return createSiteFooterStatisctics(this._filmsCount);
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

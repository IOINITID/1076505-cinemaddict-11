import {createElement} from "../utils";

// Возвращает разметку блока сортировка
const createSortList = () => {
  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
  );
};

// Класс сортировка
export default class Sort {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortList();
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

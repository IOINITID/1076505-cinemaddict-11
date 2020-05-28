import AbstractComponent from "./abstract-component";

export const SortType = {
  DATE: `date`,
  RATING: `rating`,
  COMMENTS: `comment`,
  DEFAULT: `default`,
};

const createSortList = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type=${SortType.DEFAULT} class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type=${SortType.DATE} class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type=${SortType.RATING} class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sorting extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortList();
  }

  getSortType() {
    return this._currentSortType;
  }

  _clearActiveState() {
    this.getElement().querySelectorAll(`.sort__button`).forEach((button) => {
      button.classList.remove(`sort__button--active`);
    });
  }

  setDefaultActiveState() {
    this._clearActiveState();
    this.getElement().querySelector(`.sort__button`).classList.add(`sort__button--active`);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      this._clearActiveState();

      evt.target.classList.add(`sort__button--active`);

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}

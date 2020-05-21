import AbstractComponent from "./abstract-component";
import {getFirstSymbolUpperCase} from "../utils/common";

const createFilterTemplate = (filters) => {
  const filterElements = filters.map((filterElement) => createFilterElementTemplate(filterElement)).join(`\n`);

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterElements}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
  );
};

const createFilterElementTemplate = (filter) => {
  const {title, quantity, checked} = filter;
  const activeFilterElement = checked ? `main-navigation__item--active` : ``;
  const filterTitle = title === `all` ? `All movies` : getFirstSymbolUpperCase(title);

  return (
    `<a href="#${title}" id="${title}" class="main-navigation__item ${activeFilterElement}">${filterTitle} <span class="main-navigation__item-count">${quantity}</span></a>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().querySelectorAll(`.main-navigation__item`).forEach((filter) => {
      filter.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler(evt.target.id);
      });
    });
  }

  setStatisticsClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, handler);
  }
}

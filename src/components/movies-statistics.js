import AbstractComponent from "./abstract-component";

const createStatisticsTemplate = (moviesQuantity) => {
  return (
    `<p>${moviesQuantity} movies inside</p>`
  );
};

export default class MoviesStatistics extends AbstractComponent {
  constructor(moviesQuantity) {
    super();

    this._moviesQuantity = moviesQuantity;
  }

  getTemplate() {
    return createStatisticsTemplate(this._moviesQuantity);
  }
}

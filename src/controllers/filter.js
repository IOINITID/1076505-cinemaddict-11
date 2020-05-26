import FilterComponent from "../components/filter";
import StatisticsComponent from "../components/statistics";
import {FilterType} from "../const";
import {render, replace, RenderPosition} from "../utils/render";
import {getMoviesByFilter} from "../utils/filter";

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._statisticsComponent = null;

    this._onStatisticsClickHanglers = [];
    this._onFilterClickHandlers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allMovies = this._moviesModel.getMoviesAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        quantity: getMoviesByFilter(allMovies, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    const oldStatistics = this._statisticsComponent;
    this._statisticsComponent = new StatisticsComponent(this._moviesModel);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }

    if (oldStatistics) {
      replace(this._statisticsComponent, oldStatistics);
    } else {
      render(this._container, this._statisticsComponent, RenderPosition.BEFOREEND);
    }

    this._statisticsComponent.hide();

    this._filterComponent.setStatisticsClickHandler(() => {

      const statisticsElement = this._filterComponent.getElement().querySelector(`.main-navigation__additional`);
      const filterList = this._filterComponent.getElement().querySelectorAll(`.main-navigation__item`);

      filterList.forEach((element) => {
        element.classList.remove(`main-navigation__item--active`);
      });
      statisticsElement.classList.add(`main-navigation__item--active`);

      this._statisticsComponent.show();
      this._statisticsComponent.render();
      this._callHandlers(this._onStatisticsClickHanglers);
    });

    this._filterComponent.setFilterChangeHandler(() => {
      this._statisticsComponent.hide();
      this._callHandlers(this._onFilterClickHandlers);
    });
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setOnStatisticsClickHangler(handler) {
    this._onStatisticsClickHanglers.push(handler);
  }

  setOnFilterClickHangler(handler) {
    this._onFilterClickHandlers.push(handler);
  }
}

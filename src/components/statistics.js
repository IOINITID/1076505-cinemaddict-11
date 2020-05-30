import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {getRating} from "../utils/common";
import {StatisticsFilter} from "../const";

const BAR_HEIGHT = 50;

const createStatisticsTemplate = (moviesModel, filter) => {
  const totalDuration = moviesModel.getTotalDuration(filter);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${getRating(moviesModel.getMovies())}</span>
      </p>
      <form action="https://echo.htmlacademy.ru" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
        id="statistic-all-time" value="all-time" ${filter === `all-time` ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
        id="statistic-today" value="today" ${filter === `today` ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
        id="statistic-week" value="week" ${filter === `week` ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
        id="statistic-month" value="month" ${filter === `month` ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
        id="statistic-year" value="year" ${filter === `year` ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${moviesModel.getMoviesByWatched(filter).length}
          <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">
            ${totalDuration.hours}&nbsp;<span class="statistic__item-description">h</span>
            &nbsp;
            ${totalDuration.minutes}&nbsp;<span class="statistic__item-description">m</span>
          </p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${moviesModel.getTopGenre(filter) || ``}</p>
        </li>
      </ul>
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();

    this._filter = StatisticsFilter.ALL_TIME;
    this._moviesModel = moviesModel;
  }

  getTemplate() {
    return createStatisticsTemplate(this._moviesModel, this._filter);
  }

  recoveryListeners() {
    this.addFilterChangeHandler();
  }

  rerender() {
    super.rerender();
    this._chart = this._renderStatistics();
  }

  render() {
    this._chart = this._renderStatistics();
    this.addFilterChangeHandler();
  }

  addFilterChangeHandler() {
    this.getElement().querySelectorAll(`.statistic__filters-input`).forEach((element) => {
      element.addEventListener(`change`, (evt) => {
        this._filter = evt.target.value;
        this.rerender();
      });
    });
  }

  _getContext(genres) {
    this._context = this.getElement().querySelector(`.statistic__chart`).getContext(`2d`);

    this._context.height = BAR_HEIGHT * Object.keys(genres).length;

    return this._context;
  }

  _renderStatistics() {
    const genres = this._moviesModel.getGenresStatistics(this._filter);

    if (this._chart) {
      this._chart.destroy();
      this._context = null;
    }

    this._chart = new Chart(this._getContext(genres), {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(genres),
        datasets: [{
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`,
          data: Object.values(genres)
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });

    return this._chart;
  }
}

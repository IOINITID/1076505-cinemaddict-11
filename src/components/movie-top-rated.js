import AbstractComponent from "../components/abstract-components";

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
export default class MovieTopRated extends AbstractComponent {
  getTemplate() {
    return createMovieTopRatedTemplate();
  }
}

import AbstractComponent from "../components/abstract-components";

// Возвращает разметку блока фильмы
const createMoviesTemplate = () => {
  return (
    `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>
    </section>
  </section>`
  );
};

// Класс фильмы
export default class Movies extends AbstractComponent {
  getTemplate() {
    return createMoviesTemplate();
  }
}

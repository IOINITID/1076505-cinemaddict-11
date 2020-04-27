import AbstractComponent from "../components/abstract-components";

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
export default class MovieMostCommented extends AbstractComponent {
  getTemplate() {
    return createMovieMostCommentedTemplate();
  }
}

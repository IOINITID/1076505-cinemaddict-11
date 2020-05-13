import AbstractComponent from "./abstract-component";

const createMoviesMostCommentedTemplate = () => {
  return (
    `<section class="films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container"></div>
  </section>`
  );
};

export default class MoviesMostCommented extends AbstractComponent {
  getTemplate() {
    return createMoviesMostCommentedTemplate();
  }
}

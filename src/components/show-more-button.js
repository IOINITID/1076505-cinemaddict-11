import AbstractComponent from "../components/abstract-components";

// Возвращает разметку кнопки показать еще
const createShowMoreButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

// Класс кнопка показать еще
export default class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return createShowMoreButton();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}

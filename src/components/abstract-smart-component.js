import AbstractComponent from "../components/abstract-components";

export default class AbstractSmartComponent extends AbstractComponent {
  /**
   * Метод, который восстанавливает обработчики событий.
   */
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  /**
   * Метод, который перерисовывает компоненент с новыми данными.
   */
  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }
}

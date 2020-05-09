import {createElement} from "../utils/render";

/**
 * Класс (Абстрактного компонента | Abstract component).
 */
export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
  }

  /**
   * Метод, который возвращает строку с HTML разметкой.
   */
  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  /**
   * Метод, который возвращает DOM элемент из переданной HTML разметки.
   * @return {Element} элемент DOM.
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  /**
   * Метод, который удаляет элемент из памяти.
   */
  removeElement() {
    this._element = null;
  }
}

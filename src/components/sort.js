import AbstractComponent from "../components/abstract-components";

/**
 * Объявляет список со значениями типа сортировки.
 */
export const SortType = {
  DATE: `date`,
  RATING: `rating`,
  DEFAULT: `default`,
};

/**
 * Функция, которая возвращает разметку блока (Сортировка | Sort list).
 * @return {String} возвращает HTML разметку в виде строки.
 */
const createSortList = () => {
  return (
    `<ul class="sort">
    <li><a href="#" data-sort-type=${SortType.DEFAULT} class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type=${SortType.DATE} class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type=${SortType.RATING} class="sort__button">Sort by rating</a></li>
  </ul>`
  );
};

/**
 * Класс (Сортировка | Sort).
 */
export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortList();
  }

  /**
   * Метод, который возврашает текущий тип сортировки.
   * @return {String} строка, в которой указан тип сортировки.
   */
  getSortType() {
    return this._currentSortType;
  }

  /**
   * Метод, который очищает активное состояние у кнопок сортировки.
   */
  _clearActiveState() {
    this.getElement().querySelectorAll(`.sort__button`).forEach((element) => {
      element.classList.remove(`sort__button--active`);
    });
  }

  /**
   * Метод, который устанавливает новый тип сортировки.
   * @param {Function} handler функция, обработчик события, в которую передается текущий тип сортировки.
   */
  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      /**
       * Проверка, что элемент, на который нажали не ссылка.
       */
      if (evt.target.tagName !== `A`) {
        return;
      }

      /**
       * Объявление типа сортировки через дата атрибуты в разметке.
       */
      const sortType = evt.target.dataset.sortType;

      /**
       * Очистка активного состояния кнопок сортировки.
       */
      this._clearActiveState();

      /**
       * Добавление элементу, на который нажали, активного состояния кнопки сортировки.
       */
      evt.target.classList.add(`sort__button--active`);

      /**
       * Проверка, что текущая сортировка, не та, на которую нажали.
       */
      if (this._currentSortType === sortType) {
        return;
      }

      /**
       * объявление нового типа сортировки.
       */
      this._currentSortType = sortType;

      /**
       * Передача в функцию обработчика событий параметра с текущим типом сортировки.
       */
      handler(this._currentSortType);
    });
  }
}

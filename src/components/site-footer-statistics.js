import AbstractComponent from "../components/abstract-components";

/**
 * Функция, которая возвращает разметку блока (Статистика | Site footer statistics).
 * @param {Number} filmsCount количество фильмов всего.
 * @return {String} строка, содержащая HTML разметку.
 */
const createSiteFooterStatisctics = (filmsCount) => {
  return (
    `<p>${filmsCount} movies inside</p>`
  );
};

/**
 * Класс (Статистика | Site footer statistics).
 */
export default class SiteFooterStatisctics extends AbstractComponent {
  /**
   * Конструктор, принимающий параметры.
   * @param {Number} filmsCount количество фильмов.
   */
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  /**
   * Метод, который возвращает HTML разметку в виде строки.
   * @return {String} возвращает строку с HTML разметкой.
   */
  getTemplate() {
    return createSiteFooterStatisctics(this._filmsCount);
  }
}

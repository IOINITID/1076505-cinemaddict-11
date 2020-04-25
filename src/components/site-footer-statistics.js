import AbstractComponent from "../components/abstract-components";

// Возвращает разметку блока статистика
const createSiteFooterStatisctics = (FILMS_COUNT) => {
  return (
    `<p>${FILMS_COUNT} movies inside</p>`
  );
};

// Класс статистика
export default class SiteFooterStatisctics extends AbstractComponent {
  constructor(FILMS_COUNT) {
    super();

    this._filmsCount = FILMS_COUNT;
  }

  getTemplate() {
    return createSiteFooterStatisctics(this._filmsCount);
  }
}

import AbstractComponent from "./abstract-component";

const createSiteFooterStatisctics = (filmsCount) => {
  return (
    `<p>${filmsCount} movies inside</p>`
  );
};

export default class SiteFooterStatisctics extends AbstractComponent {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createSiteFooterStatisctics(this._filmsCount);
  }
}

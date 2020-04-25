import AbstractComponent from "../components/abstract-components";

// Возвращает разметку блока сортировка
const createSortList = () => {
  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
  );
};

// Класс сортировка
export default class Sort extends AbstractComponent {
  getTemplate() {
    return createSortList();
  }
}

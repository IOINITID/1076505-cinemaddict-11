import AbstractComponent from "../components/abstract-components";

/**
 * Функция, которая возвращает разметку блока (Звание пользователя | User rank).
 * @return {String} строка, содержащая HTML разметку.
 */
const createUserRank = () => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">Sci-Fighter</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

/**
 * Класс (Звание пользователя | User rank).
 */
export default class UserRank extends AbstractComponent {
  getTemplate() {
    return createUserRank();
  }
}

/**
 * Объявляет список позиций для отрисовки элементов.
 */
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

/**
 * Возвращает элемент DOM из разметки.
 * @param {String} template строка HTML разметки.
 * @return {Element} элемент DOM.
 */
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/**
 * Метод, который добавляет компоненты в DOM дерево.
 * @param {Element} container место, куда компонент будет добавлен.
 * @param {Object} component сам компонент, который будут добавлять.
 * @param {String} place позиция, как компонент будут добавлять.
 */
export const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.AFTEREND:
      container.after(component.getElement());
      break;
  }
};

/**
 * Функция, которая меняет местами переданные компоненты.
 * @param {Object} newComponent новый компонент.
 * @param {Object} oldComponent старый компонент.
 */
export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

/**
 * Метод, который удаляет компонент из DOM.
 * @param {Object} component компонент приложения, который будет удален.
 */
export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

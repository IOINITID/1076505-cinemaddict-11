export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getFirstSymbolUpperCase = (filterName) => {
  let filterNameUpperCase = ``;

  for (let i = 0; i < filterName.length; i++) {
    if (i === 0) {
      filterNameUpperCase += filterName[i].toUpperCase();
    } else {
      filterNameUpperCase += filterName[i];
    }
  }

  return filterNameUpperCase;
};

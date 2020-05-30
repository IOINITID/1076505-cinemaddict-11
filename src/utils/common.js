import {RatingLevel} from "../const";

export const getFirstSymbolUpperCase = (filterName) => {
  let filterNameUpperCase = ``;

  for (const char of filterName) {
    if (char === filterName[0]) {
      filterNameUpperCase += char.toUpperCase();
    } else {
      filterNameUpperCase += char;
    }
  }

  return filterNameUpperCase;
};

export const getRating = (moviesWatched) => {
  const moviesQuantity = moviesWatched.filter((movieData) => movieData.watched).length;

  if (moviesQuantity > 0 && moviesQuantity <= 10) {
    return RatingLevel.NOVICE;
  } else if (moviesQuantity > 10 && moviesQuantity <= 20) {
    return RatingLevel.FAN;
  } else if (moviesQuantity >= 21) {
    return RatingLevel.MOVIEBUFF;
  }

  return ``;
};

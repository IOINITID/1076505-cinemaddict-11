import {getRandomIntegerNumber, getRandomArrayItem} from "../utils/common";
import {
  FILM_DETAILS_DESCRIPTIONS,
  FILM_DETAILS_TITLES,
  FILM_DETAILS_POSTERS,
  FILM_DETAILS_DIRECTORS,
  FILM_DETAILS_WRITERS,
  FILM_DETAILS_GENRES,
  FILM_DETAILS_COUNTRIES,
  FILM_DETAILS_ACTORS,
  EMOJI_NAMES,
  COMMENT_TEXT,
  COMMENT_AUTHORS,
} from "../const";

// Возвращет подробное описанием фильма
export const generateFilmDetails = () => {
  return {
    title: getRandomArrayItem(FILM_DETAILS_TITLES),
    originalTitle: getRandomArrayItem(FILM_DETAILS_TITLES),
    rating: (Math.random() * 10).toFixed(1),
    image: getRandomArrayItem(FILM_DETAILS_POSTERS),
    age: `${getRandomIntegerNumber(1, 19)}+`,
    director: getRandomArrayItem(FILM_DETAILS_DIRECTORS),
    writers: generateFilmDetailsItems(FILM_DETAILS_WRITERS, FILM_DETAILS_WRITERS.length, `, `),
    actors: generateFilmDetailsItems(FILM_DETAILS_ACTORS, FILM_DETAILS_ACTORS.length, `, `),
    releaseDate: getCurrentFilmDetailsDate(),
    runtime: {
      hours: `${getRandomIntegerNumber(0, 3)}`,
      minutes: `${getRandomIntegerNumber(0, 60)}`,
    },
    country: getRandomArrayItem(FILM_DETAILS_COUNTRIES),
    genres: FILM_DETAILS_GENRES,
    description: generateFilmDetailsItems(FILM_DETAILS_DESCRIPTIONS, 6),
    comments: generateFilmsComments(getRandomIntegerNumber(0, 6)),
    state: {
      inWatchlist: Math.random() > 0.5,
      watched: Math.random() > 0.5,
      favorite: Math.random() > 0.5,
    }
  };
};

// Возвращает список подробных описаний фильмов
export const generateFilmsDetails = (count) => {
  return new Array(count).fill(``).map(generateFilmDetails);
};

// Возвращает комметарий к фильму
export const generateFilmComments = () => {
  return {
    emoji: getRandomArrayItem(EMOJI_NAMES),
    text: getRandomArrayItem(COMMENT_TEXT),
    author: getRandomArrayItem(COMMENT_AUTHORS),
    date: getCurrentFilmDetailsDate(),
  };
};

// Возвращает список комментариев к фильму
export const generateFilmsComments = (count) => {
  return new Array(count).fill(``).map(generateFilmComments);
};

// Возвращает случайное количество элементов списка
const generateFilmDetailsItems = (items, count, devider = ` `) => {
  let item = new Set();
  let itemCount = getRandomIntegerNumber(1, count);

  while (itemCount) {
    item.add(getRandomArrayItem(items));
    itemCount--;
  }

  return [...item].join(devider);
};

// Возвращает текущую дату
const getCurrentFilmDetailsDate = () => {
  const date = new Date();
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear() + Math.floor(Math.random() * 10),
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
};

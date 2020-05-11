import {
  getRandomIntegerNumber,
  getRandomArrayItem
} from "../utils/common";
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
    runtime: getFilmRuntime(),
    country: getRandomArrayItem(FILM_DETAILS_COUNTRIES),
    genres: FILM_DETAILS_GENRES,
    description: generateFilmDetailsItems(FILM_DETAILS_DESCRIPTIONS, 6),
    comments: generateFilmsComments(getRandomIntegerNumber(0, 6)),
    inWatchlist: Math.random() > 0.5,
    watched: Math.random() > 0.5,
    favorite: Math.random() > 0.5,
  };
};

export const generateFilmsDetails = (count) => {
  return new Array(count).fill(``).map(generateFilmDetails);
};

export const generateFilmComments = () => {
  return {
    emoji: getRandomArrayItem(EMOJI_NAMES),
    text: getRandomArrayItem(COMMENT_TEXT),
    author: getRandomArrayItem(COMMENT_AUTHORS),
    date: getCurrentFilmDetailsDate(),
    currentEmoji: null,
  };
};

export const generateFilmsComments = (count) => {
  return new Array(count).fill(``).map(generateFilmComments);
};

const generateFilmDetailsItems = (items, count, devider = ` `) => {
  let item = new Set();
  let itemCount = getRandomIntegerNumber(1, count);

  while (itemCount) {
    item.add(getRandomArrayItem(items));
    itemCount--;
  }

  return [...item].join(devider);
};

const getCurrentFilmDetailsDate = () => {
  const date = new Date();
  date.setFullYear(1950 + Math.floor(Math.random() * 50));
  return date;
};

const getFilmRuntime = () => {
  const time = new Date(0);

  time.setMinutes(Math.floor(Math.random() * (-180)));

  return time;
};

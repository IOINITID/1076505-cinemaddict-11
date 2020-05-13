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

export const generateMovieData = () => {
  return {
    id: String(new Date() + Math.random()),
    title: getRandomArrayItem(FILM_DETAILS_TITLES),
    originalTitle: getRandomArrayItem(FILM_DETAILS_TITLES),
    rating: (Math.random() * 10).toFixed(1),
    image: getRandomArrayItem(FILM_DETAILS_POSTERS),
    age: `${getRandomIntegerNumber(1, 19)}+`,
    director: getRandomArrayItem(FILM_DETAILS_DIRECTORS),
    writers: generateMovieDetailsItems(FILM_DETAILS_WRITERS, FILM_DETAILS_WRITERS.length, `, `),
    actors: generateMovieDetailsItems(FILM_DETAILS_ACTORS, FILM_DETAILS_ACTORS.length, `, `),
    releaseDate: getCurrentMovieDetailsDate(),
    runtime: getMovieRuntime(),
    country: getRandomArrayItem(FILM_DETAILS_COUNTRIES),
    genres: FILM_DETAILS_GENRES,
    description: generateMovieDetailsItems(FILM_DETAILS_DESCRIPTIONS, 6),
    comments: generateMovieComments(getRandomIntegerNumber(0, 6)),
    inWatchlist: Math.random() > 0.5,
    watched: Math.random() > 0.5,
    favorite: Math.random() > 0.5,
  };
};

export const generateMoviesData = (quantity) => {
  return new Array(quantity).fill(``).map(generateMovieData);
};

export const generateMovieComment = () => {
  return {
    emoji: getRandomArrayItem(EMOJI_NAMES),
    text: getRandomArrayItem(COMMENT_TEXT),
    author: getRandomArrayItem(COMMENT_AUTHORS),
    date: getCurrentMovieDetailsDate(),
  };
};

export const generateMovieComments = (quantity) => {
  return new Array(quantity).fill(``).map(generateMovieComment);
};

const generateMovieDetailsItems = (items, quantity, devider = ` `) => {
  let uniqueItems = new Set();
  let itemsQuantity = getRandomIntegerNumber(1, quantity);

  while (itemsQuantity) {
    uniqueItems.add(getRandomArrayItem(items));
    itemsQuantity--;
  }

  return [...uniqueItems].join(devider);
};

const getCurrentMovieDetailsDate = () => {
  const date = new Date();
  date.setFullYear(1950 + Math.floor(Math.random() * 50));

  return date;
};

const getMovieRuntime = () => {
  const time = new Date(0);
  time.setMinutes(Math.floor(Math.random() * (-180)));

  return time;
};

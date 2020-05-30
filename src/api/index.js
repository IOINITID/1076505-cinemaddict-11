import Comment from "../models/comment";
import Movie from "../models/movie";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const StatusCode = {
  OK: 200,
  REDIRECT: 300
};

const checkStatus = (response) => {
  if (response.status >= StatusCode.OK && response.status < StatusCode.REDIRECT) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(authorization, endPoint) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  getMovies() {
    return this._load({url: `movies`})
    .then((response) => response.json())
    .then(Movie.parseMovies)
    .catch((error) => {
      throw error;
    });
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
    .then((response) => response.json())
    .then(Comment.parseComments)
    .catch((error) => {
      throw error;
    });
  }

  updateMovie(id, data) {
    return this._load({
      url: `movies/${id}`,
      headers: new Headers({"Content-Type": `application/json`}),
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
    })
    .then((response) => response.json())
    .then(Movie.parseMovie)
    .catch((error) => {
      throw error;
    });
  }

  addComment(movieData, commentData) {
    return this._load({
      url: `comments/${movieData.id}`,
      headers: new Headers({"Content-Type": `application/json`}),
      method: `POST`,
      body: JSON.stringify(Comment.toRAW(commentData)),
    })
      .then((response) => response.json())
      .then(({movie, comments}) => {
        return {
          movie: Movie.parseMovie(movie),
          comments: Comment.parseComments(comments)
        };
      })
      .catch((error) => {
        throw error;
      });
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: `DELETE`,
    });
  }

  sync(moviesData) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(moviesData),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}

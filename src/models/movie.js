export default class Movie {
  constructor(movieData) {
    this.id = movieData.id;
    this.title = movieData.film_info.title;
    this.originalTitle = movieData.film_info.alternative_title;
    this.rating = movieData.film_info.total_rating;
    this.image = movieData.film_info.poster;
    this.age = movieData.film_info.age_rating;
    this.director = movieData.film_info.director;
    this.writters = movieData.film_info.writers;
    this.actors = movieData.film_info.actors;
    this.releaseDate = movieData.film_info.release.date;
    this.runtime = movieData.film_info.runtime;
    this.country = movieData.film_info.release.release_country;
    this.genres = movieData.film_info.genre;
    this.description = movieData.film_info.description;
    this.comments = movieData.comments;
    this.inWatchlist = movieData.user_details.watchlist;
    this.watched = movieData.user_details.already_watched;
    this.favorite = movieData.user_details.favorite;
    this.watchingDate = movieData.user_details.watching_date;
  }

  toRAW() {
    return {
      "id": this.id,
      "film_info": {
        "title": this.title,
        "genre": this.genres,
        "poster": this.image,
        "age_rating": this.age,
        "alternative_title": this.originalTitle,
        "director": this.director,
        "actors": this.actors,
        "writers": this.writers,
        "release": {
          "release_country": this.country,
          "date": this.releaseDate
        },
        "total_rating": this.rating,
        "runtime": this.runtime,
        "description": this.description,
      },
      "user_details": {
        "watchlist": this.inWatchlist,
        "already_watched": this.watched,
        "watching_date": this.watchingDate ? this.watchingDate : null,
        "favorite": this.favorite
      },
      "comments": this.comments
    };
  }

  static clone(movieData) {
    return new Movie(movieData.toRAW());
  }

  static parseMovie(movieData) {
    return new Movie(movieData);
  }

  static parseMovies(movieData) {
    return movieData.map(Movie.parseMovie);
  }
}

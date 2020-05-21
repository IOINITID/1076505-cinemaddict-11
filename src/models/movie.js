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

  static parseMovie(movieData) {
    return new Movie(movieData);
  }

  static parseMovies(movieData) {
    return movieData.map(Movie.parseMovie);
  }
}

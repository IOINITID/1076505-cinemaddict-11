export default class Comment {
  constructor(commentData) {
    this.id = commentData.id;
    this.emoji = commentData.emotion;
    this.text = commentData.comment;
    this.author = commentData.author;
    this.date = commentData.date;
  }

  static toRAW(comment) {
    return {
      "comment": comment.text,
      "date": comment.date,
      "emotion": comment.emoji,
    };
  }

  static parseComment(commentData) {
    return new Comment(commentData);
  }

  static parseComments(commentData) {
    return commentData.map(Comment.parseComment);
  }
}

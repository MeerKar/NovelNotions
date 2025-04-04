const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    books: [Book]
    clubs: [Club]
  }

  type Book {
    _id: ID!
    title: String!
    author: String!
    book_image: String
    description: String
    primary_isbn10: String
    primary_isbn13: String
    publisher: String
    rank: Int
    rank_last_week: Int
    weeks_on_list: Int
    price: String
    amazon_product_url: String
    createdAt: String
    users: [User]
    ratings: [Rating]
    reviews: [Review]
  }

  type Review {
    _id: ID!
    bookId: ID!
    reviewText: String!
    rating: Int
    user: User!
    createdAt: String
  }

  type Club {
    _id: ID
    name: String!
    description: String
    category: String
    image: String
    books: [Book]
    users: [User]
    createdAt: String
    updatedAt: String
  }

  type Rating {
    _id: ID
    value: Int
    userId: ID!
    bookId: ID!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    books: [Book]
    book(_id: ID!): Book
    bookByIsbn(isbn: String!): Book
    bookByTitle(title: String!): Book
    clubs: [Club]
    club(clubId: ID!): Club
    me: User
    reviews: [Review]
    review(reviewId: ID!): Review
    bookReviews(bookId: ID!): [Review]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addBook(title: String!, author: String!, book_image: String, description: String, primary_isbn10: String): Book
    addReview(bookId: ID!, reviewText: String!, rating: Int): Review
    addClub(name: String!): Club
    addBookToClub(clubId: ID!, bookId: ID!): Club
    addUserToClub(clubId: ID!): Club
    addRating(value: Int!, bookId: ID!): Rating
    removeBook(bookId: ID!): Book
    removeReview(bookId: ID!, reviewId: ID!): Book
    removeRating(ratingId: ID!): Rating
    addToBookshelf(bookId: ID!): User
    createClub(name: String!, description: String!, category: String!, image: String): Club
    updateClub(id: ID!, name: String, description: String, category: String, image: String): Club
    deleteClub(id: ID!): Club
    joinClub(clubId: ID!): Club
    leaveClub(clubId: ID!): Club
    removeBookFromClub(clubId: ID!, bookId: ID!): Club
  }
`;

module.exports = typeDefs;

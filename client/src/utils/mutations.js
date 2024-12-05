import { gql } from "@apollo/client";

// User Authentication Mutations
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const EDIT_USER = gql`
  mutation editUser(
    $id: ID!
    $username: String
    $email: String
    $password: String
  ) {
    editUser(id: $id, username: $username, email: $email, password: $password) {
      _id
      username
      email
    }
  }
`;

// Book Management Mutations
export const ADD_BOOK = gql`
  mutation addBook($title: String!, $authors: [String!]!, $description: String!, $image: String, $link: String) {
    addBook(title: $title, authors: $authors, description: $description, image: $image, link: $link) {
      _id
      title
      authors
      description
      image
      link
    }
  }
`;

export const EDIT_BOOK = gql`
  mutation editBook($id: ID!, $title: String, $authors: [String!], $description: String, $image: String, $link: String) {
    editBook(id: $id, title: $title, authors: $authors, description: $description, image: $image, link: $link) {
      _id
      title
      authors
      description
      image
      link
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      title
    }
  }
`;

// Review Management Mutations
export const ADD_REVIEW = gql`
  mutation addReview($bookId: ID!, $reviewText: String!) {
    addReview(bookId: $bookId, reviewText: $reviewText) {
      _id
      reviewText
      createdAt
      username
    }
  }
`;

export const EDIT_REVIEW = gql`
  mutation editReview($id: ID!, $reviewText: String!) {
    editReview(id: $id, reviewText: $reviewText) {
      _id
      reviewText
      createdAt
    }
  }
`;

export const REMOVE_REVIEW = gql`
  mutation removeReview($reviewId: ID!) {
    removeReview(reviewId: $reviewId) {
      _id
      reviewText
    }
  }
`;

// Club Management Mutations
export const CREATE_CLUB = gql`
  mutation createClub(
    $name: String!
    $description: String!
    $category: String!
    $image: String
  ) {
    createClub(
      name: $name
      description: $description
      category: $category
      image: $image
    ) {
      _id
      name
      description
      category
      image
      books {
        _id
        title
      }
      users {
        _id
        username
      }
    }
  }
`;

export const UPDATE_CLUB = gql`
  mutation updateClub(
    $id: ID!
    $name: String
    $description: String
    $category: String
    $image: String
  ) {
    updateClub(
      id: $id
      name: $name
      description: $description
      category: $category
      image: $image
    ) {
      _id
      name
      description
      category
      image
    }
  }
`;

export const DELETE_CLUB = gql`
  mutation deleteClub($id: ID!) {
    deleteClub(id: $id) {
      _id
      name
    }
  }
`;

export const JOIN_CLUB = gql`
  mutation joinClub($clubId: ID!) {
    joinClub(clubId: $clubId) {
      _id
      name
      users {
        _id
        username
      }
    }
  }
`;

export const LEAVE_CLUB = gql`
  mutation leaveClub($clubId: ID!) {
    leaveClub(clubId: $clubId) {
      _id
      name
      users {
        _id
        username
      }
    }
  }
`;

// Add Book to Club
export const ADD_BOOK_TO_CLUB = gql`
  mutation addBookToClub($clubId: ID!, $bookId: ID!) {
    addBookToClub(clubId: $clubId, bookId: $bookId) {
      _id
      name
      books {
        _id
        title
      }
    }
  }
`;

// Add User to Club
export const ADD_USER_TO_CLUB = gql`
  mutation addUserToClub($clubId: ID!, $userId: ID!) {
    addUserToClub(clubId: $clubId, userId: $userId) {
      _id
      name
      users {
        _id
        username
      }
    }
  }
`;

// Rating Mutations
export const ADD_RATING = gql`
  mutation addRating($value: Int!, $userId: ID!, $bookId: ID!) {
    addRating(value: $value, userId: $userId, bookId: $bookId) {
      _id
      value
      userId
      bookId
    }
  }
`;

export const EDIT_RATING = gql`
  mutation editRating($id: ID!, $value: Int!) {
    editRating(id: $id, value: $value) {
      _id
      value
    }
  }
`;

export const REMOVE_RATING = gql`
  mutation removeRating($ratingId: ID!) {
    removeRating(ratingId: $ratingId) {
      _id
      value
    }
  }
`;

// Add Book to Bookshelf
export const ADD_TO_BOOKSHELF = gql`
  mutation addToBookshelf($bookId: ID!) {
    addToBookshelf(bookId: $bookId) {
      _id
      title
      author
      image
    }
  }
`;

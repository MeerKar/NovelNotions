import { gql } from "@apollo/client";

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
// Add Book Mutation
export const ADD_BOOK = gql`
  mutation AddBook($bookId: ID!) {
    addBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        _id
        title
        authors
        description
        image
        link
      }
      createdAt
    }
  }
`;

export const EDIT_BOOK = gql`
  mutation editBook($id: ID!, $title: String, $author: String) {
    editBook(id: $id, title: $title, author: $author) {
      _id
      title
      author
    }
  }
`;

// export const ADD_COMMENT = gql`
//   mutation addComment($bookId: ID!, $commentText: String!) {
//     addComment(
//       bookId: $bookId
//       commentText: $commentText
//       commentAuthor: $commentAuthor
//     ) {
//       _id
//       title
//       author
//       createdAt
//       comments {
//         _id
//         commentText
//         commentAuthor
//         createdAt
//       }
//     }
//   }
// `;
// Add Review Mutation
export const ADD_REVIEW = gql`
  mutation AddReview($bookId: ID!, $reviewText: String!, $userId: ID!) {
    addReview(bookId: $bookId, reviewText: $reviewText, userId: $userId) {
      _id
      reviewText
      createdAt
      username
    }
  }
`;

export const EDIT_REVIEW = gql`
  mutation editReview($id: ID!, $reviewText: String) {
    editReview(id: $id, reviewText: $reviewText) {
      _id
      text
      authorId
      createdAt
      bookId
    }
  }
`;

export const ADD_CLUB = gql`
  mutation addClub($name: String!) {
    addClub(name: $name) {
      _id
      name
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

export const EDIT_CLUB = gql`
  mutation editClub($id: ID!, $name: String) {
    editClub(id: $id, name: $name) {
      _id
      name
    }
  }
`;

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
      image
      category
      books {
        _id
        title
        author
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
    $clubId: ID!
    $name: String
    $description: String
    $category: String
    $image: String
  ) {
    updateClub(
      clubId: $clubId
      name: $name
      description: $description
      category: $category
      image: $image
    ) {
      _id
      name
      description
      image
      category
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

export const ADD_BOOK_TO_CLUB = gql`
  mutation addBookToClub($clubId: ID!, $bookId: ID!) {
    addBookToClub(clubId: $clubId, bookId: $bookId) {
      _id
      name
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

export const ADD_USER_TO_CLUB = gql`
  mutation addUserToClub($clubId: ID!, $userId: ID!) {
    addUserToClub(clubId: $clubId, userId: $userId) {
      _id
      name
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

export const ADD_RATING = gql`
  mutation addRating($value: Int!, $userId: ID!, $clubId: ID!, $bookId: ID!) {
    addRating(
      value: $value
      userId: $userId
      clubId: $clubId
      bookId: $bookId
    ) {
      _id
      value
      userId
      clubId
      bookId
    }
  }
`;

export const EDIT_RATING = gql`
  mutation editRating($id: ID!, $value: Int) {
    editRating(id: $id, value: $value) {
      _id
      value
      userId
      clubId
      bookId
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        _id
        title
        authors
        description
        image
        link
      }
      createdAt
    }
  }
`;

export const REMOVE_REVIEW = gql`
  mutation removeReview($bookId: ID!, $reviewId: ID!) {
    removeReview(bookId: $bookId, reviewId: $reviewId) {
      _id
      text
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
export const ADD_TO_BOOKSHELF = gql`
  mutation addToBookshelf($bookId: ID!, $userId: ID!) {
    addToBookshelf(bookId: $bookId, userId: $userId) {
      _id
      title
      author
      image
      createdAt
    }
  }
`;

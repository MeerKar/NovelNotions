// src/utils/queries.js

import { gql } from "@apollo/client";

// User Queries
//user
export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      books {
        _id
        title
        author
        createdAt
      }
      clubs {
        _id
        name
      }
    }
  }
`;

export const QUERY_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
      books {
        _id
        title
        author
        image
        createdAt
      }
    }
  }
`;

// Book Queries
export const QUERY_BOOKS = gql`
  query GetBooks {
    books {
      _id
      title
      author
      image
      reviews {
        _id
        reviewText
        userId
      }
      createdAt
    }
  }
`;

export const QUERY_SINGLE_BOOK = gql`
  query GetSingleBook($bookId: ID!) {
    book(bookId: $bookId) {
      _id
      title
      author
      image
      description
      createdAt
      links {
        site
        url
      }
      reviews {
        user
        comment
      }
    }
  }
`;

export const QUERY_BOOK_BY_TITLE = gql`
  query GetBookByTitle($title: String!) {
    bookByTitle(title: $title) {
      _id
      title
      author
      image
      review
      rating
      createdAt
      bookReviewAuthor
      comments {
        _id
        commentText
        commentAuthor
        createdAt
      }
    }
  }
`;

export const QUERY_CLUBS = gql`
  query getClubs {
    clubs {
      _id
      name
      description
      image
      category
      books {
        _id
        title
        author
        description
        primary_isbn10
        book_image
      }
      users {
        _id
        username
        avatarUrl
      }
    }
  }
`;

export const QUERY_SINGLE_CLUB = gql`
  query singleClub($clubId: ID!) {
    club(_id: $clubId) {
      _id
      name
      description
      image
      category
      books {
        _id
        title
        author
        description
        primary_isbn10
        book_image
      }
      users {
        _id
        username
        avatarUrl
      }
    }
  }
`;

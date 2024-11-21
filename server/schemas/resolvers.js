// server/resolvers.js

const { User, Book, Club, Review, Rating } = require("../models");
const { signToken } = require("../utils/auth");
const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");

const resolvers = {
  Query: {
    users: async () => {
      try {
        return await User.find().populate("books").populate("clubs");
      } catch (error) {
        throw new Error("Failed to fetch users");
      }
    },
    user: async (parent, { username }) => {
      try {
        return await User.findOne({ username })
          .populate("books")
          .populate("clubs");
      } catch (error) {
        throw new Error("Failed to fetch user");
      }
    },
    books: async () => {
      try {
        return await Book.find()
          .populate("users")
          .populate("ratings")
          .populate("reviews");
      } catch (error) {
        throw new Error("Failed to fetch books");
      }
    },
    book: async (parent, { bookId }) => {
      try {
        return await Book.findOne({ _id: bookId })
          .populate("users")
          .populate("ratings")
          .populate("reviews");
      } catch (error) {
        throw new Error("Failed to fetch book");
      }
    },
    bookByTitle: async (parent, { title }) => {
      try {
        return await Book.findOne({ title })
          .populate("users")
          .populate("ratings")
          .populate("reviews");
      } catch (error) {
        throw new Error("Failed to fetch book by title");
      }
    },
    clubs: async () => {
      try {
        return await Club.find().populate("books").populate("users");
      } catch (error) {
        throw new Error("Failed to fetch clubs");
      }
    },
    club: async (parent, { clubId }) => {
      try {
        return await Club.findOne({ _id: clubId })
          .populate("books")
          .populate("users");
      } catch (error) {
        throw new Error("Failed to fetch club");
      }
    },
    me: async (parent, args, context) => {
      if (context.user) {
        try {
          return await User.findOne({ _id: context.user._id })
            .populate("books")
            .populate("clubs");
        } catch (error) {
          throw new Error("Failed to fetch user data");
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    reviews: async () => {
      try {
        return await Review.find().populate();
      } catch (error) {
        throw new Error("Failed to fetch reviews");
      }
    },
    review: async (parent, { reviewId }) => {
      try {
        return await Review.findOne({ _id: reviewId }).populate();
      } catch (error) {
        throw new Error("Failed to fetch review");
      }
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        if (error.code === 11000) {
          throw new UserInputError("Username or email already exists");
        }
        throw new Error("Failed to create user");
      }
    },
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new AuthenticationError(
            "No user found with this email address"
          );
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new AuthenticationError("Incorrect credentials");
        }

        const token = signToken(user);
        return { token, user };
      } catch (error) {
        throw new AuthenticationError(error.message);
      }
    },
    addBook: async (parent, { title, author, image, description }) => {
      try {
        const book = await Book.create({
          title,
          author,
          book_image: image,
          description,
        });
        return book;
      } catch (error) {
        throw new Error("Failed to add book");
      }
    },
    addReview: async (parent, { bookId, reviewText }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        if (!bookId || !reviewText) {
          throw new UserInputError("All fields are required");
        }

        const review = await Review.create({
          bookId,
          reviewText,
          userId: context.user._id,
          username: context.user.username,
        });

        // Add review to the book's reviews array
        await Book.findByIdAndUpdate(bookId, {
          $push: { reviews: review._id },
        });

        return review;
      } catch (error) {
        throw new Error("Failed to add review");
      }
    },
    addClub: async (parent, { name }) => {
      try {
        const club = await Club.create({ name });
        return club;
      } catch (error) {
        throw new Error("Failed to add club");
      }
    },
    addBookToClub: async (parent, { clubId, bookId }, context) => {
      try {
        const updatedClub = await Club.findOneAndUpdate(
          { _id: clubId },
          { $addToSet: { books: bookId } },
          { new: true }
        )
          .populate("books")
          .populate("users");
        return updatedClub;
      } catch (error) {
        throw new Error("Failed to add book to club");
      }
    },
    addUserToClub: async (parent, { clubId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const updatedClub = await Club.findOneAndUpdate(
          { _id: clubId },
          { $addToSet: { users: context.user._id } },
          { new: true }
        )
          .populate("books")
          .populate("users");
        return updatedClub;
      } catch (error) {
        throw new Error("Failed to add user to club");
      }
    },
    addRating: async (parent, { value, bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const rating = await Rating.create({
          value,
          userId: context.user._id,
          bookId,
        });
        return rating;
      } catch (error) {
        throw new Error("Failed to add rating");
      }
    },
    removeBook: async (parent, { bookId }) => {
      try {
        const book = await Book.findOneAndDelete({ _id: bookId });
        return book;
      } catch (error) {
        throw new Error("Failed to remove book");
      }
    },
    removeReview: async (parent, { bookId, reviewId }) => {
      try {
        const book = await Book.findOneAndUpdate(
          { _id: bookId },
          {
            $pull: {
              reviews: { _id: reviewId },
            },
          },
          { new: true, runValidators: true }
        ).populate("reviews");
        return book;
      } catch (error) {
        throw new Error("Failed to remove review");
      }
    },
    removeRating: async (parent, { ratingId }) => {
      try {
        const rating = await Rating.findOneAndDelete({ _id: ratingId });
        return rating;
      } catch (error) {
        throw new Error("Failed to remove rating");
      }
    },
    addToBookshelf: async (parent, { bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { books: bookId } },
          { new: true }
        ).populate("books");
        return updatedUser;
      } catch (error) {
        throw new Error("Failed to add book to bookshelf");
      }
    },
  },
};

module.exports = resolvers;

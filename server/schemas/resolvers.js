// server/resolvers.js

const { User, Book, Club, Review, Rating } = require("../models");
const { signToken } = require("../utils/auth");
const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const axios = require("axios");

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
    book: async (parent, { _id }) => {
      try {
        return await Book.findById(_id);
      } catch (error) {
        throw new Error(`Failed to fetch book: ${error.message}`);
      }
    },
    bookByIsbn: async (parent, { isbn }) => {
      try {
        // First try to find the book in our database
        let book = await Book.findOne({ primary_isbn10: isbn })
          .populate({
            path: "reviews",
            populate: {
              path: "user",
              select: "username",
            },
          })
          .populate("ratings");

        // If book not found in database, fetch from NYT API
        if (!book) {
          // List of NYT bestseller lists to search through
          const lists = [
            "hardcover-fiction",
            "hardcover-nonfiction",
            "trade-fiction-paperback",
            "paperback-nonfiction",
            "young-adult-hardcover",
            "childrens-middle-grade-hardcover",
          ];

          // Try each list until we find the book
          for (const list of lists) {
            try {
              const response = await axios.get(
                `https://api.nytimes.com/svc/books/v3/lists/current/${list}.json?api-key=${process.env.NYT_API_KEY}`
              );

              const nytBook = response.data.results.books.find(
                (b) => b.primary_isbn10 === isbn || b.primary_isbn13 === isbn
              );

              if (nytBook) {
                // Create new book in our database
                book = await Book.create({
                  title: nytBook.title,
                  author: nytBook.author,
                  description: nytBook.description,
                  primary_isbn10: nytBook.primary_isbn10,
                  primary_isbn13: nytBook.primary_isbn13,
                  publisher: nytBook.publisher,
                  rank: nytBook.rank,
                  rank_last_week: nytBook.rank_last_week,
                  weeks_on_list: nytBook.weeks_on_list,
                  price: nytBook.price,
                  book_image: nytBook.book_image,
                  amazon_product_url: nytBook.amazon_product_url,
                });
                break; // Exit the loop once we find the book
              }
            } catch (error) {
              console.error(`Error fetching from ${list} list:`, error.message);
              continue; // Try the next list
            }
          }
        }

        if (!book) {
          throw new Error("Book not found in any NYT bestseller list");
        }

        return book;
      } catch (error) {
        throw new Error(`Failed to fetch book by ISBN: ${error.message}`);
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
    bookReviews: async (parent, { bookId }) => {
      try {
        const book = await Book.findById(bookId).populate({
          path: "reviews",
          populate: {
            path: "user",
            select: "username",
          },
        });
        return book.reviews;
      } catch (error) {
        console.error("Error fetching book reviews:", error);
        throw new Error("Failed to fetch book reviews");
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
    addReview: async (parent, { bookId, reviewText, rating }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        if (!bookId || !reviewText) {
          throw new UserInputError("All fields are required");
        }

        console.log("Creating review with data:", {
          bookId,
          reviewText,
          rating,
          userId: context.user._id,
        });

        // First, check if the book exists in our database
        let book = await Book.findOne({
          $or: [{ primary_isbn10: bookId }, { primary_isbn13: bookId }],
        });

        console.log("Found book:", book);

        // If book doesn't exist, create it
        if (!book) {
          // Try to fetch from Google Books API
          const googleBooksResponse = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${bookId}`
          );

          let bookData = {
            title: "Unknown Title",
            author: "Unknown Author",
            description: "No description available.",
            primary_isbn10: bookId,
            book_image: "https://via.placeholder.com/200x300?text=No+Cover",
          };

          if (
            googleBooksResponse.data.items &&
            googleBooksResponse.data.items[0]
          ) {
            const bookInfo = googleBooksResponse.data.items[0].volumeInfo;
            bookData = {
              title: bookInfo.title || bookData.title,
              author: bookInfo.authors?.[0] || bookData.author,
              description: bookInfo.description || bookData.description,
              primary_isbn10: bookId,
              primary_isbn13: bookInfo.industryIdentifiers?.find(
                (id) => id.type === "ISBN_13"
              )?.identifier,
              book_image:
                bookInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
                bookData.book_image,
              publisher: bookInfo.publisher,
            };
          }

          console.log("Creating new book:", bookData);
          book = await Book.create(bookData);
          console.log("Created book:", book);
        }

        // Create the review
        const review = await Review.create({
          bookId: book._id, // Use the MongoDB _id instead of ISBN
          reviewText,
          rating,
          user: context.user._id,
        });

        console.log("Created review:", review);

        // Add review to the book's reviews array
        const updatedBook = await Book.findByIdAndUpdate(
          book._id,
          {
            $push: { reviews: review._id },
          },
          { new: true }
        ).populate("reviews");

        console.log("Updated book with review:", updatedBook);

        // Populate the user field before returning
        const populatedReview = await Review.findById(review._id).populate(
          "user"
        );

        console.log("Final populated review:", populatedReview);
        return populatedReview;
      } catch (error) {
        console.error("Error adding review:", error);
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
    createClub: async (
      parent,
      { name, description, category, image },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const club = await Club.create({
          name,
          description,
          category,
          image,
          users: [context.user._id],
        });
        return club;
      } catch (error) {
        throw new Error("Failed to create club");
      }
    },
    updateClub: async (
      parent,
      { id, name, description, category, image },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const club = await Club.findOneAndUpdate(
          { _id: id, users: context.user._id },
          { name, description, category, image },
          { new: true }
        )
          .populate("books")
          .populate("users");

        if (!club) {
          throw new Error(
            "Club not found or you don't have permission to update it"
          );
        }

        return club;
      } catch (error) {
        throw new Error("Failed to update club");
      }
    },
    deleteClub: async (parent, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const club = await Club.findOneAndDelete({
          _id: id,
          users: context.user._id,
        });
        if (!club) {
          throw new Error(
            "Club not found or you don't have permission to delete it"
          );
        }
        return club;
      } catch (error) {
        throw new Error("Failed to delete club");
      }
    },
    joinClub: async (parent, { clubId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const club = await Club.findOneAndUpdate(
          { _id: clubId },
          { $addToSet: { users: context.user._id } },
          { new: true }
        )
          .populate("books")
          .populate("users");

        if (!club) {
          throw new Error("Club not found");
        }

        return club;
      } catch (error) {
        throw new Error("Failed to join club");
      }
    },
    leaveClub: async (parent, { clubId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const club = await Club.findOneAndUpdate(
          { _id: clubId },
          { $pull: { users: context.user._id } },
          { new: true }
        )
          .populate("books")
          .populate("users");

        if (!club) {
          throw new Error("Club not found");
        }

        return club;
      } catch (error) {
        throw new Error("Failed to leave club");
      }
    },
    removeBookFromClub: async (parent, { clubId, bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      try {
        const club = await Club.findOneAndUpdate(
          { _id: clubId, users: context.user._id },
          { $pull: { books: bookId } },
          { new: true }
        )
          .populate("books")
          .populate("users");

        if (!club) {
          throw new Error(
            "Club not found or you don't have permission to modify it"
          );
        }

        return club;
      } catch (error) {
        throw new Error("Failed to remove book from club");
      }
    },
  },
};

module.exports = resolvers;

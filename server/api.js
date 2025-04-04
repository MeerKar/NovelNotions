const express = require("express");
const axios = require("axios");
const router = express.Router();
const { Club, User } = require("./models");
const { authMiddleware } = require("./utils/auth");

// Load API key from environment variable
const API_KEY = process.env.NYT_API_KEY;
const BASE_URL = "https://api.nytimes.com/svc/books/v3/lists/";

// Log API key status (without revealing the key)
console.log("API Key status:", API_KEY ? "Present" : "Missing");

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Middleware to check API key
const checkApiKey = (req, res, next) => {
  if (!API_KEY) {
    console.error("NYT API key is not configured");
    return res.status(500).json({
      error: "API configuration error",
      message:
        "NYT API key is not properly configured. Please check your environment variables.",
      details: "The API_KEY environment variable is missing or empty.",
    });
  }
  next();
};

// Log all incoming requests
router.use((req, res, next) => {
  console.log(`API Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Bestseller routes
router.get("/bestsellers/:listName", checkApiKey, async (req, res) => {
  const { listName } = req.params;
  console.log(`Fetching bestsellers for list: ${listName}`);

  try {
    // Check cache first
    const cacheKey = `bestsellers-${listName}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Returning cached data for ${listName}`);
      return res.json(cachedData.data);
    }

    console.log(`Making request to NYT API for ${listName}...`);
    const apiUrl = `${BASE_URL}current/${listName}.json?api-key=${API_KEY}`;
    console.log("API URL (without key):", apiUrl.replace(API_KEY, "API_KEY"));

    const response = await axios.get(apiUrl, {
      timeout: 10000, // 10 second timeout
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.data?.results?.books) {
      console.error("Invalid response format:", response.data);
      throw new Error("Invalid response format from NYT API");
    }

    // Cache the response
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: response.data.results.books,
    });

    console.log(`Successfully fetched and cached data for ${listName}`);
    res.json(response.data.results.books);
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
    res.status(500).json({
      error: "Failed to fetch bestsellers",
      message: error.message,
    });
  }
});

// Clubs routes
router.get("/clubs", authMiddleware, async (req, res) => {
  try {
    const clubs = await Club.find().populate("members").populate("books");
    res.json(clubs);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({
      error: "Failed to fetch clubs",
      message: error.message,
    });
  }
});

// My reads routes
router.get("/my-reads", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("books");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.books);
  } catch (error) {
    console.error("Error fetching user's books:", error);
    res.status(500).json({
      error: "Failed to fetch user's books",
      message: error.message,
    });
  }
});

// Book lookup by ISBN
router.get("/books/:isbn", checkApiKey, async (req, res) => {
  const { isbn } = req.params;
  console.log(`Looking up book with ISBN: ${isbn}`);

  try {
    // Check cache first
    const cacheKey = `book-${isbn}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log(`Returning cached data for ISBN ${isbn}`);
      return res.json(cachedData.data);
    }

    // List of categories to search through
    const categories = [
      "hardcover-fiction",
      "hardcover-nonfiction",
      "trade-fiction-paperback",
      "paperback-nonfiction",
      "young-adult-hardcover",
      "childrens-middle-grade-hardcover",
    ];

    let foundBook = null;

    // Search through each category
    for (const category of categories) {
      console.log(`Searching in ${category} for ISBN ${isbn}...`);
      const apiUrl = `${BASE_URL}current/${category}.json?api-key=${API_KEY}`;

      const response = await axios.get(apiUrl, {
        timeout: 10000,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.data?.results?.books) {
        foundBook = response.data.results.books.find(
          (book) => book.primary_isbn10 === isbn || book.primary_isbn13 === isbn
        );

        if (foundBook) {
          console.log(`Found book in ${category}`);
          break;
        }
      }
    }

    if (foundBook) {
      // Cache the found book
      cache.set(cacheKey, {
        timestamp: Date.now(),
        data: foundBook,
      });
      res.json(foundBook);
    } else {
      res.status(404).json({
        error: "Book not found",
        message: "Book not found in any current NYT Bestseller list",
      });
    }
  } catch (error) {
    console.error("Error looking up book:", error);
    res.status(500).json({
      error: "Failed to lookup book",
      message: error.message,
    });
  }
});

module.exports = router;

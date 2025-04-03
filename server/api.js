const express = require("express");
const axios = require("axios");
const router = express.Router();

// Load API key from environment variable
const API_KEY = process.env.NYT_API_KEY;
const BASE_URL = "https://api.nytimes.com/svc/books/v3/lists/current/";

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Middleware to check API key
const checkApiKey = (req, res, next) => {
  if (!API_KEY) {
    console.error("NYT API key is not configured");
    return res.status(500).json({
      error: "API configuration error",
      message: "NYT API key is not properly configured",
    });
  }
  next();
};

router.get("/bestsellers/:listName", checkApiKey, async (req, res) => {
  const { listName } = req.params;

  try {
    // Check cache first
    const cacheKey = `bestsellers-${listName}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return res.json(cachedData.data);
    }

    console.log(`Fetching best sellers for list: ${listName}`);
    const response = await axios.get(
      `${BASE_URL}${listName}.json?api-key=${API_KEY}`,
      {
        timeout: 5000, // 5 second timeout
      }
    );

    if (!response.data?.results?.books) {
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
    console.error("Error fetching best sellers data:", error.message);

    if (error.response) {
      // API responded with an error
      res.status(error.response.status || 500).json({
        error: "NYT API error",
        message: error.response.data?.message || error.response.statusText,
      });
    } else if (error.request) {
      // Request timeout or network error
      res.status(503).json({
        error: "Service unavailable",
        message: "Failed to reach NYT API. Please try again later.",
      });
    } else {
      // Other errors
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
});

module.exports = router;

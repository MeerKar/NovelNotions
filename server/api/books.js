const router = require("express").Router();
const axios = require("axios");
const cache = require("memory-cache");

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const NYT_API_KEY = process.env.NYT_API_KEY;
const NYT_API_BASE = "https://api.nytimes.com/svc/books/v3/lists/current";

const LISTS = [
  "hardcover-fiction",
  "hardcover-nonfiction",
  "trade-fiction-paperback",
  "paperback-nonfiction",
  "young-adult-hardcover",
  "childrens-middle-grade-hardcover",
];

router.get("/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;

    // Check cache first
    const cachedBook = cache.get(`book-${isbn}`);
    if (cachedBook) {
      return res.json(cachedBook);
    }

    // Search through all lists
    for (const list of LISTS) {
      try {
        const response = await axios.get(
          `${NYT_API_BASE}/${list}.json?api-key=${NYT_API_KEY}`
        );
        const books = response.data.results.books;

        const book = books.find(
          (b) => b.primary_isbn10 === isbn || b.primary_isbn13 === isbn
        );

        if (book) {
          // Cache the result
          cache.put(`book-${isbn}`, book, CACHE_DURATION);
          return res.json(book);
        }
      } catch (error) {
        console.error(`Error fetching list ${list}:`, error.message);
        // Continue to next list on error
      }
    }

    // If we get here, book wasn't found in any list
    return res.status(404).json({
      message: "Book not found in current NYT Bestseller lists",
      details: `ISBN: ${isbn}`,
    });
  } catch (error) {
    console.error("Error in /api/books/:isbn:", error);
    res.status(500).json({
      message: "Server error while searching for book",
      error: error.message,
    });
  }
});

module.exports = router;

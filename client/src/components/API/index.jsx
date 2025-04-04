import axios from "axios";

const BASE_URL = "/api/bestsellers/";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const isCacheValid = (cachedData) => {
  if (!cachedData) return false;
  try {
    const { timestamp, data } = JSON.parse(cachedData);
    return Date.now() - timestamp < CACHE_DURATION && Array.isArray(data);
  } catch (error) {
    console.error("Cache validation error:", error);
    return false;
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchBestSellers = async (listName, { signal } = {}) => {
  // Check cache first
  try {
    const cachedData = localStorage.getItem(listName);
    if (cachedData && isCacheValid(cachedData)) {
      const { data } = JSON.parse(cachedData);
      return data;
    }

    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempt ${attempt} to fetch bestsellers for ${listName}`);
        const response = await axios.get(`${BASE_URL}${listName}`, {
          signal,
          timeout: 10000, // 10 second timeout
        });

        // Check if the response has the expected structure
        if (!Array.isArray(response.data)) {
          console.error("Invalid response format:", response.data);
          if (response.data?.error) {
            throw new Error(response.data.message || "API configuration error");
          }
          throw new Error("Invalid response format");
        }

        const books = response.data;

        // Cache the response with timestamp
        const cacheData = {
          timestamp: Date.now(),
          data: books,
        };
        localStorage.setItem(listName, JSON.stringify(cacheData));

        return books;
      } catch (error) {
        if (error.name === "AbortError" || error.name === "CanceledError") {
          throw error; // Don't retry if request was aborted
        }

        lastError = error;
        console.warn(`Attempt ${attempt} failed:`, error.message);

        // If it's an API configuration error, don't retry
        if (error.response?.data?.error === "API configuration error") {
          throw new Error(error.response.data.message);
        }

        if (attempt === MAX_RETRIES) {
          // On last attempt, throw error with details
          const errorMessage = error.response?.data?.message || error.message;
          const errorDetails = error.response?.data?.details || "";
          throw new Error(
            `Failed to fetch bestsellers after ${MAX_RETRIES} attempts: ${errorMessage}${
              errorDetails ? ` (${errorDetails})` : ""
            }`
          );
        }

        // Wait before retrying, with exponential backoff
        await sleep(RETRY_DELAY * Math.pow(2, attempt - 1));
      }
    }

    throw lastError;
  } catch (error) {
    if (error.name === "AbortError" || error.name === "CanceledError") {
      throw new Error("Request was cancelled");
    }
    throw error;
  }
};

// Clear cache for a specific list
export const clearCache = (listName) => {
  try {
    localStorage.removeItem(listName);
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

// Clear all caches
export const clearAllCaches = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (
        key.startsWith("hardcover-") ||
        key.startsWith("childrens-") ||
        key.startsWith("science")
      ) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Error clearing all caches:", error);
  }
};

export const fetchBookByIsbn = async (isbn, { signal } = {}) => {
  try {
    const response = await axios.get(`/api/books/${isbn}`, {
      signal,
      timeout: 10000, // 10 second timeout
    });

    if (!response.data) {
      throw new Error("Book not found");
    }

    return response.data;
  } catch (error) {
    if (error.name === "AbortError" || error.name === "CanceledError") {
      throw new Error("Request was cancelled");
    }

    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error("Book not found in NYT Bestseller lists");
    }

    throw new Error(error.response?.data?.message || error.message);
  }
};

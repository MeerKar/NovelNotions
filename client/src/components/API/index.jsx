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
        const response = await axios.get(`${BASE_URL}${listName}`, {
          signal,
          timeout: 10000, // 10 second timeout
        });

        if (!Array.isArray(response.data)) {
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

        if (attempt === MAX_RETRIES) {
          // On last attempt, throw error with details
          throw new Error(
            `Failed to fetch bestsellers after ${MAX_RETRIES} attempts: ${
              error.response?.data?.message || error.message
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

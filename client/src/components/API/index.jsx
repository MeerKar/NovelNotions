import axios from "axios";

const BASE_URL = "/api/bestsellers/";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const isCacheValid = (cachedData) => {
  if (!cachedData) return false;
  const { timestamp, data } = JSON.parse(cachedData);
  return Date.now() - timestamp < CACHE_DURATION;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchBestSellers = async (listName) => {
  // Check cache first
  const cachedData = localStorage.getItem(listName);
  if (cachedData && isCacheValid(cachedData)) {
    const { data } = JSON.parse(cachedData);
    return data;
  }

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(`${BASE_URL}${listName}`);
      const books = response.data;

      // Cache the response with timestamp
      const cacheData = {
        timestamp: Date.now(),
        data: books,
      };
      localStorage.setItem(listName, JSON.stringify(cacheData));

      return books;
    } catch (error) {
      lastError = error;

      // If it's the last attempt, throw the error
      if (attempt === MAX_RETRIES) {
        throw new Error(
          `Failed to fetch bestsellers after ${MAX_RETRIES} attempts: ${
            error.response?.data?.message || error.message
          }`
        );
      }

      // Wait before retrying
      await sleep(RETRY_DELAY * attempt);
    }
  }

  throw lastError;
};

// Clear cache for a specific list
export const clearCache = (listName) => {
  localStorage.removeItem(listName);
};

// Clear all caches
export const clearAllCaches = () => {
  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith("hardcover-") ||
      key.startsWith("childrens-") ||
      key.startsWith("science")
    ) {
      localStorage.removeItem(key);
    }
  });
};

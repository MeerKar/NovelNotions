const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/novelnotions";
    console.log("Attempting to connect to MongoDB...");

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

// Initialize connection with retry logic
const initializeDB = async (retries = 3, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await connectDB();
      return conn;
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error("All connection attempts failed");
  process.exit(1);
};

// Initialize connection
initializeDB().catch((err) => {
  console.error("Failed to establish initial MongoDB connection:", err);
  process.exit(1);
});

// Handle connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

module.exports = mongoose.connection;

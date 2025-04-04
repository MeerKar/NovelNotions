const mongoose = require("mongoose");
require("dotenv").config();

// Configure mongoose
mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: "majority",
      family: 4,
      dbName: "novelnotions", // Explicitly set database name
    };

    console.log("Attempting to connect to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    // Event handlers
    mongoose.connection.on("connected", () => {
      console.log(
        "MongoDB connected successfully to database:",
        mongoose.connection.db.databaseName
      );
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      if (err.name === "MongoServerError" && err.code === 8000) {
        console.error(
          "Authentication failed. Please check your username and password."
        );
      }
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    if (error.name === "MongoServerError" && error.code === 8000) {
      console.error(
        "Authentication failed. Please check your username and password in your .env file"
      );
    }
    throw error;
  }
};

// Initialize connection with retry
const initializeConnection = async (retries = 3, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await connectDB();
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(
        `Connection attempt ${i + 1} failed. Retrying in ${
          delay / 1000
        } seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

initializeConnection().catch(console.error);

module.exports = mongoose.connection;

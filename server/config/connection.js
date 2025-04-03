const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/novelnotions";
    console.log("Attempting to connect to MongoDB...");

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      family: 4,
      retryWrites: true,
      w: "majority",
      maxPoolSize: 10,
      minPoolSize: 5,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

// Initialize connection
const dbConnection = connectDB().catch((err) => {
  console.error("Failed to establish initial MongoDB connection:", err);
  process.exit(1);
});

// Handle connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
  // Attempt to reconnect
  connectDB().catch((err) => {
    console.error("Failed to reconnect to MongoDB:", err);
  });
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected successfully");
});

module.exports = mongoose.connection;

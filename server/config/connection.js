const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/novelnotions";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: "majority",
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

// Initialize connection
connectDB().catch((err) => {
  console.error("Failed to establish initial MongoDB connection:", err);
  // Don't exit here, let the server handle the error
});

module.exports = mongoose.connection;

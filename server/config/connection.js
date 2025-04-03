const mongoose = require("mongoose");
require("dotenv").config();

// Configure mongoose
mongoose.set("strictQuery", true);

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  retryWrites: true,
  w: "majority",
  maxPoolSize: 10,
  minPoolSize: 5,
};

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/novelnotions";
    console.log("Attempting to connect to MongoDB...");

    await mongoose.connect(mongoURI, options);
    console.log(`MongoDB connected successfully to ${mongoURI.split("@")[1]}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

// Connection event handlers
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
  setTimeout(() => {
    connectDB().catch((err) => {
      console.error("Failed to reconnect to MongoDB:", err);
    });
  }, 5000);
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

// Initialize connection with retry logic
const initializeWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await connectDB();
      return;
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(`Failed to connect to MongoDB after ${retries} attempts`);
};

// Initialize connection
initializeWithRetry().catch((err) => {
  console.error("Failed to establish initial MongoDB connection:", err);
  // Don't exit here, let the server handle the error
});

module.exports = mongoose.connection;

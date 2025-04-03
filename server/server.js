require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const path = require("path");
const db = require("./config/connection");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { typeDefs, resolvers } = require("./schemas");
const morgan = require("morgan");
const cors = require("cors");

const apiRoutes = require("./api"); // Import the API routes
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;
const app = express();

// Enable logging in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Enable CORS
app.use(cors());

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded",
  persistedQueries: false,
  formatError: (error) => {
    console.error("GraphQL Error:", error);
    return error;
  },
  context: async ({ req }) => {
    // Add any necessary context here
    return { req };
  },
});

// Start server function
const startServer = async () => {
  try {
    // Start Apollo Server
    await apolloServer.start();

    // Apply Apollo middleware
    app.use("/graphql", expressMiddleware(apolloServer));

    // Serve static files in production
    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../client/dist")));

      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
      });
    }

    // Wait for database connection
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("MongoDB connection timeout after 30 seconds"));
      }, 30000);

      db.once("open", () => {
        clearTimeout(timeout);
        console.log("MongoDB connected successfully");
        resolve();
      });

      db.on("error", (err) => {
        clearTimeout(timeout);
        console.error("MongoDB connection error:", err);
        reject(err);
      });
    });

    // Start Express server
    const httpServer = app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });

    // Handle server errors
    httpServer.on("error", (error) => {
      console.error("Express server error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Start the server
startServer();

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
} else {
  // In production, log to console
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
  });
}

// Basic error handler
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

// Enable CORS
app.use(cors());

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

// Create Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error("GraphQL Error:", error);
    return error;
  },
  plugins: [
    {
      requestDidStart: async () => ({
        willSendResponse: async ({ response }) => {
          if (response.errors) {
            console.error("GraphQL Response Errors:", response.errors);
          }
        },
      }),
    },
  ],
});

// Start server function
const startServer = async () => {
  try {
    console.log("Starting server initialization...");

    // Wait for database connection
    await new Promise((resolve, reject) => {
      if (db.readyState === 1) {
        console.log("MongoDB already connected");
        resolve();
      } else {
        console.log("Waiting for MongoDB connection...");

        const timeout = setTimeout(() => {
          reject(new Error("MongoDB connection timeout after 30 seconds"));
        }, 30000);

        db.once("connected", () => {
          clearTimeout(timeout);
          console.log("MongoDB connected successfully");
          resolve();
        });

        db.on("error", (err) => {
          clearTimeout(timeout);
          console.error("MongoDB connection error:", err);
          reject(err);
        });
      }
    });

    // Start Apollo Server
    await apolloServer.start();
    console.log("Apollo Server started successfully");

    // Apply Apollo middleware
    app.use(
      "/graphql",
      expressMiddleware(apolloServer, {
        context: async ({ req }) => ({ req }),
      })
    );

    // Serve static files in production
    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../client/dist")));

      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
      });
    }

    // Start Express server
    const httpServer = app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });

    // Handle server shutdown
    const shutdown = async () => {
      console.log("Shutting down server...");
      await new Promise((resolve) => httpServer.close(resolve));
      await db.close();
      process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
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

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

// Get port from environment variable for Heroku or use 3001 locally
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
  res.status(500).json({ message: "Internal Server Error" });
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

let server = null;

// Start server function
const startServer = async () => {
  try {
    console.log("Starting server initialization...");

    // Wait for MongoDB connection
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

    // Initialize Apollo Server
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (error) => {
        console.error("GraphQL Error:", error);
        return error;
      },
    });

    await apolloServer.start();
    console.log("Apollo Server started");

    // Initialize API routes
    app.use("/api", (req, res, next) => {
      console.log(`API Request: ${req.method} ${req.path}`);
      apiRoutes(req, res, next);
    });

    // Apply Apollo middleware
    app.use(
      "/graphql",
      expressMiddleware(apolloServer, {
        context: async ({ req }) => ({ req }),
      })
    );

    // Serve static files and handle client routing in production
    if (process.env.NODE_ENV === "production") {
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
      });
    }

    // Start server
    server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL at http://localhost:${PORT}/graphql`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal} signal. Starting graceful shutdown...`);

      // First, stop accepting new requests
      if (server) {
        server.close(() => {
          console.log("HTTP server closed");
        });
      }

      try {
        // Close MongoDB connection
        if (db.readyState === 1) {
          await db.close();
          console.log("MongoDB connection closed");
        }

        // Stop Apollo Server
        if (apolloServer) {
          await apolloServer.stop();
          console.log("Apollo Server stopped");
        }

        console.log("Graceful shutdown completed");
        process.exit(0);
      } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // Handle uncaught errors
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Promise Rejection:", err);
      shutdown("UNHANDLED_REJECTION");
    });

    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      shutdown("UNCAUGHT_EXCEPTION");
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

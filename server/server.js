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

let httpServer = null;
let apolloServer = null;

// Start server function
const startServer = async () => {
  try {
    console.log("Starting server initialization...");
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Port: ${PORT}`);

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

        const cleanup = () => {
          clearTimeout(timeout);
          db.removeListener("connected", handleConnect);
          db.removeListener("error", handleError);
        };

        const handleConnect = () => {
          cleanup();
          console.log("MongoDB connected successfully");
          resolve();
        };

        const handleError = (err) => {
          cleanup();
          console.error("MongoDB connection error:", err);
          reject(err);
        };

        db.once("connected", handleConnect);
        db.once("error", handleError);
      }
    });

    // Initialize Apollo Server
    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (error) => {
        console.error("GraphQL Error:", error);
        return error;
      },
    });

    await apolloServer.start();
    console.log("Apollo Server started");

    // Initialize API routes with error handling
    app.use("/api", (req, res, next) => {
      console.log(`API Request: ${req.method} ${req.path}`);
      try {
        apiRoutes(req, res, next);
      } catch (error) {
        console.error("API Route Error:", error);
        next(error);
      }
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

    // Start server with keep-alive
    httpServer = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL at http://localhost:${PORT}/graphql`);
    });

    // Enable keep-alive connections
    httpServer.keepAliveTimeout = 65000; // Slightly higher than Heroku's 60 second timeout
    httpServer.headersTimeout = 66000; // Slightly higher than keepAliveTimeout

    // Handle process signals
    const cleanup = async (signal) => {
      console.log(`\nReceived ${signal} signal. Starting cleanup...`);

      try {
        // Stop accepting new connections
        if (httpServer) {
          await new Promise((resolve) => {
            httpServer.close(resolve);
            console.log("HTTP server stopped accepting new connections");
          });
        }

        // Stop Apollo Server
        if (apolloServer) {
          await apolloServer.stop();
          console.log("Apollo Server stopped");
        }

        // Close MongoDB connection
        if (db.readyState === 1) {
          await db.close();
          console.log("MongoDB connection closed");
        }

        console.log("Cleanup completed");
        process.exit(0);
      } catch (error) {
        console.error("Error during cleanup:", error);
        process.exit(1);
      }
    };

    // Handle shutdown signals
    ["SIGTERM", "SIGINT", "SIGUSR2"].forEach((signal) => {
      process.on(signal, () => cleanup(signal));
    });

    // Handle uncaught errors
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Promise Rejection:", err);
      cleanup("UNHANDLED_REJECTION");
    });

    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      cleanup("UNCAUGHT_EXCEPTION");
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

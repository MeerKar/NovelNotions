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

// Start server function
const startServer = async () => {
  try {
    console.log("Starting server initialization...");

    // Wait for MongoDB connection
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("MongoDB connection timeout after 30 seconds"));
      }, 30000);

      if (db.readyState === 1) {
        clearTimeout(timeout);
        console.log("MongoDB already connected");
        resolve();
      } else {
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
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL at http://localhost:${PORT}/graphql`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`Received ${signal} signal`);
      server.close(() => {
        console.log("HTTP server closed");
        db.close().then(() => {
          console.log("MongoDB connection closed");
          process.exit(0);
        });
      });

      // Force exit if graceful shutdown fails
      setTimeout(() => {
        console.error(
          "Could not close connections in time, forcefully shutting down"
        );
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Global error handlers
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Start the server
startServer();

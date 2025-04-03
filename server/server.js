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

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded",
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
    // Start Apollo Server
    await server.start();

    // Apply Apollo middleware
    app.use(
      "/graphql",
      cors(),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({ req }),
      })
    );

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
    const server = app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });

    // Handle server errors
    server.on("error", (error) => {
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

const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "mysecretssshhhhhhh";
const expiration = "2h";

module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    return req;
  },
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  // Function to get user from token (to be used in Apollo context)
  getUserFromToken: function (token) {
    try {
      if (!token) {
        return null; // If there's no token, return null (no user)
      }
      return jwt.verify(token, secret).data; // Verify and extract user data from token
    } catch (err) {
      console.error("Invalid token", err);
      return null; // If verification fails, return null (no user)
    }
  },
};

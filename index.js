require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const typeDefs = require("./graphql/types/users");
const resolvers = require("./graphql/resolvers");

//MongoDB connection
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("mongoose connected successfully");
});

mongoose.connection.on("err", (err) => {
  console.log("mongoose error", err);
});

// ApolloServer constructor
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  csrfPrevention: true,

  context: ({ req }) => {
    const { authorization } = req.headers;
    if (authorization) {
      const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
      return { userId };
    }
  },
});

// Launch the server
server.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});

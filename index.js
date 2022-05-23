require("dotenv").config();
const { ApolloServer } = require('apollo-server');
const mongoose = require("mongoose");
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
});

// Launch the server
server.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
})
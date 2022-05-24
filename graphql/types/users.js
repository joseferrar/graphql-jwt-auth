const { gql } = require("apollo-server");

module.exports = gql`
  type users {
    username: String
    email: String
    password: String
  }

  input RegisterInput {
    username: String
    email: String
    password: String
    token: String
  }

  input LoginInput {
    email: String
    password: String
  }

  input UpdateInput {
    id: String
    username: String
    email: String
    password: String
  }


  type Mutation {
    registerUser(registerInput: RegisterInput): users
    loginUser(loginInput: LoginInput): users
    updateUser(updateInput: UpdateInput): users
  }

  type Query {
    allUsers: [users]
  }
`;

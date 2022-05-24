const { gql } = require("apollo-server");

module.exports = gql`
  type users {
    id: String
    username: String
    email: String
    password: String
    token: String
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

  input DeleteInput {
    id: String
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): users
    loginUser(loginInput: LoginInput): users
    updateUser(updateInput: UpdateInput): users
    deleteUser(deleteInput: DeleteInput): users
  }

  type Query {
    allUsers: [users]
  }
`;

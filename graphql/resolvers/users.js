const userSchema = require("../../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  // <-----------------------------Graphql Queries----------------------------------->
  Query: {
    //get all users from database
    async allUsers() {
      return userSchema.find({});
    },
    
  },

  // <-----------------------------Graphql Mutations----------------------------------->
  Mutation: {
    
    async getUserId(_, { GetUserId: { id } }) {
      return userSchema.findById(id);
    },

    async registerUser(_, { registerInput: { username, email, password } }) {
      var emailExists = await userSchema.findOne({ email });
      if (emailExists) {
        throw new Error("Email already exist !!!");
      }

      let users = await new userSchema({
        username: username,
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 10),
      });

   

      const res = await users.save();

      //graphql output
      return {
        id: res.id,
        ...res._doc,
      };
    },

    // Login user
    async loginUser(_, { loginInput: { email, password } }) {
      const user = await userSchema.findOne({ email });
      if (!user) {
        throw new Error("Email not exist !!!");
      }
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = await jwt.sign({ email }, process.env.JWT_SECRET, {expiresIn: "15s"}); // Create token

        user.token = token; // save user token

        return {
          //graphql response
          id: user.id,
          ...user._doc,
        };
      } else {
        throw new Error("Incorrect password");
      }
    },

    //update user
    async updateUser(_, { updateInput: { id, username, email, password } }) {
      return await userSchema.findByIdAndUpdate(id, {
        username: username,
        email: email,
        password: password,
      });
    },

    //delete user
    async deleteUser(_, { deleteInput: { id } }) {
      await userSchema.findByIdAndDelete({ _id: id }).exec();
      return "user delete";
    },
  },
};

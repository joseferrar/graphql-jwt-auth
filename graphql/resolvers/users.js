const userSchema = require("../../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  //get all users from database
  Query: {
    async allUsers() {
      return userSchema.find({});
    },
  },

  Mutation: {
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

      // Create token
      const token = await jwt.sign({ email }, process.env.JWT_SECRET);
      // save user token
      users.token = token;

      const res = await users.save();

      //graphql output
      return {
        id: res.id,
        ...res._doc,
      };
    },

    async loginUser(_, { loginInput: { email, password } }) {
      const user = await userSchema.findOne({ email });
      if (!user) {
        throw new Error("Email not exist !!!");
      }
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = await jwt.sign({ email }, process.env.JWT_SECRET);

        // save user token
        user.token = token;

        //graphql output
        return {
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

    async deleteUser(_, { deleteInput: { id } }) {
      await userSchema.findByIdAndDelete({ _id: id }).exec();
      return "user dlete";
    },
  },
};

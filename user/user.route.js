import express from "express";
import {
  addUserValidationSchema,
  loginUserValidationSchema,
} from "./user.validation.js";
import User from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// register user
router.post(
  "/user/register",
  async (req, res, next) => {
    // extract new data from req.body
    const newData = req.body;

    // validate new data
    try {
      const validatedData = await addUserValidationSchema.validate(newData);
      req.body = validatedData;

      // call next function
      next();
    } catch (error) {
      // if validation fails, throw error
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract new user from req.body
    const newUser = req.body;

    // find user by email
    const user = await User.findOne({ email: newUser.email });

    // if user, throw error
    if (user) {
      return res.status(409).send({ message: "Email already exists." });
    }

    // hash password
    const plainPassword = newUser.password;
    const saltRounds = 10; // increases randomness of password
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // replace plain password by hashed password
    newUser.password = hashedPassword;

    // create user
    await User.create(newUser);

    // send response
    return res
      .status(201)
      .send({ message: "User is registered successfully." });
  }
);

// login user

router.post(
  "/user/login",
  async (req, res, next) => {
    //  extract new data from req.body
    const newData = req.body;
    // validate new data
    try {
      const validatedData = await loginUserValidationSchema.validate(newData);
      req.body = validatedData;
      // call next function if validation succeeds
      next();
    } catch (error) {
      // if validation fails, throw error
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract login credentials from req.body
    const loginCredentials = req.body;

    // find user by email
    const user = await User.findOne({ email: loginCredentials.email });

    // if not user,throw error
    if (!user) {
      return res.status(404).send({ message: "Invalid credentials." });
    }

    // check for password match
    const plainPassword = loginCredentials.password;
    const hashedPassword = user.password;

    const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);

    // if password does not match, throw error
    if (!isPasswordMatch) {
      return res.status(404).send({ message: "Invalid credentials." });
    }

    // to remove password from res
    user.password = undefined;

    // generate token
    // syntax
    // token = jwt.sign(payload,signature)
    const token = jwt.sign({ email: user.email }, "82b0e9b0b6d");

    // send response
    return res
      .status(200)
      .send({ message: "Login successful", userDetails: user, token: token });
  }
);

export default router;

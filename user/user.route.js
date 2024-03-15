import express from "express";
import { addUserValidationSchema } from "./user.validation.js";
import User from "./user.model.js";
import bcrypt from "bcrypt";

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
    const saltRounds = 10;

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

export default router;

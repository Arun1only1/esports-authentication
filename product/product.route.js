import express from "express";
import { addProductValidationSchema } from "./product.validation.js";
import Product from "./product.model.js";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";

const router = express.Router();

// add product

router.post(
  "/product/add",
  async (req, res, next) => {
    // extract authorization from req headers
    const authorization = req.headers.authorization;

    // extract token from authorizaion
    const splittedValues = authorization?.split(" ");

    const token = splittedValues?.length === 2 ? splittedValues[1] : undefined;

    if (!token) {
      return res.status(401).send({ message: "Unauthorized." });
    }

    let payload;
    try {
      // syntax
      // payload =jwt.verify(token,signature)
      payload = jwt.verify(token, "82b0e9b0b6d");
    } catch (error) {
      return res.status(401).send({ message: "Unauthorized." });
    }

    // find user using email from payload
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      return res.status(401).send({ message: "Unauthorized." });
    }

    next();
  },
  async (req, res, next) => {
    // validate req body
    const data = req.body;
    try {
      const validatedData = await addProductValidationSchema.validate(data);
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract new product from req.body
    const newProduct = req.body;

    // add product
    await Product.create(newProduct);

    // send response
    return res.status(200).send({ message: "Product is added successfully." });
  }
);

export default router;

import express from "express";
import connectDB from "./db.connect.js";
import userRoutes from "./user/user.route.js";
import productRoutes from "./product/product.route.js";

const app = express();

// to make app understand json
app.use(express.json());

// database connection
connectDB();

// register routes
app.use(userRoutes);
app.use(productRoutes);

// network port and server
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

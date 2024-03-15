import mongoose from "mongoose";

const userName = "arun";
const password = encodeURIComponent("arun2nly2");
const databaseName = "esports-authentication";

const dbURL = `mongodb+srv://${userName}:${password}@school.b6qkdnb.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("DB connection established...");
  } catch (error) {
    console.log("DB connection failed...");
    console.log(error.message);
  }
};

export default connectDB;

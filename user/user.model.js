import mongoose from "mongoose";

// set rule
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 60,
    lowercase: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
});

// create table
const User = mongoose.model("User", userSchema);
export default User;

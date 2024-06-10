import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userPoints: {
    type: Number,
    default: 5000,
  },
  scores: {
    type: Array,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const USER = mongoose.model("user", userSchema);

export default USER;

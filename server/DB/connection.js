import mongoose from "mongoose";

export const dbConnet = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://himanshujaiswal869:bhimrao@cluster0.jkn47vu.mongodb.net/Rough"
      )
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.log(err));
  } catch (error) {
    console.error("Error in making connection", error);
  }
};

import express from "express";
const router = express.Router();
import z from "zod";
import bcrypt from "bcrypt";
import USER from "../models/user.js";
import generateToken from "../middleware/generateToken.js";

let userInputProps = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8).max(40),
});

router.post("/signup", async (req, res) => {
  try {
    const parsedInput = userInputProps.safeParse(req.body);

    if (!parsedInput.success) {
      return res.status(402).json({
        message: `Please Input valid Arguments: ${parsedInput.error}`,
      });
    }

    const { username, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const securePass = await bcrypt.hash(password, salt);

    const user = await USER.findOne({ username });
    if (user) return res.status(401).json({ message: "User already Exist" });
    else {
      const newUser = new USER({
        username: username,
        password: securePass,
      });

      await newUser.save();
      const token = await generateToken(newUser._id);
      res.status(200).json({ message: "User Created", token });
    }
  } catch (error) {
    res.status(500).send(`Error in Route:${error}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await USER.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User not found", flag: true });
    }

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await generateToken(user._id);

    res.status(200).json({ message: "Logged in", token: token });
  } catch (error) {
    res.status(500).send(`Error in Route: ${error.message}`);
  }
});

router.get("/me", async (req, res) => {
  res.status(200).send("User Available");
});

export default router;

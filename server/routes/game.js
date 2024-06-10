import express from "express";
import authenticateJwt from "../middleware/authenticateJwt.js";
import USER from "../models/user.js";
// authenticateJwt
const router = express.Router();

router.get("/getPoints", authenticateJwt, async (req, res) => {
  try {
    // const generatedNumber = Math.floor(Math.random() * 12);
    const userId = req.user.id;
    const user = await USER.findOne({ _id: userId });
    console.log(user);
    res.status(200).json({
      message: "Succesful",
      userPoints: user.userPoints,
      success: true,
    });
  } catch (error) {
    res.status(500).send(`Error In Route:${error}`);
  }
});
router.get("/generateNumber", authenticateJwt, async (req, res) => {
  try {
    const generatedNumber = Math.floor(Math.random() * 12);
    res
      .status(200)
      .json({ message: "Succesful", generatedNumber, success: true });
  } catch (error) {
    res.status(500).send(`Error In Route:${error}`);
  }
});

router.post("/userResult", authenticateJwt, async (req, res) => {
  try {
    const { generatedNumber, betNumber } = req.body;
    // console.log(req.body);
    let result = false;
    switch (betNumber) {
      case "7+":
        generatedNumber > 7 ? (result = true) : (result = false);

        break;
      case "7":
        generatedNumber === 7 ? (result = true) : (result = false);

        break;
      case "7-":
        generatedNumber < 7 ? (result = true) : (result = false);

        break;

      default:
        return res.send("Please Provide Valid Options");
    }

    res.status(200).json({ message: "Succesful", result, success: true });
  } catch (error) {
    res.status(500).send(`Error In Route:${error}`);
  }
});

router.post("/setPoints", authenticateJwt, async (req, res) => {
  try {
    const { userResult, betPoints } = req.body;
    const userId = req.user.id;

    const user = await USER.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const newPoints = userResult
      ? user.userPoints + betPoints
      : user.userPoints - betPoints;

    const updatedUser = await USER.findOneAndUpdate(
      { _id: userId },
      { userPoints: newPoints },
      { new: true }
    );

    res.status(200).json({ success: true, newPoints });
  } catch (error) {
    res.status(500).send(`Error In Route:${error}`);
  }
});

export default router;

import jwt from "jsonwebtoken";

const generateToken = async (id) => {
  try {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: "36h",
    });
    return token;
  } catch (error) {
    throw new Error(`Error in generating token: ${error.message}`);
  }
};

export default generateToken;

import jwt from "jsonwebtoken";

const authenticateJwt = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return res
          .status(401)
          .json({ message: `Unauthorized: ${err.message}` });
      }

      req.user = payload;
      next();
    });
  } catch (error) {
    console.log(`Error in authentication: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default authenticateJwt;

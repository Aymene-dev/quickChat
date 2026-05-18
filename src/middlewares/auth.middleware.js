import jwt from "jsonwebtoken";

const checkAccessToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "access token not found" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req._userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "access token expired " + error });
  }
};

export { checkAccessToken };

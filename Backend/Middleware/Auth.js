import jwt from "jsonwebtoken";
import User from "../Model/User.js";

const Auth = async (req, res, next) => {
  try {
    
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Please Login!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User nahi mila" });
    }

    req.user = user;
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", expired: true });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default Auth;
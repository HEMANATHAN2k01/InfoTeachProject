const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Please provide a valid token" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, "secret1234");

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error validating token:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = validateToken;

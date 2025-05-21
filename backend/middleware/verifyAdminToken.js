import jwt from "jsonwebtoken";

export const verifyAdminToken = (req, res, next) => {
  try {
//token for verification....(incomplete. needs to work here)
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token format" });

    const secret = process.env.JWT_SECRET
    const decoded = jwt.verify(token, secret);


    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Access denied: not an admin" });
    }


    req.admin = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

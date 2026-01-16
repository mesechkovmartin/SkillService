import admin from "../config/firebaseAdmin.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded; // uid, email, etc.
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
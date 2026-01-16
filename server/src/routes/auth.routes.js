import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/user.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {

    console.log(">>> /auth/me HIT");
    const { uid, email, name } = req.firebaseUser;

    if (!email) return res.status(400).json({ message: "No email in token" });

    const user = await User.findOneAndUpdate(
        { firebaseUid: uid },
        {
            firebaseUid: uid,
            email,
            $setOnInsert: { username: name || "" },
        },
        { upsert: true, new: true }
    );

    res.json(user);
});

export default router;
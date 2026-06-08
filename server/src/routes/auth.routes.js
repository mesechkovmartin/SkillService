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


router.put("/profile", requireAuth, async (req, res) => {
    try {
        const { uid } = req.firebaseUser;
        const { username, bio, profileImage } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { firebaseUid: uid },
            { username, bio, profileImage },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });      
    }
});



export default router;


import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

// Get the logged-in user's profile
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

// Update the logged-in user's profile
router.put("/profile", requireAuth, async (req, res) => {
    try {
        const { uid } = req.firebaseUser;
        const { username, bio, profileImage, profileImagePublicId } = req.body;

        const oldUser = await User.findOne({ firebaseUid: uid });

        if (!oldUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (
            oldUser.profileImagePublicId &&
            profileImagePublicId &&
            oldUser.profileImagePublicId !== profileImagePublicId
        ) {
            await cloudinary.uploader.destroy(oldUser.profileImagePublicId);
        }

        const updatedUser = await User.findOneAndUpdate(
            { firebaseUid: uid },
            {
                $set: {
                    username,
                    bio,
                    profileImage,
                    profileImagePublicId,
                },
            },
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
});

// Delete the logged-in user's profile image
router.delete("/profile-image", requireAuth, async (req, res) => {
    try {
        const { uid } = req.firebaseUser;

        const user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.profileImagePublicId) {
            await cloudinary.uploader.destroy(user.profileImagePublicId);
        }

        user.profileImage = "";
        user.profileImagePublicId = "";

        await user.save();

        res.json(user);

    } catch (error) {
        console.error("Error deleting profile image:", error);
        res.status(500).json({ message: "Error deleting profile image" });
    }
});

// GEt user by Firebase UID
router.get("/users/:uid", async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
});

export default router;


import express from "express";
import Conversation from "../models/conversation.js";

const router = express.Router();

// Create a new conversation or get an existing conversation
router.post("/", async (req, res) => {
    try {
        const { currentUserId, receiverId } = req.body;

        if (!currentUserId || !receiverId) {
            return res.status(400).json({ error: "Both users are required." });
        }

        if (currentUserId === receiverId) {
            return res.status(400).json({ error: "A user cannot start a conversation with themselves." });
        }

        // operator $all is used to find a conversation that contains both user IDs in the participants array
        const existingConversation = await Conversation.findOne({
            participants: { $all: [currentUserId, receiverId] }
        });

        if (existingConversation) {
            return res.status(200).json(existingConversation);
        }

        const newConversation = await Conversation.create({
            participants: [currentUserId, receiverId]
        });

        res.status(201).json(newConversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all conversations for the logged user
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // operator $in is used to find all conversations that contain the user ID in the participants array
        const conversations = await Conversation.find({
            participants:{ $in: [userId] }
        }).sort({ updatedAt: -1 });

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

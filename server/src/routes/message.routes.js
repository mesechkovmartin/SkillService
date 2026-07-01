import express from "express";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

const router = express.Router();

// i need to check if someone belongs to a conversation before allowing them to send a message or view messages. This is important for security and privacy reasons. I can do this by checking if the senderId is one of the participants in the conversation before creating a new message or fetching messages from that conversation.  NEED TO ADD AUTHENTICATION MIDDLEWARE TO CHECK IF THE USER IS LOGGED IN AND GET THEIR USER ID. THEN I CAN USE THAT USER ID TO CHECK IF THEY ARE A PARTICIPANT IN THE CONVERSATION.
// Create message
router.post("/", async (req, res) => {
    try {
        const { conversationId, senderId, text } = req.body;

        if (!conversationId || !senderId || !text) {
            return res.status(400).json({ message: "Conversation, sender and text are required." });
        }

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found." });
        }

        const newMessage = await Message.create({
            conversationId,
            senderId,
            text
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            updatedAt: new Date()
        });

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all messages from one conversation
router.get("/:conversationId", async (req, res) => {
    try {
        const { conversationId } = req.params;

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
import express from "express";
import Comment from "../models/comment.js";
import Post from "../models/post.js";

const router = express.Router();

// Create a new comment
router.post("/", async (req, res) => {
    try {
        const { postId, authorId, text } = req.body;

        if (!postId || !authorId || !text) {
            return res.status(400).json({ message: "Post, author and text are required." });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        const newComment = await Comment.create({
            postId,
            authorId,
            text
        });

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all comments for a specific post
router.get("/post/:postId", async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
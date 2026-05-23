import express from 'express';
import Post from '../models/post.js';

const router = express.Router();

// Add new post
router.post("/", async (req, res) => {
    try {
        console.log("POST BODY:", req.body);
        const { title, description, category, location, ownerEmail, ownerPhoneNumber, ownerId, price } = req.body;

        const newPost = await Post.create({
            title,
            description,
            category,
            location,
            ownerEmail,
            ownerPhoneNumber,
            ownerId,
            price
        });

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Error creating post" });
    }
});

// Get my posts
router.get("/my-posts", async (req, res) => {
    try {
        const { ownerEmail } = req.query;

        const posts = await Post.find({ ownerEmail });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts" });
    }
});

// Get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts" });
    }
});

// Update post
router.put("/:id", async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: "Error updating post" });
    }
});

// Delete post
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});
// Get single post by Id
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Error fetching post" });
    }
});

export default router;
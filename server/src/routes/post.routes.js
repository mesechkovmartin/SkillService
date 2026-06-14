import express from 'express';
import Post from '../models/post.js';
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Add new post
router.post("/", async (req, res) => {
    try {
        console.log("POST BODY:", req.body);
        const { title, description, images, category, location, ownerEmail, ownerPhoneNumber, ownerId, price } = req.body;

        const newPost = await Post.create({
            title,
            description,
            images: images || [],
            category,
            location,
            ownerEmail,
            ownerPhoneNumber,
            ownerId,
            price
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
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
        const { removedImages, ...updatedData } = req.body;

        if (removedImages?.length > 0) {
            await Promise.all(
                removedImages.map((image) =>
                    cloudinary.uploader.destroy(image.publicId)
                )
            );
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.json(updatedPost);
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Error updating post" });
    }
});

// Delete post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.images?.length > 0) {
            await Promise.all(
                post.images.map((image) => 
                    cloudinary.uploader.destroy(image.publicId)
                )
            );

        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ message: "Post deleted" });

    } catch (error) {
        console.error("Error deleting post:", error);
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
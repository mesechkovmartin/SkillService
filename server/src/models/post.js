import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        imageUrl: { type: String, default: "" },
        category: { type: String, required: true, trim: true },
        location: {type: String, required: true},
        ownerEmail: { type: String, required: true, trim: true, index: true },
        ownerPhoneNumber: { type: String, required: true, trim: true },
        ownerId: { type: String, required: true },
        price: { type: Number, required: true, min: 0},
        
    },
    { timestamps: true }
);

export default mongoose.model("Post", postSchema);

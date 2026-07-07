import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        authorId: {
            type: String,
            required: true,
            trim: true
        },
        text: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Comment", commentSchema);

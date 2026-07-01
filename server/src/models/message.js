import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },

        senderId: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },

        text: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },

        isRead: {
            type: Boolean,
            default: false  
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Message", messageSchema);
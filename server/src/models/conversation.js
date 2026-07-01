import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants:  {
            type : [String],
            required : true,
            validate: {
                validator: function(value) {
                    return value.length === 2 && value[0] !== value[1];
                },
                message: "A conversation must have exactly two distinct participants."
            }
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Conversation", conversationSchema);
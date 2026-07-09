import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        images: {
            type: [{ url: { type: String, required: true }, publicId: { type: String, required: true } }],
            validate: { validator: function (value) { return !value || value.length <= 10; }, message: "A post can have a maximum of 10 images." }
        },
        category: { type: String, required: true, trim: true },
        location: {
            locationType: {
                type: String,
                enum: ["city", "approximate", "precise"],
                default: "city",
                required: true
            },
            city: {
                type: String,
                required: true,
                trim: true
            },
            area: {
                type: String,
                default: "",
                trim: true
            },
            address: {
                type: String,
                default: "",
                trim: true
            },
            latitude: {
                type: Number,
                default: null
            },
            longitude: {
                type: Number,
                default: null
            }
        },
        ownerEmail: { type: String, required: true, trim: true, index: true },
        ownerPhoneNumber: { type: String, required: true, trim: true },
        ownerId: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },

    },
    { timestamps: true }
);

export default mongoose.model("Post", postSchema);

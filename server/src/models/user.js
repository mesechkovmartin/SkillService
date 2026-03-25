import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, trim: true },
    username: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    profileImage: { type: String, default: "" },
    city: { type: String, trim: true },
    bio: { type: String, default: "Add bio" },

    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
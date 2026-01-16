import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },

    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
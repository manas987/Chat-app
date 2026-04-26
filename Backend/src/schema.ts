import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, require: true },
    username: { type: String, require: true, unique: true },
    hashedpass: { type: String, require: true },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true },
);

const msgSchema = new mongoose.Schema(
  {
    sentBy: String,
    sentTo: String,
    textContent: String,
    time: Date,
  },
  { timestamps: true },
);

export const userdb = mongoose.model("User", userSchema);
export const msgdb = mongoose.model("Msg", msgSchema);

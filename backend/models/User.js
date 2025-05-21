import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone1: { type: String, required: true },
  phone2: { type: String },
  hobbies: [{ type: String }],
  place: { type: String, required: true },
  gender: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("User", userSchema);

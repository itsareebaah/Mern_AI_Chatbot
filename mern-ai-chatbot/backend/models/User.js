import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.statics.createUser = async function ({ email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return this.create({ email, passwordHash });
};

userSchema.methods.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

export default User;


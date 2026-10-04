import mongoose from "mongoose";

// Tokens invalidated by logout. Each document is removed automatically
// by MongoDB once the token it refers to would have expired anyway.
const revokedTokenSchema = new mongoose.Schema({
  jti: {
    type: String,
    required: true,
    unique: true,
  },

  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
});

const RevokedToken = mongoose.model("RevokedToken", revokedTokenSchema);

export default RevokedToken;

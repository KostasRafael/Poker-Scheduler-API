import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    festivalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Festival",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    buyIn: {
      type: Number,
      required: true,
      min: 0,
    },

    startingStack: {
      type: Number,
      required: true,
      min: 0,
    },

    rebuys: {
      type: Boolean,
      required: true,
    },

    days: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Tournament = mongoose.model("Tournament", tournamentSchema);

export default Tournament;
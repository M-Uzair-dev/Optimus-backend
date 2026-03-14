const mongoose = require("mongoose");

const cashSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["give", "take"],
    },
    procurement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: (val) => val > 0,
        message: "Amount must be greater than 0",
      },
    },
    note: {
      type: String,
      required: false,
      default: "",
    },
    documents: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Document",
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Cash", cashSchema);

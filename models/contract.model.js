const { default: mongoose } = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cycle",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    cost: {
      type: Number,
      required: true,
      validate: {
        validator: (val) => val > 0,
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

module.exports = mongoose.model("Contract", contractSchema);

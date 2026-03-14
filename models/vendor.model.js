const { default: mongoose } = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Vendor", vendorSchema);

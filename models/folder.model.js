const { default: mongoose } = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: false,
    },
    files: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "File",
      default: [],
    },
    subFolders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Folder",
      default: [],
    },
    access: {
      type: [
        {
          role: {
            type: String,
            enum: ["CM", "QS", "Accountant", "Procurement", "PM"],
            required: true,
          },
          grantType: {
            type: String,
            enum: ["all", "specific"],
            required: true,
          },
          employees: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Employee",
            default: [],
          },
        },
      ],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: true,
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ["Employee", "Admin"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Folder", folderSchema);

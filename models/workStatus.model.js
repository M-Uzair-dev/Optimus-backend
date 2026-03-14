const mongoose = require("mongoose");

const workStatusSchema = new mongoose.Schema(
  {
    cycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cycle",
      required: true,
    },
    PM: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    documents: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Document",
      required: false,
      default: [],
    },
    materialDocuments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Document",
      required: false,
      default: [],
    },
    note: {
      type: String,
      required: false,
      default: "",
    },
    status: {
      type: String,
      required: true,
      enum: ["normal", "delayed", "skipped"],
    },
    workStartTime: {
      type: String,
      required: false,
    },
    workEndTime: {
      type: String,
      required: false,
    },
    delayReason: {
      type: String,
      required: false,
    },
    skipReason: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// Conditional validation based on status
workStatusSchema.pre("save", function (next) {
  if (this.status === "normal") {
    // Normal status requires workStartTime and workEndTime
    if (!this.workStartTime) {
      return next(new Error("workStartTime is required for normal status"));
    }
    if (!this.workEndTime) {
      return next(new Error("workEndTime is required for normal status"));
    }
  }

  if (this.status === "delayed") {
    // Delayed status requires workStartTime, workEndTime, and delayReason
    if (!this.workStartTime) {
      return next(new Error("workStartTime is required for delayed status"));
    }
    if (!this.workEndTime) {
      return next(new Error("workEndTime is required for delayed status"));
    }
    if (!this.delayReason) {
      return next(new Error("delayReason is required for delayed status"));
    }
  }

  if (this.status === "skipped") {
    // Skipped status requires skipReason (no times needed)
    if (!this.skipReason) {
      return next(new Error("skipReason is required for skipped status"));
    }
  }

  next();
});

// Add validation for update operations
workStatusSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    const docToUpdate = await this.model.findOne(this.getQuery());

    if (!docToUpdate) {
      return next();
    }

    // Merge existing document with updates
    const mergedDoc = { ...docToUpdate.toObject(), ...update.$set, ...update };
    delete mergedDoc.$set;

    // Run the same validation logic
    if (mergedDoc.status === "normal") {
      if (!mergedDoc.workStartTime) {
        return next(new Error("workStartTime is required for normal status"));
      }
      if (!mergedDoc.workEndTime) {
        return next(new Error("workEndTime is required for normal status"));
      }
    }

    if (mergedDoc.status === "delayed") {
      if (!mergedDoc.workStartTime) {
        return next(new Error("workStartTime is required for delayed status"));
      }
      if (!mergedDoc.workEndTime) {
        return next(new Error("workEndTime is required for delayed status"));
      }
      if (!mergedDoc.delayReason) {
        return next(new Error("delayReason is required for delayed status"));
      }
    }

    if (mergedDoc.status === "skipped") {
      if (!mergedDoc.skipReason) {
        return next(new Error("skipReason is required for skipped status"));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

workStatusSchema.pre("updateOne", async function (next) {
  try {
    const update = this.getUpdate();
    const docToUpdate = await this.model.findOne(this.getQuery());

    if (!docToUpdate) {
      return next();
    }

    const mergedDoc = { ...docToUpdate.toObject(), ...update.$set, ...update };
    delete mergedDoc.$set;

    // Run the same validation logic
    if (mergedDoc.status === "normal") {
      if (!mergedDoc.workStartTime) {
        return next(new Error("workStartTime is required for normal status"));
      }
      if (!mergedDoc.workEndTime) {
        return next(new Error("workEndTime is required for normal status"));
      }
    }

    if (mergedDoc.status === "delayed") {
      if (!mergedDoc.workStartTime) {
        return next(new Error("workStartTime is required for delayed status"));
      }
      if (!mergedDoc.workEndTime) {
        return next(new Error("workEndTime is required for delayed status"));
      }
      if (!mergedDoc.delayReason) {
        return next(new Error("delayReason is required for delayed status"));
      }
    }

    if (mergedDoc.status === "skipped") {
      if (!mergedDoc.skipReason) {
        return next(new Error("skipReason is required for skipped status"));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("WorkStatus", workStatusSchema);

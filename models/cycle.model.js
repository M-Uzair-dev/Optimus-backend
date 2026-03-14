const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    cycleNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    PM: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    cost: {
      type: Number,
      required: true,
      validate: {
        validator: (val) => val > 0,
        message: "Cost must be greater than 0",
      },
    },
    incomeTax: {
      // this will be a floating point integer representing the percentage tax e.g 8%, 20% etc
      type: Number,
      required: true,
      validate: {
        validator: (val) => val >= 0 && val <= 100,
        message: "Income tax must be between 0 and 100",
      },
    },
    servicesTax: {
      // same, this will also be a floating point percentage value tax
      type: Number,
      required: true,
      validate: {
        validator: (val) => val >= 0 && val <= 100,
        message: "Services tax must be between 0 and 100",
      },
    },
    startDate: {
      type: Date,
      required: false,
    },
    completeDate: {
      type: Date,
      required: false,
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
    status: {
      type: String,
      enum: ["active", "completed", "on-hold", "cancelled"],
      default: "active",
    },
    assistants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Employee",
      required: false,
      default: [],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

// Virtual: tax paid by client = 100% of income tax + 20% of services tax
cycleSchema.virtual("tax_paid_by_client").get(function () {
  const incomeTaxAmount = (this.cost * this.incomeTax) / 100;
  const servicesTaxAmount = (this.cost * this.servicesTax) / 100;
  return incomeTaxAmount + servicesTaxAmount * 0.2;
});

// Virtual: tax payable by admin = 80% of services tax
cycleSchema.virtual("tax_payable").get(function () {
  const servicesTaxAmount = (this.cost * this.servicesTax) / 100;
  return servicesTaxAmount * 0.8;
});

// Compound index to ensure unique cycle numbers per project
cycleSchema.index({ project: 1, cycleNumber: 1 }, { unique: true });

module.exports = mongoose.model("Cycle", cycleSchema);

const mongoose = require("mongoose");

// Base Transaction Schema - shared fields for all transaction types
const baseOptions = {
  discriminatorKey: "transactionType",
  collection: "transactions",
  timestamps: true,
};

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: (val) => val > 0,
        message: "Amount must be greater than 0",
      },
    },
    documents: {
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
  },
  baseOptions,
);

// Base Transaction Model
const Transaction = mongoose.model("Transaction", transactionSchema);

// Revenue Transaction - client pays the company
const Revenue = Transaction.discriminator(
  "revenue",
  new mongoose.Schema({
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
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
  }),
);

// Vendor Expense - payment to a vendor via contract
const VendorExpense = Transaction.discriminator(
  "vendor-expense",
  new mongoose.Schema({
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
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
  }),
);

// Tax Expense - tax payment for a project
const TaxExpense = Transaction.discriminator(
  "tax-expense",
  new mongoose.Schema({
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
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
  }),
);

// Other Expense - miscellaneous expenses
const OtherExpense = Transaction.discriminator(
  "other-expense",
  new mongoose.Schema({
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
  }),
);

// Salary Expense - employee salary payments
const salaryExpenseSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
});

// Ensure only one salary transaction per month/year
salaryExpenseSchema.index({ month: 1, year: 1 }, { unique: true });

const SalaryExpense = Transaction.discriminator(
  "salary-expense",
  salaryExpenseSchema,
);

module.exports = {
  Transaction,
  Revenue,
  VendorExpense,
  TaxExpense,
  OtherExpense,
  SalaryExpense,
};

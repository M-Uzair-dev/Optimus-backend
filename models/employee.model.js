const { default: mongoose } = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (val) {
          if (!val) return true; // Allow empty if not required
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    age: {
      type: Number,
      required: false,
      min: 18,
      max: 100,
    },
    role: {
      type: String,
      required: true,
      enum: ["CM", "QS", "Accountant", "Assistant", "Procurement", "PM", "other"],
    },
    employeeOtherRole: {
      type: String,
      required: false,
      trim: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    joinDate: {
      type: Date,
      required: true,
      default: Date.now,
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

// Custom validation based on role
employeeSchema.pre("save", function (next) {
  // Validate that employeeOtherRole is provided when role is "other"
  if (this.role === "other" && !this.employeeOtherRole) {
    return next(
      new Error("employeeOtherRole is required when role is 'other'"),
    );
  }

  // Validate that email and password are provided when role is NOT "assistant" or "other"
  if (this.role !== "Assistant" && this.role !== "other") {
    if (!this.email) {
      return next(new Error("Email is required for this role"));
    }
    if (!this.password) {
      return next(new Error("Password is required for this role"));
    }
  }

  next();
});

module.exports = mongoose.model("Employee", employeeSchema);

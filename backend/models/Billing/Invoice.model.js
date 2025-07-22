const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient Detail", // CORRECTED: Was "PatientDetails"
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [invoiceItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Issued", "Paid", "Partially Paid", "Cancelled"],
      default: "Draft",
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate totalAmount and balance before saving
invoiceSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  this.balance = this.totalAmount - this.amountPaid;
  if (this.balance <= 0 && this.amountPaid > 0) {
    this.status = "Paid";
  } else if (this.amountPaid > 0 && this.balance > 0) {
    this.status = "Partially Paid";
  }
  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true, // Ensures transactionId is unique
    },
    dateTime: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
      index: true, // Adds an index for this field
    },
    paymentProvider: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const Transaction = model("Transaction", transactionSchema);

export default Transaction;

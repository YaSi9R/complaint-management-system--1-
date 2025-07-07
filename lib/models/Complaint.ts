import mongoose from "mongoose"

const ComplaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Product", "Service", "Support", "Billing", "Technical"],
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    dateSubmitted: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
ComplaintSchema.index({ userId: 1 })
ComplaintSchema.index({ status: 1 })
ComplaintSchema.index({ priority: 1 })

export const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema)

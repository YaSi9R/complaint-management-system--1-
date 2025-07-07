import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Complaint } from "@/lib/models/Complaint"
import { sendEmail } from "@/lib/email"
import { getUserFromRequest } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    // Check authentication
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Only admins can update complaint status
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const complaint = await Complaint.findByIdAndUpdate(params.id, { status }, { new: true })

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
    }

    // Send email notification to admin about status update
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@example.com",
        subject: `Complaint Status Updated: ${complaint.title}`,
        html: `
          <h2>Complaint Status Updated</h2>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>New Status:</strong> ${status}</p>
          <p><strong>Category:</strong> ${complaint.category}</p>
          <p><strong>Priority:</strong> ${complaint.priority}</p>
          <p><strong>Submitted by:</strong> ${complaint.userName} (${complaint.userEmail})</p>
          <p><strong>Date Updated:</strong> ${new Date().toLocaleString()}</p>
        `,
      })

      // Also send notification to the user who submitted the complaint
      await sendEmail({
        to: complaint.userEmail,
        subject: `Your Complaint Status Updated: ${complaint.title}`,
        html: `
          <h2>Your Complaint Status Has Been Updated</h2>
          <p>Dear ${complaint.userName},</p>
          <p>Your complaint has been updated with a new status.</p>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>New Status:</strong> ${status}</p>
          <p><strong>Date Updated:</strong> ${new Date().toLocaleString()}</p>
          <p>Thank you for your patience.</p>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
    }

    return NextResponse.json(complaint)
  } catch (error) {
    console.error("Error updating complaint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    // Check authentication
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Only admins can delete complaints
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const complaint = await Complaint.findByIdAndDelete(params.id)

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Complaint deleted successfully" })
  } catch (error) {
    console.error("Error deleting complaint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Complaint } from "@/lib/models/Complaint"
import { sendEmail } from "@/lib/email"
import { getUserFromRequest } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    // Check authentication
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, priority } = body

    if (!title || !description || !category || !priority) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const complaint = new Complaint({
      title,
      description,
      category,
      priority,
      status: "Pending",
      dateSubmitted: new Date(),
      userId: user.userId,
      userEmail: user.email,
      userName: user.name,
    })

    await complaint.save()

    // Send email notification to admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@example.com",
        subject: `New Complaint Submitted: ${title}`,
        html: `
          <h2>New Complaint Submitted</h2>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Priority:</strong> ${priority}</p>
          <p><strong>Submitted by:</strong> ${user.name} (${user.email})</p>
          <p><strong>Description:</strong></p>
          <p>${description}</p>
          <p><strong>Date Submitted:</strong> ${new Date().toLocaleString()}</p>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
    }

    return NextResponse.json(complaint, { status: 201 })
  } catch (error) {
    console.error("Error creating complaint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Check authentication
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    let complaints
    if (user.role === "admin") {
      // Admins can see all complaints
      complaints = await Complaint.find({}).sort({ dateSubmitted: -1 })
    } else {
      // Users can only see their own complaints
      complaints = await Complaint.find({ userId: user.userId }).sort({ dateSubmitted: -1 })
    }

    return NextResponse.json(complaints)
  } catch (error) {
    console.error("Error fetching complaints:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import connectDB from "@/lib/db/connectDB"
import { sendVerificationEmail } from "@/lib/mail/verifyEmail"
import User from "@/models/user.model"
import crypto from "crypto"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email } = await req.json()

    console.log("Resend verification for:", email)

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      )
    }

    const user = await User.findOne({ email })

    if (!user) {
      console.log("User not found:", email)
      return NextResponse.json(
        { message: "No account found with this email" },
        { status: 400 }
      )
    }

    if (user.isVerified) {
      console.log("User already verified:", email)
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      )
    }

    // Generate new verification token
    const token = crypto.randomBytes(32).toString("hex")

    user.verifyToken = token

    // Token expires after 1 hour
    user.verifyTokenExpiry = new Date(Date.now() + 3600000)

    await user.save()

    console.log("Sending verification email to:", email)

    // Send verification email
    await sendVerificationEmail(email, token)

    console.log("Verification email sent successfully")

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully 📩",
    })

  } catch (error: any) {
    console.error("Resend verification error:", error)

    return NextResponse.json(
      {
        message: "Failed to send verification email",
        error: error.message,
      },
      { status: 500 }
    )
  }
}
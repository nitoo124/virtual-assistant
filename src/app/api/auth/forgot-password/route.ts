import connectDB from "@/lib/db/connectDB"
import { sendResetEmail } from "@/lib/mail/resetEmail"
import User from "@/models/user.model"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email } = await req.json()

    const user = await User.findOne({ email })

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 400 }
      )
    }

    const token = crypto.randomBytes(32).toString("hex")

    user.resetPasswordToken = token

    // Token expires after 1 hour
    user.resetPasswordExpiry = new Date(Date.now() + 3600000)

    await user.save()

    await sendResetEmail(email, token)

    return Response.json({
      message: "Reset link sent to email 📩",
    })
  } catch (error) {
    console.error("Forgot password error:", error)

    return Response.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}
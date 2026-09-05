import connectDB from "@/lib/db/connectDB"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { token, password } = await req.json()

    console.log("Reset password request received")
    console.log("Token exists:", !!token)
    console.log("Password exists:", !!password)

    if (!token || !password) {
      return Response.json(
        { message: "Token and password are required" },
        { status: 400 }
      )
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    })

    console.log("User found:", !!user)

    if (!user) {
      return Response.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined

    await user.save()

    console.log("Password reset successfully")

    return Response.json(
      { message: "Password reset successful 🎉" },
      { status: 200 }
    )
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error)

    return Response.json(
      {
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
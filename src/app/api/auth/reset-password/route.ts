import connectDB from "@/lib/db/connectDB"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    console.log("========== RESET PASSWORD START ==========")

    // Connect database
    await connectDB()
    console.log("Database connected")

    // Read request body
    const body = await req.json()

    const token = body?.token
    const password = body?.password

    console.log("Token exists:", !!token)
    console.log("Password exists:", !!password)

    // Validate input
    if (
      typeof token !== "string" ||
      typeof password !== "string" ||
      !token.trim() ||
      !password.trim()
    ) {
      return Response.json(
        {
          success: false,
          message: "Token and password are required",
        },
        { status: 400 }
      )
    }

    // Optional password validation
    if (password.length < 6) {
      return Response.json(
        {
          success: false,
          message: "Password must be at least 6 characters",
        },
        { status: 400 }
      )
    }

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token.trim(),
      resetPasswordExpiry: {
        $gt: new Date(),
      },
    }).select("_id password resetPasswordToken resetPasswordExpiry")

    console.log("User found:", !!user)

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 400 }
      )
    }

    // Hash new password
    console.log("Hashing password...")

    const hashedPassword = await bcrypt.hash(password, 10)

    console.log("Password hashed successfully")

    // Update password and remove reset token
    const updatedUser = await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpiry: "",
        },
      }
    )

    console.log("User updated:", updatedUser.modifiedCount)

    if (updatedUser.modifiedCount !== 1) {
      throw new Error("Password could not be updated")
    }

    console.log("Password reset successfully")
    console.log("========== RESET PASSWORD END ==========")

    return Response.json(
      {
        success: true,
        message: "Password reset successful 🎉",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("========== RESET PASSWORD ERROR ==========")
    console.error(error)

    return Response.json(
      {
        success: false,
        message: "Server error",
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    )
  }
}

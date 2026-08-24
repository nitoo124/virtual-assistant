import connectDB from "@/lib/db/connectDB"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    await connectDB()
    const { token, password } = await req.json()

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    })

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

    return Response.json({ message: "Password reset successful 🎉" })

  } catch (error) {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
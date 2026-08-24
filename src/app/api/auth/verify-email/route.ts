import connectDB from "@/lib/db/connectDB"
import User from "@/models/user.model"

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return Response.json({ message: "Token missing" }, { status: 400 })
    }

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return Response.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      )
    }

    // ✅ verify user
    user.isVerified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined

    await user.save()

    return Response.json({
      message: "Email verified successfully 🎉",
    })

  } catch (error: any) {
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}
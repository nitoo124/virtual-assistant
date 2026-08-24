import connectDB from "@/lib/db/connectDB"
import { sendVerificationEmail } from "@/lib/mail/verifyEmail"
import { registerSchema } from "@/lib/schemas/user.schema"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return Response.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password } = result.data

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return Response.json(
        { message: "User already exists" },
        { status: 400 }
      )
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // ✅ token generate
    const token = crypto.randomBytes(32).toString("hex")

    // ✅ user create
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyToken: token,
      verifyTokenExpiry: Date.now() + 3600000, // 1 hour
    })

    // ✅ email send (IMPORTANT 🔥)
    await sendVerificationEmail(email, token)

    return Response.json({
      message: "User created. Please verify your email 📩",
    })

  } catch (error: any) {
    console.log("🔥 SERVER ERROR:", error)

    return Response.json(
      {
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connectDB"
import User from "@/models/user.model"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    // =========================
    // CONNECT DATABASE
    // =========================

    await connectDB()

    // =========================
    // GET SESSION
    // =========================

    const session =
      await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      )
    }

    // =========================
    // FIND USER
    // =========================

    const user = await User.findOne({
      email: session.user.email,
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      )
    }

    // =========================
    // CHECK ASSISTANT
    // =========================

    if (!user.assistantName) {
      return NextResponse.json(
        {
          success: false,
          message: "No assistant found",
        },
        { status: 404 }
      )
    }

    // =========================
    // DEBUG
    // =========================

    console.log(
      "Assistant found:",
      {
        userName: user.name,
        assistantName:
          user.assistantName,
        assistantImage:
          user.assistantImage,
      }
    )

    // =========================
    // RETURN ASSISTANT
    // =========================

    return NextResponse.json({
      success: true,

      assistant: {
        assistantName:
          user.assistantName,

        assistantImage:
          user.assistantImage,

        // IMPORTANT:
        // This was missing before
        authorName: user.name,
      },
    })
  } catch (error) {
    console.error(
      "Error in get assistant:",
      error
    )

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred"

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}

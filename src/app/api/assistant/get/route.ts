// app/api/assistant/get/route.ts
import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connectDB"
import User from "@/models/user.model"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      )
    }

    const user = await User.findOne({ email: session.user.email })

    if (!user || !user.assistantName) {
      return NextResponse.json({
        success: false,
        message: "No assistant found",
      })
    }

    return NextResponse.json({
      success: true,
      assistant: {
        assistantName: user.assistantName,
        assistantImage: user.assistantImage,
      }
    })

  } catch (error) {
    console.error("Error in get assistant:", error)
    
    // ✅ Fix: Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    
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
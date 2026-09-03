import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import connectDB from "@/lib/db/connectDB"
import User from "@/models/user.model"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: NextRequest) {
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

    const { name, image, type } = await req.json()

    let finalImage = image

    // Upload image to Cloudinary if needed
    if (type === "upload" && image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "assistants",
      })

      finalImage = uploadRes.secure_url
    }

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        assistantName: name,
        assistantImage: finalImage,
      },
      {
        new: true,
      }
    )

    // User not found
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Assistant created successfully",
      assistant: {
        name: updatedUser.assistantName,
        image: updatedUser.assistantImage,
      },
    })
  } catch (error) {
    console.error("Assistant create error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    )
  }
}
// app/api/assistant/create/route.js (update your existing API)
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

    if (type === "upload" && image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "assistants",
      })
      finalImage = uploadRes.secure_url
    }

    // Update user and get the updated document
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        assistantName: name,
        assistantImage: finalImage,
      },
      { new: true } // ✅ This returns the updated document
    )

    return NextResponse.json({
      success: true,
      message: "Assistant created successfully",
      assistant: {
        name: updatedUser.assistantName,
        image: updatedUser.assistantImage,
      }
    })

  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    )
  }
}
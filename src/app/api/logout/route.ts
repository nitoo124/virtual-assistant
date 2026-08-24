import { NextResponse } from "next/server"

export async function POST() {
  try {

    // cookie remove
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    })

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })

    return response

  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
      },
      { status: 500 }
    )
  }
}
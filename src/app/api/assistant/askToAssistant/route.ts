import { generateContent } from "@/gemini";
import connectDB from "@/lib/db/connectDB";
import User from "@/models/user.model";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userPrompt, assistantName, authorName } = await req.json();

    // Validate input
    if (!userPrompt || !authorName) {
      return NextResponse.json(
        {
          success: false,
          message: "User prompt and author name are required",
        },
        { status: 400 }
      );
    }

    // Check user in MongoDB
    const user = await User.findOne({
      name: authorName,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Use values from database
    const userName = user.name;
    const userAssistantName = assistantName || user.assistantName;

    // Call Gemini only after user exists
    const result = await generateContent(
      userPrompt,
      userAssistantName,
      userName
    );

    /*
     * Gemini response ko extract karo.
     * Gemini API ka response format provider ke according
     * different ho sakta hai, isliye raw response ko safely handle kar rahe hain.
     */
    let geminiText: string;

    if (typeof result === "string") {
      geminiText = result;
    } else if (result?.output_text) {
      geminiText = result.output_text;
    } else if (result?.text) {
      geminiText = result.text;
    } else if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      geminiText = result.candidates[0].content.parts[0].text;
    } else {
      geminiText = JSON.stringify(result);
    }

    // Extract JSON object from Gemini response
    const jsonMatch = geminiText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        {
          success: false,
          response: "Sorry, I can't understand that.",
        },
        { status: 400 }
      );
    }

    let gemResult;

    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Gemini JSON Parse Error:", error);

      return NextResponse.json(
        {
          success: false,
          response: "Sorry, I can't understand that.",
        },
        { status: 400 }
      );
    }

    const type = gemResult.type;

    // Pakistan timezone
    const now = moment().tz("Asia/Karachi");

    switch (type) {
      // -------------------------
      // GENERAL
      // -------------------------
      case "general":
        return NextResponse.json({
          success: true,
          type: "general",
          response: gemResult.response,
        });

      // -------------------------
      // GOOGLE SEARCH
      // -------------------------
      case "google_search":
        return NextResponse.json({
          success: true,
          type: "google_search",
          response: gemResult.response,
          query: userPrompt,
        });

      // -------------------------
      // YOUTUBE SEARCH
      // -------------------------
      case "youtube_search":
        return NextResponse.json({
          success: true,
          type: "youtube_search",
          response: gemResult.response,
          query: userPrompt,
        });

      // -------------------------
      // YOUTUBE PLAY
      // -------------------------
      case "youtube_play":
        return NextResponse.json({
          success: true,
          type: "youtube_play",
          response: gemResult.response,
          query: userPrompt,
        });

      // -------------------------
      // CALCULATOR
      // -------------------------
      case "calculator_open":
        return NextResponse.json({
          success: true,
          type: "calculator_open",
          response: "Sure, opening the calculator.",
        });

      // -------------------------
      // INSTAGRAM
      // -------------------------
      case "instagram_open":
        return NextResponse.json({
          success: true,
          type: "instagram_open",
          response: "Sure, opening Instagram.",
        });

      // -------------------------
      // FACEBOOK
      // -------------------------
      case "facebook_open":
        return NextResponse.json({
          success: true,
          type: "facebook_open",
          response: "Sure, opening Facebook.",
        });

      // -------------------------
      // WEATHER
      // -------------------------
      case "weather-show":
        return NextResponse.json({
          success: true,
          type: "weather-show",
          response: "Sure, I'll check the weather.",
        });

      // -------------------------
      // CURRENT TIME
      // -------------------------
      case "get_time":
        return NextResponse.json({
          success: true,
          type: "get_time",
          response: `The current time is ${now.format("hh:mm A")}.`,
          data: {
            time: now.format("hh:mm A"),
            timezone: "Asia/Karachi",
          },
        });

      // -------------------------
      // CURRENT DATE
      // -------------------------
      case "get_date":
        return NextResponse.json({
          success: true,
          type: "get_date",
          response: `Today's date is ${now.format("MMMM Do, YYYY")}.`,
          data: {
            date: now.format("YYYY-MM-DD"),
            formattedDate: now.format("MMMM Do, YYYY"),
            timezone: "Asia/Karachi",
          },
        });

      // -------------------------
      // CURRENT DAY
      // -------------------------
      case "get_day":
        return NextResponse.json({
          success: true,
          type: "get_day",
          response: `Today is ${now.format("dddd")}.`,
          data: {
            day: now.format("dddd"),
            timezone: "Asia/Karachi",
          },
        });

      // -------------------------
      // CURRENT MONTH
      // -------------------------
      case "get_month":
        return NextResponse.json({
          success: true,
          type: "get_month",
          response: `The current month is ${now.format("MMMM")}.`,
          data: {
            month: now.format("MMMM"),
            timezone: "Asia/Karachi",
          },
        });

      // -------------------------
      // UNKNOWN TYPE
      // -------------------------
      default:
        return NextResponse.json({
          success: true,
          type,
          response:
            gemResult.response || "Sorry, I can't understand that.",
        });
    }
  } catch (error: any) {
    console.error("Assistant API Error:", error);

    return NextResponse.json(
      {
        success: false,
        response: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
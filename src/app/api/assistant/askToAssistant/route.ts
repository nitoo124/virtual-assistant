import { generateContent } from "@/gemini";
import connectDB from "@/lib/db/connectDB";
import User from "@/models/user.model";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("🚀 API CALLED - /api/assistant/askToAssistant");

  try {
    // =========================
    // DATABASE
    // =========================

    await connectDB();
    console.log("✅ Database connected");

    // =========================
    // REQUEST BODY
    // =========================

    const body = await req.json();

    console.log("📦 Request body:", body);

    const {
      userPrompt,
      assistantName,
      authorName,
    } = body;

    // =========================
    // VALIDATION
    // =========================

    if (
      typeof userPrompt !== "string" ||
      !userPrompt.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          type: "validation_error",
          response: "User prompt is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof authorName !== "string" ||
      !authorName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          type: "validation_error",
          response: "Author name is required.",
        },
        { status: 400 }
      );
    }

    const cleanPrompt = userPrompt.trim();
    const cleanAuthorName = authorName.trim();

    const cleanAssistantName =
      typeof assistantName === "string"
        ? assistantName.trim()
        : "";

    // =========================
    // FIND USER
    // =========================

    console.log(
      "🔍 Searching user:",
      cleanAuthorName
    );

    const user = await User.findOne({
      name: cleanAuthorName,
    });

    if (!user) {
      console.log(
        "❌ User not found:",
        cleanAuthorName
      );

      return NextResponse.json(
        {
          success: false,
          type: "user_not_found",
          response: `User not found: ${cleanAuthorName}`,
        },
        { status: 404 }
      );
    }

    console.log("✅ User found:", user.name);

    // =========================
    // ASSISTANT DETAILS
    // =========================

    const finalAssistantName =
      cleanAssistantName ||
      user.assistantName?.trim() ||
      "Assistant";

    const finalAuthorName =
      user.name?.trim() ||
      cleanAuthorName;

    console.log(
      "🤖 Assistant:",
      finalAssistantName
    );

    console.log(
      "👤 Author:",
      finalAuthorName
    );

    console.log(
      "💬 Prompt:",
      cleanPrompt
    );

    // =========================
    // GEMINI
    // =========================

    console.log("🤖 Calling Gemini...");

    let result: any;

    try {
      result = await generateContent(
        cleanPrompt,
        finalAssistantName,
        finalAuthorName
      );

      console.log(
        "✅ Gemini Result:",
        result
      );
    } catch (error: any) {
      console.error(
        "❌ GEMINI ERROR:",
        error
      );

      const errorMessage =
        error?.message ||
        "Gemini API request failed.";

      const lowerError =
        errorMessage.toLowerCase();

      // =========================
      // RATE LIMIT / QUOTA
      // =========================

      if (
        errorMessage.includes("429") ||
        lowerError.includes("quota") ||
        lowerError.includes("rate limit") ||
        lowerError.includes("resource exhausted")
      ) {
        return NextResponse.json(
          {
            success: false,
            type: "rate_limit",
            response:
              "Gemini is temporarily busy. Please try again in a few seconds.",
          },
          { status: 429 }
        );
      }

      // =========================
      // OTHER GEMINI ERROR
      // =========================

      return NextResponse.json(
        {
          success: false,
          type: "gemini_error",
          response:
            "Gemini API error: " +
            errorMessage,
        },
        { status: 500 }
      );
    }

    // =========================
    // VALIDATE GEMINI RESULT
    // =========================

    if (
      !result ||
      typeof result !== "object"
    ) {
      console.error(
        "❌ Invalid Gemini result:",
        result
      );

      return NextResponse.json(
        {
          success: false,
          type: "gemini_error",
          response:
            "Invalid response received from Gemini.",
        },
        { status: 500 }
      );
    }

    // =========================
    // RESULT VALUES
    // =========================

    const type =
      typeof result.type === "string"
        ? result.type
        : "general";

    const assistantResponse =
      typeof result.response === "string" &&
      result.response.trim()
        ? result.response.trim()
        : "I'm here to help you.";

    console.log(
      "📌 Assistant type:",
      type
    );

    console.log(
      "💬 Assistant response:",
      assistantResponse
    );

    // =========================
    // CURRENT PAKISTAN TIME
    // =========================

    const now = moment().tz(
      "Asia/Karachi"
    );

    // =========================
    // SAVE HISTORY
    // =========================

    try {
      // Make sure history always exists
      if (!Array.isArray(user.history)) {
        user.history = [];
      }

      user.history.push(
        `User: ${cleanPrompt}`
      );

      user.history.push(
        `${finalAssistantName}: ${assistantResponse}`
      );

      await user.save();

      console.log(
        "💾 Conversation saved to history."
      );
    } catch (historyError: any) {
      console.error(
        "⚠️ HISTORY SAVE ERROR:",
        historyError
      );

      // Do not fail the assistant response
      // just because history saving failed.
    }

    // =========================
    // GENERAL
    // =========================

    if (type === "general") {
      return NextResponse.json({
        success: true,
        type: "general",
        response: assistantResponse,
      });
    }

    // =========================
    // GOOGLE OPEN
    // =========================

    if (type === "google_open") {
      return NextResponse.json({
        success: true,
        type: "google_open",
        response: assistantResponse,
        url: "https://www.google.com",
      });
    }

    // =========================
    // GOOGLE SEARCH
    // =========================

    if (type === "google_search") {
      const query =
        typeof result.query === "string" &&
        result.query.trim()
          ? result.query.trim()
          : cleanPrompt;

      return NextResponse.json({
        success: true,
        type: "google_search",
        response: assistantResponse,
        query,
      });
    }

    // =========================
    // YOUTUBE OPEN
    // =========================

    if (type === "youtube_open") {
      return NextResponse.json({
        success: true,
        type: "youtube_open",
        response: assistantResponse,
        url: "https://www.youtube.com",
      });
    }

    // =========================
    // YOUTUBE SEARCH
    // =========================

    if (type === "youtube_search") {
      const query =
        typeof result.query === "string" &&
        result.query.trim()
          ? result.query.trim()
          : cleanPrompt;

      return NextResponse.json({
        success: true,
        type: "youtube_search",
        response: assistantResponse,
        query,
      });
    }

    // =========================
    // YOUTUBE PLAY
    // =========================

    if (type === "youtube_play") {
      const query =
        typeof result.query === "string" &&
        result.query.trim()
          ? result.query.trim()
          : cleanPrompt;

      return NextResponse.json({
        success: true,
        type: "youtube_play",
        response: assistantResponse,
        query,
      });
    }

    // =========================
    // LINKEDIN
    // =========================

    if (type === "linkedin_open") {
      return NextResponse.json({
        success: true,
        type: "linkedin_open",
        response: assistantResponse,
        url: "https://www.linkedin.com",
      });
    }

    // =========================
    // INSTAGRAM
    // =========================

    if (type === "instagram_open") {
      return NextResponse.json({
        success: true,
        type: "instagram_open",
        response: assistantResponse,
        url: "https://www.instagram.com",
      });
    }

    // =========================
    // FACEBOOK
    // =========================

    if (type === "facebook_open") {
      return NextResponse.json({
        success: true,
        type: "facebook_open",
        response: assistantResponse,
        url: "https://www.facebook.com",
      });
    }

    // =========================
    // CALCULATOR
    // =========================

    if (type === "calculator_open") {
      return NextResponse.json({
        success: true,
        type: "calculator_open",
        response: assistantResponse,
        url:
          "https://www.google.com/search?q=calculator",
      });
    }

    // =========================
    // WEATHER
    // =========================

    if (type === "weather-show") {
      return NextResponse.json({
        success: true,
        type: "weather-show",
        response: assistantResponse,
        url:
          "https://www.google.com/search?q=weather",
      });
    }

    // =========================
    // TIME
    // =========================

    if (type === "get_time") {
      return NextResponse.json({
        success: true,
        type: "get_time",
        response:
          `The current time is ${now.format(
            "hh:mm A"
          )}.`,
        data: {
          time: now.format("hh:mm A"),
          timezone: "Asia/Karachi",
        },
      });
    }

    // =========================
    // DATE
    // =========================

    if (type === "get_date") {
      return NextResponse.json({
        success: true,
        type: "get_date",
        response:
          `Today's date is ${now.format(
            "MMMM Do, YYYY"
          )}.`,
        data: {
          date: now.format("YYYY-MM-DD"),
          formattedDate:
            now.format("MMMM Do, YYYY"),
          timezone: "Asia/Karachi",
        },
      });
    }

    // =========================
    // DAY
    // =========================

    if (type === "get_day") {
      return NextResponse.json({
        success: true,
        type: "get_day",
        response:
          `Today is ${now.format("dddd")}.`,
        data: {
          day: now.format("dddd"),
          timezone: "Asia/Karachi",
        },
      });
    }

    // =========================
    // MONTH
    // =========================

    if (type === "get_month") {
      return NextResponse.json({
        success: true,
        type: "get_month",
        response:
          `The current month is ${now.format(
            "MMMM"
          )}.`,
        data: {
          month: now.format("MMMM"),
          timezone: "Asia/Karachi",
        },
      });
    }

    // =========================
    // DEFAULT
    // =========================

    console.warn(
      "⚠️ Unknown assistant type:",
      type
    );

    return NextResponse.json({
      success: true,
      type: "general",
      response: assistantResponse,
    });
  } catch (error: any) {
    console.error(
      "❌ ASSISTANT API ERROR:",
      error
    );

    console.error(
      "❌ Error message:",
      error?.message
    );

    console.error(
      "❌ Error stack:",
      error?.stack
    );

    return NextResponse.json(
      {
        success: false,
        type: "server_error",
        response:
          error?.message ||
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

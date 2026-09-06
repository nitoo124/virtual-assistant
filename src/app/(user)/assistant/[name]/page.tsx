"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import aiImg from "../../../../../public/assets/ai.gif";
import userImg from "../../../../../public/assets/user.gif";

import axios, { AxiosError } from "axios";

import { ArrowLeft, LogOut, Settings } from "lucide-react";

import Image from "next/image";
import { Button } from "@/components/ui/button";

import { useAssistant } from "@/src/context/AssistantContext";

interface Assistant {
  assistantName: string;
  assistantImage: string;
  authorName?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  assistant?: Assistant;
}

interface AssistantResult {
  success?: boolean;
  type: string;
  response: string;
  query?: string;
  url?: string;
  data?: {
    time?: string;
    date?: string;
    formattedDate?: string;
    day?: string;
    month?: string;
    timezone?: string;
  };
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

function AssistantPage() {
  const router = useRouter();

  const {
    askAssistant,
    loading: assistantLoading,
    error: assistantError,
  } = useAssistant();

  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // CONVERSATION MESSAGES
  // ========================================

  const [messages, setMessages] = useState<Message[]>([]);

  // ========================================
  // GIF STATE
  // ========================================

  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const [logoutLoading, setLogoutLoading] = useState(false);

  // ========================================
  // REFS
  // ========================================

  const recognitionRef = useRef<any>(null);

  const isStartingRef = useRef(false);

  const shouldRestartRef = useRef(true);

  const commandRunningRef = useRef(false);

  // ========================================
  // OPEN URL HELPER
  // ========================================

  const openInNewTab = (url: string) => {
    console.log("🚀 Opening URL:", url);

    try {
      const newWindow = window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        console.log("⚠️ Popup blocked, using anchor fallback...");

        const link = document.createElement("a");

        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("❌ Failed to open URL:", error);

      window.location.href = url;
    }
  };

  // ========================================
  // FETCH ASSISTANT
  // ========================================

  useEffect(() => {
    fetchAssistant();
  }, []);

  const fetchAssistant = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get<ApiResponse>(
        "/api/assistant/get"
      );

      console.log("Assistant API response:", data);

      if (data.success && data.assistant) {
        setAssistant(data.assistant);
      } else {
        setError(data.message || "No assistant found");
      }
    } catch (err: unknown) {
      console.error("Fetch assistant error:", err);

      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch assistant"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      shouldRestartRef.current = false;

      try {
        recognitionRef.current?.stop();
      } catch {}

      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }

      await axios.post("/api/logout");

      localStorage.removeItem("token");

      router.push("/sign-in");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  // ========================================
  // OPEN / SEARCH COMMAND
  // ========================================

  const handleCommand = (
    type: string,
    query?: string,
    url?: string
  ) => {
    console.log("Executing command:", {
      type,
      query,
      url,
    });

    // ======================================
    // GOOGLE SEARCH
    // ======================================

    if (type === "google_search") {
      const searchQuery = query?.trim();

      if (!searchQuery) {
        openInNewTab("https://www.google.com");
        return;
      }

      const encodedQuery =
        encodeURIComponent(searchQuery);

      const targetUrl =
        `https://www.google.com/search?q=${encodedQuery}`;

      console.log(
        "🔍 Opening Google Search:",
        targetUrl
      );

      openInNewTab(targetUrl);

      return;
    }

    // ======================================
    // YOUTUBE SEARCH
    // ======================================

    if (type === "youtube_search") {
      const searchQuery = query?.trim();

      console.log(
        "🎥 YouTube Query:",
        searchQuery
      );

      if (!searchQuery) {
        openInNewTab("https://www.youtube.com");
        return;
      }

      const encodedQuery =
        encodeURIComponent(searchQuery);

      const targetUrl =
        `https://www.youtube.com/results?search_query=${encodedQuery}`;

      console.log(
        "🎥 Opening YouTube Search:",
        targetUrl
      );

      openInNewTab(targetUrl);

      return;
    }

    // ======================================
    // YOUTUBE PLAY
    // ======================================

    if (type === "youtube_play") {
      const searchQuery = query?.trim();

      console.log(
        "▶️ YouTube Play Query:",
        searchQuery
      );

      if (!searchQuery) {
        openInNewTab("https://www.youtube.com");
        return;
      }

      const encodedQuery =
        encodeURIComponent(searchQuery);

      const targetUrl =
        `https://www.youtube.com/results?search_query=${encodedQuery}`;

      console.log(
        "▶️ Opening YouTube:",
        targetUrl
      );

      openInNewTab(targetUrl);

      return;
    }

    // ======================================
    // FIXED WEBSITE URLS
    // ======================================

    const urlMap: Record<string, string> = {
      google_open:
        "https://www.google.com",

      youtube_open:
        "https://www.youtube.com",

      linkedin_open:
        "https://www.linkedin.com",

      instagram_open:
        "https://www.instagram.com",

      facebook_open:
        "https://www.facebook.com",

      calculator_open:
        "https://www.google.com/search?q=calculator",

      "weather-show":
        "https://www.google.com/search?q=weather",
    };

    // ======================================
    // OPEN URL
    // ======================================

    const targetUrl =
      url?.trim() || urlMap[type];

    if (targetUrl) {
      console.log(
        "🌐 Opening URL:",
        targetUrl
      );

      openInNewTab(targetUrl);

      return;
    }

    // ======================================
    // GENERAL RESPONSE
    // ======================================

    console.log(
      "ℹ️ No browser action for:",
      type
    );
  };

  // ========================================
  // SPEECH RECOGNITION
  // ========================================

  useEffect(() => {
    if (!assistant) {
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error(
        "Speech Recognition is not supported in this browser."
      );

      return;
    }

    shouldRestartRef.current = true;

    const speechRecognition =
      new SpeechRecognition();

    recognitionRef.current =
      speechRecognition;

    speechRecognition.continuous = true;

    speechRecognition.interimResults = false;

    speechRecognition.lang = "en-US";

    // ======================================
    // SPEECH RESULT
    // ======================================

    speechRecognition.onresult = async (
      e: any
    ) => {
      const resultIndex = e.resultIndex;

      const transcript =
        e.results[resultIndex]?.[0]?.transcript?.trim();

      if (!transcript) {
        return;
      }

      // ==================================
      // 👤 USER MESSAGE - SIRF 1 MESSAGE RAKHNE KE LIYE
      // ==================================

      setMessages([{
        role: "user",
        text: transcript,
      }]);

      setIsAISpeaking(false);

      console.log(
        "🗣️ User said:",
        transcript
      );

      // ==================================
      // ASSISTANT NAME
      // ==================================

      const assistantName =
        assistant.assistantName.trim();

      if (!assistantName) {
        return;
      }

      // ==================================
      // ESCAPE REGEX
      // ==================================

      const escapedName =
        assistantName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

      const nameRegex =
        new RegExp(
          `\\b${escapedName}\\b`,
          "i"
        );

      // ==================================
      // CHECK ASSISTANT NAME
      // ==================================

      if (!nameRegex.test(transcript)) {
        return;
      }

      // ==================================
      // REMOVE ASSISTANT NAME
      // ==================================

      const userPrompt =
        transcript
          .replace(nameRegex, "")
          .trim();

      console.log(
        "💬 User Prompt:",
        userPrompt
      );

      if (!userPrompt) {
        console.log(
          "Assistant name detected but no command."
        );

        return;
      }

      // ==================================
      // PREVENT DUPLICATE COMMAND
      // ==================================

      if (commandRunningRef.current) {
        console.log(
          "⏳ A command is already running."
        );

        return;
      }

      commandRunningRef.current = true;

      // ==================================
      // AUTHOR NAME
      // ==================================

      const authorName =
        assistant.authorName?.trim();

      if (!authorName) {
        console.error(
          "Assistant authorName is missing:",
          assistant
        );

        commandRunningRef.current = false;

        return;
      }

      console.log(
        "📤 Sending assistant request:",
        {
          userPrompt,
          assistantName,
          authorName,
        }
      );

      try {
        // ================================
        // CALL BACKEND
        // ================================

        const result =
          (await askAssistant(
            userPrompt,
            assistantName,
            authorName
          )) as AssistantResult;

        console.log(
          "📥 Assistant Response:",
          result
        );

        if (!result) {
          throw new Error(
            "No assistant response received."
          );
        }

        // ================================
        // 🤖 ASSISTANT MESSAGE - SIRF AI KA MESSAGE
        // ================================

        if (result.response) {
          setMessages([{
            role: "assistant",
            text: result.response,
          }]);
        }

        setIsAISpeaking(true);

        // ================================
        // EXECUTE COMMAND
        // ================================

        setTimeout(() => {
          handleCommand(
            result.type,
            result.query,
            result.url
          );
        }, 100);

        // ================================
        // TEXT TO SPEECH
        // ================================

        if (
          typeof window !== "undefined" &&
          "speechSynthesis" in window &&
          result.response
        ) {
          window.speechSynthesis.cancel();

          const speech =
            new SpeechSynthesisUtterance(
              result.response
            );

          speech.lang = "en-US";

          speech.rate = 1;

          speech.pitch = 1;

          // 🤖 AI START SPEAKING

          speech.onstart = () => {
            setIsAISpeaking(true);
          };

          // 🤖 AI FINISHED

          speech.onend = () => {
            setIsAISpeaking(false);
          };

          // 🤖 AI SPEECH ERROR

          speech.onerror = () => {
            setIsAISpeaking(false);
          };

          window.speechSynthesis.speak(
            speech
          );
        } else {
          // No TTS response

          setIsAISpeaking(false);
        }
      } catch (error) {
        console.error(
          "❌ Assistant Error:",
          error
        );

        setIsAISpeaking(false);
      } finally {
        commandRunningRef.current = false;
      }
    };

    // ========================================
    // SPEECH ERROR
    // ========================================

    speechRecognition.onerror = (
      event: any
    ) => {
      console.error(
        "⚠️ Speech Recognition Error:",
        event.error
      );

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "audio-capture"
      ) {
        shouldRestartRef.current = false;

        try {
          speechRecognition.stop();
        } catch {}
      }

      if (event.error === "network") {
        console.log(
          "Temporary speech recognition network error."
        );
      }
    };

    // ========================================
    // SPEECH END
    // ========================================

    speechRecognition.onend = () => {
      if (!shouldRestartRef.current) {
        console.log(
          "Speech recognition stopped."
        );

        return;
      }

      if (isStartingRef.current) {
        return;
      }

      isStartingRef.current = true;

      setTimeout(() => {
        if (!shouldRestartRef.current) {
          isStartingRef.current = false;
          return;
        }

        try {
          speechRecognition.start();

          console.log(
            "Speech recognition restarted."
          );
        } catch {
          console.log(
            "Speech recognition restart skipped."
          );
        } finally {
          isStartingRef.current = false;
        }
      }, 1000);
    };

    // ========================================
    // START SPEECH
    // ========================================

    try {
      isStartingRef.current = true;

      speechRecognition.start();

      console.log(
        "🎤 Speech recognition started."
      );
    } catch (error) {
      console.error(
        "Speech recognition start error:",
        error
      );
    } finally {
      isStartingRef.current = false;
    }

    // ========================================
    // CLEANUP
    // ========================================

    return () => {
      shouldRestartRef.current = false;

      speechRecognition.onresult = null;

      speechRecognition.onerror = null;

      speechRecognition.onend = null;

      try {
        speechRecognition.stop();
      } catch {}

      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }

      recognitionRef.current = null;
    };
  }, [assistant, askAssistant]);

  // ========================================
  // LOADING SCREEN
  // ========================================

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-black via-[#050544] to-[#020236] flex justify-center items-center">
        <div className="text-white text-3xl font-bold animate-pulse">
          Loading your assistant...
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR SCREEN
  // ========================================

  if (error || !assistant) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-black via-[#050544] to-[#020236] flex justify-center items-center flex-col gap-5 px-4">
        <div className="text-white text-2xl font-semibold text-center">
          {error || "No assistant found"}
        </div>

        <Button
          onClick={() =>
            router.push("/customize")
          }
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-5"
        >
          Create Assistant
        </Button>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-[#050544] to-[#020236] text-white overflow-hidden">

      {/* NAVBAR */}

      <div className="w-full flex items-center justify-between px-5 md:px-10 py-4 border-b border-white/10 backdrop-blur-md">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 hover:text-blue-400 transition duration-300"
        >
          <ArrowLeft size={30} />
        </button>

        <div className="flex items-center gap-3">

          <Button
            onClick={() =>
              router.push("/customize")
            }
            className="bg-white/10 border border-white/20 hover:bg-white/20 text-white backdrop-blur-xl rounded-xl"
          >
            <Settings className="mr-2 h-4 w-4" />
            Customize
          </Button>

          <Button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
          >
            <LogOut className="mr-2 h-4 w-4" />

            {logoutLoading
              ? "Logging out..."
              : "Logout"}
          </Button>

        </div>
      </div>

      {/* MAIN */}

      <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col items-center">

        {/* ASSISTANT IMAGE */}

        <div className="relative group">

          <div className="absolute inset-0 bg-blue-500 blur-[90px] opacity-30 group-hover:opacity-50 transition duration-500" />

          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 shadow-[0_0_80px_rgba(59,130,246,0.25)]">

            <Image
              src={assistant.assistantImage}
              alt={assistant.assistantName}
              width={400}
              height={400}
              priority
              className="rounded-2xl object-cover"
            />

          </div>
        </div>

        {/* NAME */}

        <h1 className="text-2xl md:text-6xl font-extrabold mt-2 text-center bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
          I'm{" "}
          {assistant.assistantName}
        </h1>

        {/* USER / AI GIF */}

        <div className="mt-[-85px] md:mt-[-110px] lg:mt-[-100px] flex justify-center items-center">

          <div className="relative flex items-center justify-center">

            <Image
              src={
                isAISpeaking
                  ? aiImg
                  : userImg
              }
              alt={
                isAISpeaking
                  ? "AI speaking"
                  : "User speaking"
              }
              width={300}
              height={300}
              priority
              unoptimized
              className="
                w-[300px]
                h-[300px]
                md:w-[400px]
                md:h-[400px]
                object-contain
                mix-blend-screen
              "
            />

          </div>
        </div>

        {/* ==================================
            CENTER TEXT - SIRF LAST MESSAGE
        ================================== */}

        <div className="
         w-full max-w-2xl px-2 min-h-[80px] flex items-center justify-center">
          {messages.length === 0 ? (
            <div className="text-white/20 text-sm">Say something...</div>
          ) : (
            (() => {
              const lastMessage = messages[messages.length - 1];
              return (
                <div
                  className={`text-center max-w-[90%] rounded-2xl px-6  backdrop-blur-xl border ${
                    lastMessage.role === "user"
                      ? "border-blue-400/20 bg-blue-500/10 text-blue-100"
                      : "border-purple-400/20 bg-purple-500/10 text-purple-100"
                  }`}
                >
                  <p className="text-lg md:text-2xl font-medium leading-relaxed">
                    {lastMessage.text}
                  </p>
                </div>
              );
            })()
          )}
        </div>

      </div>
    </div>
  );
}

export default AssistantPage;
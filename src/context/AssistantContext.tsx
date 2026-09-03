"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type AssistantDataType = {
  image: string | null;
  type: "default" | "upload" | null;
};

type AssistantResponse = {
  success: boolean;
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
};

type AssistantContextType = {
  assistantData: AssistantDataType;
  setAssistantData: (data: AssistantDataType) => void;

  askAssistant: (
    userPrompt: string,
    assistantName: string,
    authorName: string
  ) => Promise<AssistantResponse>;

  loading: boolean;
  error: string | null;
};

const AssistantContext =
  createContext<AssistantContextType | null>(null);

export function AssistantProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [assistantData, setAssistantData] =
    useState<AssistantDataType>({
      image: null,
      type: null,
    });

  const [loading, setLoading] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const askAssistant = useCallback(
    async (
      userPrompt: string,
      assistantName: string,
      authorName: string
    ): Promise<AssistantResponse> => {
      try {
        setLoading(true);
        setError(null);

        const cleanPrompt = userPrompt
          .replace(/^[\s,.:;!?-]+/, "")
          .replace(/\s+/g, " ")
          .trim();

        const cleanAssistantName =
          assistantName.trim();

        const cleanAuthorName =
          authorName.trim();

        if (!cleanPrompt) {
          throw new Error("User prompt is empty");
        }

        if (!cleanAssistantName) {
          throw new Error(
            "Assistant name is missing"
          );
        }

        if (!cleanAuthorName) {
          throw new Error(
            "Author name is missing"
          );
        }

        console.log(
          "Sending assistant request:",
          {
            userPrompt: cleanPrompt,
            assistantName:
              cleanAssistantName,
            authorName:
              cleanAuthorName,
          }
        );

        const response =
          await axios.post<AssistantResponse>(
            "/api/assistant/askToAssistant",
            {
              userPrompt: cleanPrompt,
              assistantName:
                cleanAssistantName,
              authorName:
                cleanAuthorName,
            }
          );

        console.log(
          "Assistant API response:",
          response.data
        );

        const data = response.data;

        if (!data.success) {
          throw new Error(
            data.response ||
              "Something went wrong"
          );
        }

        return data;
      } catch (error) {
        console.error(
          "askAssistant error:",
          error
        );

        const message =
          axios.isAxiosError(error)
            ? error.response?.data
                ?.message ||
              error.response?.data
                ?.response ||
              error.message
            : error instanceof Error
            ? error.message
            : "Something went wrong";

        setError(message);

        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <AssistantContext.Provider
      value={{
        assistantData,
        setAssistantData,
        askAssistant,
        loading,
        error,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context =
    useContext(AssistantContext);

  if (!context) {
    throw new Error(
      "useAssistant must be used within an AssistantProvider"
    );
  }

  return context;
}
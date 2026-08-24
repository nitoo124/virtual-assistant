"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// Define types
type AssistantDataType = {
  image: string | null
  type: "default" | "upload" | null
}

type AssistantContextType = {
  assistantData: AssistantDataType
  setAssistantData: (data: AssistantDataType) => void
}

// Create context with a default value (null is acceptable)
const AssistantContext = createContext<AssistantContextType | null>(null)

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [assistantData, setAssistantData] = useState<AssistantDataType>({
    image: null,
    type: null
  })

  return (
    <AssistantContext.Provider value={{ assistantData, setAssistantData }}>
      {children}
    </AssistantContext.Provider>
  )
}

export function useAssistant() {
  const context = useContext(AssistantContext)
  if (!context) {
    throw new Error("useAssistant must be used within an AssistantProvider")
  }
  return context
}
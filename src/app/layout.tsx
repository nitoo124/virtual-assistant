import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AssistantProvider } from "../context/AssistantContext";

export const metadata: Metadata = {
  title: "Virtual Assistant",
  description: "AI Virtual Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AssistantProvider>
          {children}
        </AssistantProvider>

        <Toaster richColors />
      </body>
    </html>
  );
}
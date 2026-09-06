import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AssistantProvider } from "../context/AssistantContext";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Virtual Assistant",
  description: "AI Virtual Assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SmoothScroll>
          <AssistantProvider>{children}</AssistantProvider>
        </SmoothScroll>
        <Toaster richColors />
      </body>
    </html>
  );
}
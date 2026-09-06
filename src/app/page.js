import Background from "@/components/home/Background";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Experience from "@/components/home/Experience";
import Technology from "@/components/home/Technology";
import CTA from "@/components/home/CTA";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#02021c] text-white">
      <Background />
      <Navbar />
      <Hero />
      <Features />
      <Experience />
      <Technology />
      <CTA />
      <Footer />
    </main>
  );
}
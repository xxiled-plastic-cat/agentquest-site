import Hero from "./components/Hero";
import TerminalSection from "./components/TerminalSection";
import Features from "./components/Features";
import AgentLogbooks from "./components/AgentLogbooks";
import LoreOverview from "./components/LoreOverview";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Hero />
      <TerminalSection />
      <LoreOverview />
      <Features />
      <AgentLogbooks />
      <CTA />
      <Footer />
    </>
  );
}

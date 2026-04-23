import Hero from "./components/Hero";
import TerminalSection from "./components/TerminalSection";
import Features from "./components/Features";
import EconomySection from "./components/EconomySection";
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
      <EconomySection />
      <AgentLogbooks />
      <CTA />
      <Footer />
    </>
  );
}

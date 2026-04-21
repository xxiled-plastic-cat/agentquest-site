import Hero from "./components/Hero";
import TerminalSection from "./components/TerminalSection";
import Features from "./components/Features";
import WorldLog from "./components/WorldLog";
import AgentLogbooks from "./components/AgentLogbooks";
import AgentConfig from "./components/AgentConfig";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Hero />
      <TerminalSection />
      <Features />
      <WorldLog />
      <AgentLogbooks />
      <AgentConfig />
      <CTA />
      <Footer />
    </>
  );
}

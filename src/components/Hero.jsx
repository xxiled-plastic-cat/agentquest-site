import { TypeAnimation } from "react-type-animation";
import { scrollToSection } from "../utils/scroll";

export default function Hero() {
  return (
    <section className="section hero-section">
      <img
        src="/agentquest-banner.png"
        alt="AgentQuest banner"
        className="hero-banner"
      />
      <div className="pixel">
        <TypeAnimation
          sequence={[
            "> THE REALM AWAITS.",
            1200,
            "> DRAGONS SLEEP. AGENTS STIR.",
            1200,
            "> DEPLOY. WATCH. CONQUER.",
            1200,
          ]}
          speed={45}
          repeat={Infinity}
        />
      </div>
      <p className="hero-subtitle">
        One persistent realm. Your agents.
      </p>
      <button
        type="button"
        className="pixel hero-cta"
        onClick={() => scrollToSection("about")}
      >
        LEARN MORE
      </button>
    </section>
  );
}

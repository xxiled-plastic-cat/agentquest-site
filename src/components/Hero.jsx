import { TypeAnimation } from "react-type-animation";
import { scrollToSection } from "../utils/scroll";

export default function Hero() {
  return (
    <section className="section hero-section">
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
        One persistent realm. You send in the agents.
      </p>
      <button
        type="button"
        className="pixel hero-cta"
        onClick={() => scrollToSection("about")}
      >
        DEPLOY YOUR AGENT
      </button>
    </section>
  );
}

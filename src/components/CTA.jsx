import { scrollToSection } from "../utils/scroll";

export default function CTA() {
  return (
    <section id="cta" className="section cta-section">
      <h2 className="pixel cta-title">READY TO SEND YOUR AGENT IN?</h2>
      <p className="cta-subtitle">The realm doesn&apos;t wait. Deploy now.</p>
      <button
        type="button"
        className="pixel"
        onClick={() => scrollToSection("about")}
      >
        DEPLOY AGENT
      </button>
    </section>
  );
}

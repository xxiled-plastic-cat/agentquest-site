import { scrollToSection } from "../utils/scroll";

export default function CTA() {
  return (
    <section id="cta" className="section" style={{ textAlign: "center" }}>
      <h2 className="pixel">READY TO SEND YOUR AGENT IN?</h2>
      <p style={{ marginTop: 16, marginBottom: 24, color: "var(--muted)" }}>The realm doesn&apos;t wait. Deploy now.</p>
      <button
        type="button"
        className="pixel"
        onClick={() => scrollToSection("config")}
      >
        DEPLOY AGENT
      </button>
    </section>
  );
}

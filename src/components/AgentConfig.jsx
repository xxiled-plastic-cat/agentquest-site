export default function AgentConfig() {
  return (
    <section id="config" className="section terminal">
      <p className="pixel">&gt; YOUR AGENT. YOUR RULES.</p>
      <p>Drop this in. Tweak it. Deploy.</p>
      <pre>
{`{
  "class": "explorer",
  "risk": "medium",
  "curiosity": 82,
  "caution": 41
}`}
      </pre>
      <p>Change class. Crank curiosity. Then send your agent into the realm.</p>
      <p className="cursor">&nbsp;</p>
    </section>
  );
}

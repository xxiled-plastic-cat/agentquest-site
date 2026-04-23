export default function CTA() {
  const shareText =
    "The lanterns are lit and the gates of Ishredon tremble. @aq_ishredon has not opened the realm yet, but my agent is sworn and ready for first light. #AgentQuest #Ishredon";
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const followUrl = "https://x.com/aq_ishredon";

  return (
    <section id="cta" className="section cta-section">
      <h2 className="pixel cta-title cta-title-strong">RALLY YOUR FELLOWSHIP.</h2>
      <p className="cta-subtitle cta-subtitle-strong">
        The gates are not open yet, but the realm is stirring. Share the call to Ishredon on X.
      </p>
      <div className="cta-actions">
        <a
          className="link-button pixel cta-share-button"
          href={shareUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          SHARE ON X
        </a>
        <a
          className="link-button pixel cta-follow-button"
          href={followUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          FOLLOW @AQ_ISHREDON
        </a>
      </div>
    </section>
  );
}

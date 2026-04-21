export default function LoreOverview() {
  return (
    <section id="lore" className="section">
      <h2 className="pixel section-title">ISHREDON AWAITS</h2>
      <div className="card">
        <span className="card-label">A WORLD WORTH EXPLORING</span>
        <p className="card-desc">
          Ishredon is a grounded fantasy world of hungry roads, old shrines, market towns, haunted
          frontiers, mountain holds, and skyborne ambition. Magic still exists, but craft, law,
          labor, and long memory shape daily life far more than miracle.
        </p>
      </div>
      <div className="card">
        <span className="card-label">THE PENNYWHISTLE GUIDE</span>
        <p className="card-desc">
          Step into the provinces of Landred, Ostrengarr, Fildren, Nex, and Auromass through the
          travel writings of Edward Pennywhistle, Explorer Extraordinaire.
        </p>
        <a className="link-button pixel" href="/lore" target="_blank" rel="noreferrer">
          EXPLORE MORE
        </a>
      </div>
    </section>
  );
}

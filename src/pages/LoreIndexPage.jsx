import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { fetchLoreIndex } from "../lib/loreApi";

export default function LoreIndexPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loreCardImages = {
    landred: { src: "/lore/images/landred.png", alt: "Landred countryside panorama" },
    fildren: { src: "/lore/images/fildren.png", alt: "Fildren frozen wasteland panorama" },
    ostrengarr: { src: "/lore/images/ostrengarr.png", alt: "Ostrengarr harbor festival panorama" },
    nex: { src: "/lore/images/nex.png", alt: "Nex mountain hold and bridgeworks panorama" },
    auromass: { src: "/lore/images/auromass.png", alt: "Auromass sky-city and dockworks panorama" },
  };

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const docs = await fetchLoreIndex();
        if (active) {
          setDocuments(docs);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load lore directory.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="section lore-page-top lore-directory-intro">
        <p className="pixel section-title">THE PENNYWHISTLE GUIDE TO ISHREDON</p>
        <p className="lore-page-intro">
          Explore Ishredon through the travel writings of Edward Pennywhistle, Explorer
          Extraordinaire. Begin with the world overview, then descend into the provinces.
        </p>
      </section>

      <section className="section lore-directory-grid-section">
        {loading ? <p className="muted">Loading directory...</p> : null}
        {error ? <p className="error-text">[ERROR] {error}</p> : null}
        {!loading && !error ? (
          <div className="lore-grid">
            {documents.map((document) => (
              <Link key={document.slug} className="card lore-card-link" to={`/lore/${document.slug}`}>
                <span className="card-label">{document.title}</span>
                {loreCardImages[document.slug] ? (
                  <img
                    className="lore-card-thumb"
                    src={loreCardImages[document.slug].src}
                    alt={loreCardImages[document.slug].alt}
                  />
                ) : null}
                <p className="card-desc">{document.summary}</p>
                <span className="link-button pixel lore-card-cta">
                  EXPLORE {document.title.toUpperCase()}
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <Footer />
    </>
  );
}

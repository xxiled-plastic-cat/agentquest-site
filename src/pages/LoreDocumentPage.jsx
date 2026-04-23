import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { fetchLoreDocument } from "../lib/loreApi";

export default function LoreDocumentPage() {
  const { slug = "" } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const payload = await fetchLoreDocument(slug);
        if (active) {
          setDocument(payload);
        }
      } catch (err) {
        if (active) {
          setDocument(null);
          setError(err instanceof Error ? err.message : "Failed to load lore document.");
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
  }, [slug]);

  return (
    <>
      <section className="section lore-page-top">
        <p className="pixel section-title">THE PENNYWHISTLE GUIDE TO ISHREDON</p>
        <div className="lore-actions">
          <Link className="link-button" to="/lore">
            BACK TO DIRECTORY
          </Link>
          <a className="link-button lore-secondary-button" href="/">
            RETURN HOME
          </a>
        </div>
      </section>

      <section className="section terminal lore-article-shell">
        {loading ? <p className="muted">Loading document...</p> : null}
        {error ? <p className="error-text">[ERROR] {error}</p> : null}
        {!loading && !error && document ? (
          <article className="lore-prose">
            <ReactMarkdown>{document.markdown}</ReactMarkdown>
          </article>
        ) : null}
      </section>

      <Footer />
    </>
  );
}

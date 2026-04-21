/**
 * Smooth scroll to a section by id (e.g. "about", "features").
 */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

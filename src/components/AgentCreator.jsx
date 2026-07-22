import { useEffect, useMemo, useState } from "react";

const CLASS_OPTIONS = [
  {
    id: "explorer",
    label: "Explorer",
    focus: "Discovery focus",
    flavor: "Cartographer of forgotten roads and hidden gates.",
    statMods: { intelligence: 2, agility: 1, endurance: 0, strength: -1 },
  },
  {
    id: "warden",
    label: "Warden",
    focus: "Survival focus",
    flavor: "Steadfast defender who survives the longest nights.",
    statMods: { intelligence: -1, agility: 0, endurance: 2, strength: 1 },
  },
  {
    id: "trader",
    label: "Trader",
    focus: "Economy focus",
    flavor: "Silver-tongued broker of risk, rumor, and opportunity.",
    statMods: { intelligence: 1, agility: 0, endurance: -1, strength: 0 },
  },
  {
    id: "shadowwalker",
    label: "Shadowwalker",
    focus: "Stealth focus",
    flavor: "Fast and quiet, built for dangerous passage.",
    statMods: { intelligence: 0, agility: 2, endurance: -1, strength: 0 },
  },
];

const GOAL_OPTIONS = [
  { id: "relics", label: "Recover relic fragments" },
  { id: "wealth", label: "Build market wealth" },
  { id: "mapping", label: "Map hidden routes" },
  { id: "renown", label: "Earn guild renown" },
  { id: "custom", label: "Custom goal..." },
];
const CUSTOM_GOAL_MAX_LENGTH = 200;
const DEFAULT_PORTRAIT_URL = "/agent-portraits/male_001.png";
const PORTRAIT_SETS = ["male", "female"];
const MAX_PORTRAITS_PER_VARIANT = 12;
const PORTRAIT_EXTENSIONS = ["png", "jpg", "jpeg"];
const X_HANDLE = "@aq_ishredon";

const BASE_STATS = {
  intelligence: 10,
  strength: 10,
  endurance: 10,
  agility: 10,
};

function clampStat(value) {
  return Math.max(6, Math.min(18, value));
}

function formatModifier(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function curiosityFromTemperament(temperament) {
  return temperament;
}

function cautionFromTemperament(temperament) {
  return 101 - temperament;
}

function temperamentLabel(temperament) {
  if (temperament <= 33) return "Cautious";
  if (temperament >= 67) return "Curious";
  return "Balanced";
}

function getShareTargetUrl() {
  if (typeof window === "undefined") return "https://agentquest.xyz/#creator";
  return `${window.location.origin}${window.location.pathname}#creator`;
}

function buildPortraitCandidates(portraitSet) {
  const out = [];
  for (let i = 1; i <= MAX_PORTRAITS_PER_VARIANT; i += 1) {
    const number = String(i).padStart(3, "0");
    for (const ext of PORTRAIT_EXTENSIONS) {
      out.push(`/agent-portraits/${portraitSet}_${number}.${ext}`);
    }
  }
  return out;
}

export default function AgentCreator() {
  const [agentName, setAgentName] = useState("Kael of Ashford");
  const [selectedClassId, setSelectedClassId] = useState(CLASS_OPTIONS[0].id);
  const [selectedGoalId, setSelectedGoalId] = useState(GOAL_OPTIONS[0].id);
  const [customGoal, setCustomGoal] = useState("");
  const [temperament, setTemperament] = useState(57);
  const [portraitSet, setPortraitSet] = useState(PORTRAIT_SETS[0]);
  const [availablePortraits, setAvailablePortraits] = useState([DEFAULT_PORTRAIT_URL]);
  const [portraitIndex, setPortraitIndex] = useState(0);
  const [portraitLoading, setPortraitLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const selectedClass = useMemo(
    () => CLASS_OPTIONS.find((option) => option.id === selectedClassId) ?? CLASS_OPTIONS[0],
    [selectedClassId]
  );
  const selectedGoal = useMemo(
    () => GOAL_OPTIONS.find((option) => option.id === selectedGoalId) ?? GOAL_OPTIONS[0],
    [selectedGoalId]
  );
  const effectiveGoalLabel = useMemo(() => {
    if (selectedGoalId !== "custom") return selectedGoal.label;
    const trimmed = customGoal.trim();
    return trimmed || "Custom goal not set";
  }, [selectedGoalId, selectedGoal, customGoal]);

  const currentPortrait = availablePortraits[portraitIndex] ?? DEFAULT_PORTRAIT_URL;
  const displayName = agentName.trim() || "Unnamed Adventurer";
  const curiosity = curiosityFromTemperament(temperament);
  const caution = cautionFromTemperament(temperament);
  const riskLabel = temperamentLabel(temperament);

  const stats = useMemo(() => {
    const classMods = selectedClass.statMods;
    return {
      intelligence: clampStat(BASE_STATS.intelligence + classMods.intelligence),
      strength: clampStat(BASE_STATS.strength + classMods.strength),
      endurance: clampStat(BASE_STATS.endurance + classMods.endurance),
      agility: clampStat(BASE_STATS.agility + classMods.agility),
      curiosity,
      caution,
    };
  }, [selectedClass, curiosity, caution]);

  const estimatedCreditsPerRun = useMemo(() => {
    const riskMultiplier = temperament <= 33 ? 0.85 : temperament >= 67 ? 1.2 : 1;
    return Math.max(8, Math.round(12 * riskMultiplier));
  }, [temperament]);

  const agentSeedPreview = useMemo(() => {
    const normalized = agentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return normalized || "new-agent";
  }, [agentName]);

  const shareText = useMemo(
    () =>
      [
        `I forged ${displayName}, a ${selectedClass.label} for Ishredon.`,
        `Goal: ${effectiveGoalLabel}.`,
        `Temperament: ${riskLabel} (curiosity ${curiosity}, caution ${caution}).`,
        `${X_HANDLE} #AgentQuest #Ishredon`,
      ].join("\n"),
    [displayName, selectedClass.label, effectiveGoalLabel, riskLabel, curiosity, caution]
  );

  const shareUrl = useMemo(() => {
    const params = new URLSearchParams({
      text: shareText,
      url: getShareTargetUrl(),
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }, [shareText]);

  useEffect(() => {
    let cancelled = false;
    const candidates = buildPortraitCandidates(portraitSet);
    setPortraitLoading(true);
    Promise.all(
      candidates.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(null);
            img.src = url;
          })
      )
    ).then((results) => {
      if (cancelled) return;
      const discovered = results.filter((value) => typeof value === "string");
      const deduped = Array.from(new Set(discovered.map((url) => url.replace(/\.(png|jpg|jpeg)$/i, ""))))
        .map((base) => discovered.find((url) => url.startsWith(base)) ?? `${base}.png`);
      setAvailablePortraits(deduped.length > 0 ? deduped : [DEFAULT_PORTRAIT_URL]);
      setPortraitIndex(0);
      setPortraitLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [portraitSet]);

  useEffect(() => {
    if (!isShareModalOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsShareModalOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isShareModalOpen]);

  function goToPreviousPortrait() {
    if (availablePortraits.length <= 1) return;
    setPortraitIndex((prev) => (prev === 0 ? availablePortraits.length - 1 : prev - 1));
  }

  function goToNextPortrait() {
    if (availablePortraits.length <= 1) return;
    setPortraitIndex((prev) => (prev + 1) % availablePortraits.length);
  }

  return (
    <section id="creator" className={`section creator-shell creator-shell--${selectedClass.id}`}>
      <h2 className="pixel section-title">FORGE YOUR ADVENTURER</h2>
      <p className="creator-intro">
        Build your hosted agent profile and preview the loadout. Deployment unlocks once account and
        wallet flows are live.
      </p>
      <div className="creator-grid">
        <aside className="creator-panel creator-portrait-panel" aria-label="Character portrait and identity">
          <div className="portrait-frame" role="img" aria-label="Default fantasy portrait">
            <div className="portrait-art">
              <img
                src={currentPortrait}
                alt={`${selectedClass.label} portrait`}
                className="portrait-image"
              />
            </div>
          </div>
          <div className="creator-portrait-nav">
            <div className="creator-portrait-arrow-row">
              <button
                type="button"
                className="creator-portrait-arrow"
                onClick={goToPreviousPortrait}
                disabled={availablePortraits.length <= 1}
                aria-label="Show previous portrait"
              >
                ←
              </button>
              <p className="creator-portrait-meta">
                {portraitLoading
                  ? "Loading portraits..."
                  : `${portraitIndex + 1}/${availablePortraits.length}`}
              </p>
              <button
                type="button"
                className="creator-portrait-arrow"
                onClick={goToNextPortrait}
                disabled={availablePortraits.length <= 1}
                aria-label="Show next portrait"
              >
                →
              </button>
            </div>
            <div className="creator-portrait-set-toggle" role="group" aria-label="Portrait set">
              {PORTRAIT_SETS.map((setOption) => (
                <button
                  key={setOption}
                  type="button"
                  className={`creator-portrait-set-button ${portraitSet === setOption ? "active" : ""}`}
                  onClick={() => setPortraitSet(setOption)}
                >
                  {setOption}
                </button>
              ))}
            </div>
          </div>
          <p className="pixel creator-name">{agentName.trim() || "Unnamed Adventurer"}</p>
          <p className="creator-class">{selectedClass.label}</p>
          <p className="creator-flavor">{selectedClass.flavor}</p>
          <p className="muted">Portrait gallery coming soon.</p>
        </aside>

        <div className="creator-panel creator-controls-panel">
          <div className="creator-control-block">
            <label htmlFor="agent-name-input" className="creator-label">
              AGENT NAME
            </label>
            <input
              id="agent-name-input"
              className="creator-input"
              type="text"
              maxLength={36}
              value={agentName}
              onChange={(event) => setAgentName(event.target.value)}
              placeholder="Name your adventurer"
            />
          </div>

          <div className="creator-control-block">
            <p className="creator-label">CLASS</p>
            <div className="creator-choice-grid creator-choice-grid-2">
              {CLASS_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`creator-choice ${selectedClassId === option.id ? "active" : ""}`}
                  onClick={() => setSelectedClassId(option.id)}
                >
                  <span className="creator-choice-title">{option.label}</span>
                  <span className="creator-choice-meta">{option.focus}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="creator-control-block">
            <p className="creator-label">STARTING GOAL</p>
            <div className="creator-choice-grid creator-choice-grid-2">
              {GOAL_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`creator-choice ${selectedGoalId === option.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedGoalId(option.id);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {selectedGoalId === "custom" ? (
              <div className="creator-custom-goal-wrap">
                <label htmlFor="custom-goal-input" className="creator-label">
                  CUSTOM GOAL ({customGoal.length}/{CUSTOM_GOAL_MAX_LENGTH})
                </label>
                <textarea
                  id="custom-goal-input"
                  className="creator-input creator-input-textarea"
                  maxLength={CUSTOM_GOAL_MAX_LENGTH}
                  value={customGoal}
                  onChange={(event) => setCustomGoal(event.target.value)}
                  placeholder="Write your agent's own objective..."
                />
              </div>
            ) : null}
          </div>

          <div className="creator-control-block creator-temperament-block">
            <div className="creator-temperament-header">
              <span className="creator-label">CAUTION</span>
              <span className="creator-label creator-temperament-center">
                RISK PROFILE · {riskLabel}
              </span>
              <span className="creator-label">CURIOSITY</span>
            </div>
            <input
              id="temperament-range"
              type="range"
              min="1"
              max="100"
              value={temperament}
              className="creator-slider creator-temperament-slider"
              aria-valuetext={`Curiosity ${curiosity}, caution ${caution}`}
              onChange={(event) => setTemperament(Number(event.target.value))}
            />
            <p className="creator-temperament-values">
              Curiosity {curiosity} · Caution {caution}
            </p>
          </div>
        </div>

        <aside className="creator-panel creator-summary-panel" aria-label="Live configuration summary">
          <p className="pixel creator-summary-title">&gt; CREATION SUMMARY</p>
          <div className="creator-summary-badges">
            <span>{selectedClass.label}</span>
            <span>{riskLabel}</span>
          </div>
          <div className="creator-stats">
            <span>INT {stats.intelligence}</span>
            <span>STR {stats.strength}</span>
            <span>END {stats.endurance}</span>
            <span>AGI {stats.agility}</span>
            <span>CUR {stats.curiosity}</span>
            <span>CAU {stats.caution}</span>
          </div>
          <p className="creator-mod-line">
            Class mods: INT {formatModifier(selectedClass.statMods.intelligence)} / STR{" "}
            {formatModifier(selectedClass.statMods.strength)} / END{" "}
            {formatModifier(selectedClass.statMods.endurance)} / AGI{" "}
            {formatModifier(selectedClass.statMods.agility)}
          </p>

          <div className="creator-summary-list">
            <p>
              <strong>Goal:</strong> {effectiveGoalLabel}
            </p>
            <p>
              <strong>Temperament:</strong> {riskLabel} (CUR {curiosity} / CAU {caution})
            </p>
            <p>
              <strong>Estimated credits/run:</strong> {estimatedCreditsPerRun}
            </p>
            <p>
              <strong>Agent handle:</strong> {agentSeedPreview}
            </p>
          </div>

          <button type="button" className="pixel creator-share-button" onClick={() => setIsShareModalOpen(true)}>
            PREVIEW + SHARE ON X
          </button>
          <button type="button" className="pixel creator-deploy" disabled>
            LOCKED: HOSTED DEPLOYMENT COMING SOON
          </button>
          <p className="muted">No auth or saving yet. UI preview only.</p>
        </aside>
      </div>
      {isShareModalOpen ? (
        <div className="creator-share-backdrop" role="presentation" onClick={() => setIsShareModalOpen(false)}>
          <div
            className="creator-share-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="creator-share-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="creator-share-header">
              <p id="creator-share-title" className="pixel creator-share-title">
                X POST PREVIEW
              </p>
              <button
                type="button"
                className="creator-share-close"
                onClick={() => setIsShareModalOpen(false)}
                aria-label="Close share preview"
              >
                X
              </button>
            </div>

            <div className="creator-share-layout">
              <div className="creator-share-portrait">
                <img src={currentPortrait} alt={`${displayName} portrait preview`} />
              </div>
              <div className="creator-share-card">
                <p className="creator-share-account">{X_HANDLE}</p>
                <p className="creator-share-copy">{shareText}</p>
                <div className="creator-share-stats" aria-label="Character stats">
                  <span>INT {stats.intelligence}</span>
                  <span>STR {stats.strength}</span>
                  <span>END {stats.endurance}</span>
                  <span>AGI {stats.agility}</span>
                  <span>CUR {stats.curiosity}</span>
                  <span>CAU {stats.caution}</span>
                </div>
              </div>
            </div>

            <div className="creator-share-summary">
              <p>
                <strong>Name:</strong> {displayName}
              </p>
              <p>
                <strong>Class:</strong> {selectedClass.label}
              </p>
              <p>
                <strong>Goal:</strong> {effectiveGoalLabel}
              </p>
              <p>
                <strong>Temperament:</strong> {riskLabel}
              </p>
            </div>

            <p className="creator-share-note">
              X web intents can prefill text and a URL, but they cannot pre-attach this portrait as uploaded
              media. The image is shown here as the preview; automatic image posts would need the X API.
            </p>

            <div className="creator-share-actions">
              <a className="link-button pixel cta-share-button" href={shareUrl} target="_blank" rel="noreferrer noopener">
                POST ON X
              </a>
              <button type="button" className="pixel creator-share-secondary" onClick={() => setIsShareModalOpen(false)}>
                KEEP EDITING
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

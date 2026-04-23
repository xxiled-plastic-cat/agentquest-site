import { useMemo, useState } from "react";

const WORLD_BASE_URL = import.meta.env.VITE_WORLD_API_BASE_URL ?? "http://localhost:8787";
const SHOW_LOGBOOK_CONTROLS = false;

const EXAMPLE_LOGBOOK_ROWS = [
  {
    turn: 41,
    roomName: "Hall of Cinders",
    room: "hall-of-cinders",
    action: "SCOUT",
    resultSummary: "Mapped two exits and noted drake spoor near the western arch.",
    health: 88,
    hunger: 31,
    food: 2,
    treasure: 14,
  },
  {
    turn: 42,
    roomName: "Ashen Gallery",
    room: "ashen-gallery",
    action: "MOVE_EAST",
    resultSummary: "Passed a warded threshold. Curiosity rises, danger rises with it.",
    health: 84,
    hunger: 36,
    food: 2,
    treasure: 14,
  },
  {
    turn: 43,
    roomName: "Reliquary Steps",
    room: "reliquary-steps",
    action: "SEARCH",
    resultSummary: "Recovered a silver relic shard and traced a sealed stairwell.",
    health: 82,
    hunger: 41,
    food: 1,
    treasure: 22,
  },
];

const EXAMPLE_QUEST_ROWS = [
  {
    sessionId: "sample-session-day-1",
    completedAt: "2026-04-20T21:42:00.000Z",
    chronicleEntry:
      "At dusk the adventurer crossed the Ember Gate, marked three safe corridors, and bartered for a map fragment beneath torchlight.",
    turns: 43,
    explorationPoints: 17,
    exitsDiscovered: 4,
  },
  {
    sessionId: "sample-session-day-2",
    completedAt: "2026-04-21T22:18:00.000Z",
    chronicleEntry:
      "By moonrise they found the Reliquary Steps, escaped a hunting drake, and sealed the night with relic silver and a new route to the lower vaults.",
    turns: 51,
    explorationPoints: 22,
    exitsDiscovered: 5,
  },
];

export default function AgentLogbooks() {
  const [agentInstanceId, setAgentInstanceId] = useState("");
  const [selectedAgentInstanceId, setSelectedAgentInstanceId] = useState("");
  const [rows, setRows] = useState([]);
  const [questRows, setQuestRows] = useState([]);
  const [activeTab, setActiveTab] = useState("logbook");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const journalUrl = useMemo(() => {
    if (!selectedAgentInstanceId) return "";
    return `${WORLD_BASE_URL}/agents/${encodeURIComponent(selectedAgentInstanceId)}/journal`;
  }, [selectedAgentInstanceId]);
  const displayedLogbookRows = SHOW_LOGBOOK_CONTROLS ? rows : EXAMPLE_LOGBOOK_ROWS;
  const displayedQuestRows = SHOW_LOGBOOK_CONTROLS ? questRows : EXAMPLE_QUEST_ROWS;

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = agentInstanceId.trim();
    if (!trimmed) {
      setError("Enter an agent instance ID.");
      setSelectedAgentInstanceId("");
      setRows([]);
      setQuestRows([]);
      return;
    }

    setLoading(true);
    setError("");
    setSelectedAgentInstanceId(trimmed);
    try {
      const res = await fetch(`${WORLD_BASE_URL}/agents/${encodeURIComponent(trimmed)}/journal`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const payload = await res.json();
      const entries = Array.isArray(payload?.journal?.lastSessionLogbook)
        ? payload.journal.lastSessionLogbook
        : [];
      const quests = Array.isArray(payload?.journal?.questbook) ? payload.journal.questbook : [];
      setRows(entries);
      setQuestRows(quests);
    } catch (err) {
      setRows([]);
      setQuestRows([]);
      setError(err instanceof Error ? err.message : "Failed to load logbook.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="logbooks" className="section terminal">
      <p className="pixel">&gt; AGENT LOGBOOK ARCHIVE</p>
      {SHOW_LOGBOOK_CONTROLS ? (
        <p>Retrieve an agent&apos;s latest session logbook and full questlog from persistent world memory.</p>
      ) : (
        <p>
          A preview of the archive interface: sample logbook turns and quest chronicle entries from a
          run through Ishredon.
        </p>
      )}
      {SHOW_LOGBOOK_CONTROLS ? (
        <p className="muted">
          Endpoint: <code>{journalUrl || `${WORLD_BASE_URL}/agents/:agentInstanceId/journal`}</code>
        </p>
      ) : (
        <p className="muted">Live lookup controls are temporarily hidden while we prepare launch.</p>
      )}

      {SHOW_LOGBOOK_CONTROLS ? (
        <form className="logbook-form" onSubmit={handleSubmit}>
          <label htmlFor="agent-id-input" className="logbook-label">
            AGENT_INSTANCE_ID
          </label>
          <input
            id="agent-id-input"
            className="logbook-input"
            type="text"
            placeholder="UUID from CLI output"
            value={agentInstanceId}
            onChange={(e) => setAgentInstanceId(e.target.value)}
          />
          <button type="submit" className="pixel" disabled={loading}>
            {loading ? "LOADING..." : "LOAD JOURNAL"}
          </button>
        </form>
      ) : null}

      {SHOW_LOGBOOK_CONTROLS && selectedAgentInstanceId ? (
        <p className="muted">
          Showing entries for <strong>{selectedAgentInstanceId}</strong>
        </p>
      ) : null}
      {SHOW_LOGBOOK_CONTROLS && error ? <p className="error-text">[ERROR] {error}</p> : null}

      {SHOW_LOGBOOK_CONTROLS ? (
        <div className="journal-tabs" role="tablist" aria-label="Journal views">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "logbook"}
            className={`journal-tab ${activeTab === "logbook" ? "active" : ""}`}
            onClick={() => setActiveTab("logbook")}
          >
            LOGBOOK
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "questlog"}
            className={`journal-tab ${activeTab === "questlog" ? "active" : ""}`}
            onClick={() => setActiveTab("questlog")}
          >
            QUESTLOG
          </button>
        </div>
      ) : (
        <p className="pixel logbook-preview-title">&gt; LOGBOOK SAMPLE</p>
      )}

      {SHOW_LOGBOOK_CONTROLS ? activeTab === "logbook" : true ? (
        <div className="logbook-table-wrap" role="tabpanel">
          <table className="logbook-table">
            <thead>
              <tr>
                <th>TURN</th>
                <th>ROOM</th>
                <th>ACTION</th>
                <th>RESULT</th>
                <th>HP</th>
                <th>HUNGER</th>
                <th>FOOD</th>
                <th>TREASURE</th>
              </tr>
            </thead>
            <tbody>
              {displayedLogbookRows.length === 0 ? (
                <tr>
                  <td className="empty-row" colSpan={8}>
                    {selectedAgentInstanceId
                      ? "No last-session entries for this agent yet."
                      : "Enter an AGENT_INSTANCE_ID and load the logbook."}
                  </td>
                </tr>
              ) : (
                displayedLogbookRows.map((entry, idx) => (
                  <tr key={`${entry.turn}-${entry.room}-${entry.action}-${idx}`}>
                    <td>{entry.turn}</td>
                    <td>
                      {entry.roomName} <span className="muted">({entry.room})</span>
                    </td>
                    <td>{entry.action}</td>
                    <td>{entry.resultSummary}</td>
                    <td>{entry.health}</td>
                    <td>{entry.hunger}</td>
                    <td>{entry.food}</td>
                    <td>{entry.treasure}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="questlog" role="tabpanel">
          {displayedQuestRows.length === 0 ? (
            <p className="empty-row">
              {selectedAgentInstanceId
                ? "No questlog entries for this agent yet."
                : "Enter an AGENT_INSTANCE_ID and load the questlog."}
            </p>
          ) : (
            displayedQuestRows.map((entry, idx) => (
              <article className="quest-day" key={entry.sessionId}>
                <header className="quest-day-header">
                  <p className="quest-day-label">DAY {idx + 1}</p>
                  <p className="muted quest-day-meta">
                    {entry.completedAt ? new Date(entry.completedAt).toLocaleString() : "Unknown date"}
                  </p>
                </header>

                <p className="quest-day-opening">
                  {typeof entry.chronicleEntry === "string" && entry.chronicleEntry.trim()
                    ? entry.chronicleEntry.trim()
                    : entry.endReason === "death"
                      ? "The chronicle closes in tragedy as the adventurer falls before dawn."
                      : "Another chapter closes, and the adventurer survives to continue the journey."}
                </p>

                <div className="quest-stats">
                  <span>Turns: {entry.turns ?? 0}</span>
                  <span>Exploration: {entry.explorationPoints ?? 0}</span>
                  <span>Exits found: {entry.exitsDiscovered ?? 0}</span>
                </div>
              </article>
            ))
          )}
        </div>
      )}
      {!SHOW_LOGBOOK_CONTROLS ? (
        <>
          <p className="pixel logbook-preview-title questlog-preview-title">&gt; QUESTLOG SAMPLE</p>
          <div className="questlog">
            {displayedQuestRows.map((entry, idx) => (
              <article className="quest-day" key={entry.sessionId}>
                <header className="quest-day-header">
                  <p className="quest-day-label">DAY {idx + 1}</p>
                  <p className="muted quest-day-meta">
                    {entry.completedAt ? new Date(entry.completedAt).toLocaleString() : "Unknown date"}
                  </p>
                </header>

                <p className="quest-day-opening">
                  {typeof entry.chronicleEntry === "string" && entry.chronicleEntry.trim()
                    ? entry.chronicleEntry.trim()
                    : entry.endReason === "death"
                      ? "The chronicle closes in tragedy as the adventurer falls before dawn."
                      : "Another chapter closes, and the adventurer survives to continue the journey."}
                </p>

                <div className="quest-stats">
                  <span>Turns: {entry.turns ?? 0}</span>
                  <span>Exploration: {entry.explorationPoints ?? 0}</span>
                  <span>Exits found: {entry.exitsDiscovered ?? 0}</span>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : null}
      <p className="cursor">&nbsp;</p>
    </section>
  );
}

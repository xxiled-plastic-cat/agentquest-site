import { useMemo, useState } from "react";

const WORLD_BASE_URL = import.meta.env.VITE_WORLD_API_BASE_URL ?? "http://localhost:8787";

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
      <p>Retrieve an agent&apos;s latest session logbook and full questlog from persistent world memory.</p>
      <p className="muted">
        Endpoint: <code>{journalUrl || `${WORLD_BASE_URL}/agents/:agentInstanceId/journal`}</code>
      </p>

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

      {selectedAgentInstanceId ? (
        <p className="muted">
          Showing entries for <strong>{selectedAgentInstanceId}</strong>
        </p>
      ) : null}
      {error ? <p className="error-text">[ERROR] {error}</p> : null}

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

      {activeTab === "logbook" ? (
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
              {rows.length === 0 ? (
                <tr>
                  <td className="empty-row" colSpan={8}>
                    {selectedAgentInstanceId
                      ? "No last-session entries for this agent yet."
                      : "Enter an AGENT_INSTANCE_ID and load the logbook."}
                  </td>
                </tr>
              ) : (
                rows.map((entry, idx) => (
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
          {questRows.length === 0 ? (
            <p className="empty-row">
              {selectedAgentInstanceId
                ? "No questlog entries for this agent yet."
                : "Enter an AGENT_INSTANCE_ID and load the questlog."}
            </p>
          ) : (
            questRows.map((entry, idx) => (
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
      <p className="cursor">&nbsp;</p>
    </section>
  );
}

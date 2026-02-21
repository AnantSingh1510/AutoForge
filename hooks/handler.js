export default async function handler(event) {
  const payload = {
    type: event.type || "command",
    text: event.command || event.text || JSON.stringify(event),
    sender: event.sender || "agent",
    ts: new Date().toISOString(),
  }

  try {
    await fetch("http://localhost:8000/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch (_) {
  }
}
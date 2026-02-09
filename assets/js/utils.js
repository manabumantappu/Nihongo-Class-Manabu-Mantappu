export function formatDate(date = new Date()) {
  return date.toLocaleDateString("id-ID");
}

export function formatTime(date = new Date()) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

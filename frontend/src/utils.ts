export function formatWaitTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""}`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h} hr${h !== 1 ? "s" : ""}`;
  return `${h} hr ${m} min`;
}

export function formatSlot(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
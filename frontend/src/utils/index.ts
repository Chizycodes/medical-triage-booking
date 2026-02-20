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
export function formatSlotShort(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function formatSlotDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export const RECOMMENDATION_INFO: Record<string, { icon: string; title: string; description: string }> = {
  Chat: {
    icon: "💬",
    title: "Chat Consultation",
    description:
      "Your symptoms appear mild. A quick chat with our virtual health assistant will give you personalised advice and self-care tips from home.",
  },
  Nurse: {
    icon: "🩺",
    title: "Nurse Appointment",
    description:
      "Based on your answers, a nurse can assess and treat you effectively. They will review your symptoms and recommend next steps.",
  },
  Doctor: {
    icon: "👨‍⚕️",
    title: "Doctor Appointment",
    description:
      "Your symptoms suggest you need a doctor's assessment. We will connect you with a GP who can provide a full clinical evaluation and treatment plan.",
  },
};
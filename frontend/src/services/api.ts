import axios from "axios";
import type { AssessmentResponse, BookingResponse } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

export async function submitAssessment(score: number): Promise<AssessmentResponse> {
  const { data } = await api.post<AssessmentResponse>("/assessment", { score });
  return data;
}

export async function confirmBooking(
  slot: string,
  recommendation: string
): Promise<BookingResponse> {
  const { data } = await api.post<BookingResponse>("/booking", { slot, recommendation });
  return data;
}
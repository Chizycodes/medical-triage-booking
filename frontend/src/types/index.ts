export interface Question {
  id: number;
  text: string;
  options: AnswerOption[];
}

export interface AnswerOption {
  label: string;
  score: number;
}

export type Recommendation = "Doctor" | "Nurse" | "Chat";

export interface AssessmentResponse {
  recommendation: Recommendation;
  availableSlots: string[];
}

export interface BookingResponse {
  confirmationId: string;
  slot: string;
  recommendation: Recommendation;
}
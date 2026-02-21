import { create } from "zustand";
import type { AssessmentResponse, BookingResponse } from "../types";

const TOTAL_QUESTIONS = 5;

interface AppState {
	answers: (number | null)[];
	currentQuestion: number;
	assessmentResult: AssessmentResponse | null;
	booking: BookingResponse | null;
	waitingMinutes: number;
}

interface AppActions {
	answer: (questionIndex: number, score: number) => void;
	goBack: () => void;
	goNext: () => void;
	reset: () => void;
	setResult: (result: AssessmentResponse) => void;
	setBooking: (booking: BookingResponse) => void;
	tickWaiting: () => void;
}

type AppStore = AppState & AppActions;

const initialData: AppState = {
	answers: Array(TOTAL_QUESTIONS).fill(null),
	currentQuestion: 0,
	assessmentResult: null,
	booking: null,
	waitingMinutes: 12,
};

export const useAppStore = create<AppStore>((set) => ({
	...initialData,

	answer: (questionIndex, score) =>
		set((state) => {
			const newAnswers = [...state.answers];
			newAnswers[questionIndex] = score;
			return {
				answers: newAnswers,
				currentQuestion: Math.min(questionIndex + 1, TOTAL_QUESTIONS - 1),
			};
		}),

	goBack: () =>
		set((state) => ({
			currentQuestion: Math.max(0, state.currentQuestion - 1),
		})),

	goNext: () =>
		set((state) => ({
			currentQuestion: Math.min(state.currentQuestion + 1, TOTAL_QUESTIONS - 1),
		})),

	reset: () =>
		set((state) => ({
			...initialData,
			waitingMinutes: state.waitingMinutes,
			booking: state.booking,
		})),

	setResult: (result) => set({ assessmentResult: result }),

	setBooking: (booking) => set({ booking }),

	tickWaiting: () =>
		set((state) => ({
			waitingMinutes: Math.max(1, state.waitingMinutes - 1),
		})),
}));

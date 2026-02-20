import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { QUESTIONS } from "../data/questions";
import { submitAssessment } from "../api";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";

export default function QuestionnairePage() {
	const navigate = useNavigate();
	const { currentQuestion, answers, answer, goBack, goNext, reset, setResult } = useAppStore((s) => s);
	const [submitting, setSubmitting] = useState(false);
	const question = QUESTIONS[currentQuestion];
	const isLast = currentQuestion === QUESTIONS.length - 1;
	const selectedScore = answers[currentQuestion];

	const handleSelect = async (score: number) => {
		answer(currentQuestion, score);
	};

	const handleNext = async () => {
		if (!isLast) {
			goNext();
			return;
		} else {
			const allAnswers = [...answers];

			if (allAnswers.every((a) => a !== null)) {
				const total = (allAnswers as number[]).reduce((sum, s) => sum + s, 0);
				setSubmitting(true);
				try {
					const result = await submitAssessment(total);
					setResult(result);
					navigate("/recommendation");
				} catch {
					toast.error("Failed to submit assessment. Please try again.");
				} finally {
					setSubmitting(false);
				}
			}
		}
	};

	return (
		<>
			<div className="px-6 pb-4 pt-2">
				<div className="max-w-xl mx-auto space-y-1.5">
					<div className="flex justify-between text-xs text-text-body font-medium">
						<span>
							Question {currentQuestion + 1} of {QUESTIONS.length}
						</span>
						<span>{Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)}%</span>
					</div>
					<div className="h-1.5 bg-border rounded-full overflow-hidden">
						<div
							className="h-full bg-brand rounded-full transition-all duration-500 ease-out"
							style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
						/>
					</div>
				</div>
			</div>

			<main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
				<div className="max-w-xl w-full space-y-8">
					<h2 className="text-2xl font-bold text-text-heading leading-snug">{question.text}</h2>

					<div className="space-y-3">
						{question.options.map((opt) => {
							const isSelected = selectedScore === opt.score;
							return (
								<button
									key={opt.score}
									onClick={() => handleSelect(opt.score)}
									disabled={submitting}
									className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer
                    ${
											isSelected
												? "border-brand bg-brand-subtle text-brand"
												: "border-border bg-white text-text-heading hover:border-brand-hover hover:bg-teal-50/50"
										}`}
								>
									<div className="flex items-center gap-3">
										<div
											className={`w-5 h-5 rounded-full border-2 shrink-0 transition-colors
                      ${isSelected ? "border-teal-500 bg-teal-500" : "border-slate-300"}`}
										>
											{isSelected && (
												<svg viewBox="0 0 20 20" className="w-full h-full text-white fill-current p-0.5">
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													/>
												</svg>
											)}
										</div>
										{opt.label}
									</div>
								</button>
							);
						})}
					</div>

					{submitting && (
						<div className="flex items-center justify-center gap-3 text-slate-500 py-2">
							<div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
							<span className="text-sm">Analysing your responses…</span>
						</div>
					)}
				</div>

				<div className="flex gap-1.5 mt-10">
					{QUESTIONS.map((_, i) => (
						<div
							key={i}
							className={`w-2 h-2 rounded-full transition-colors ${
								i === currentQuestion ? "bg-brand" : answers[i] !== null ? "bg-brand-light" : "bg-border"
							}`}
						/>
					))}
				</div>
			</main>

			<div className="bg-white border-t border-border px-6 py-4">
				<div className="max-w-xl mx-auto flex justify-between items-center">
					<Button
						onClick={() => {
							reset();
							navigate("/");
						}}
						variant="ghost"
						size="sm"
					>
						Cancel
					</Button>

					<div className="flex gap-2">
						<Button onClick={goBack} disabled={currentQuestion === 0 || submitting} variant="ghost" size="sm">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
							Back
						</Button>
						<Button onClick={handleNext} disabled={!answers[currentQuestion] || submitting} variant="ghost" size="sm">
							{isLast ? "Submit" : "Next"}
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

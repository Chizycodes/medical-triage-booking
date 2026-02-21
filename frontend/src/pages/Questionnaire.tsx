import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { QUESTIONS } from "../data/questions";
import { submitAssessment } from "../services/api";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import QuestionCard from "../components/questionnaire/QuestionCard";

export default function QuestionnairePage() {
	const navigate = useNavigate();
	const { currentQuestion, answers, answer, goBack, goNext, reset, setResult } = useAppStore((s) => s);
	const [submitting, setSubmitting] = useState(false);
	const question = QUESTIONS[currentQuestion];
	const isLast = currentQuestion === QUESTIONS.length - 1;
	const selectedScore = answers[currentQuestion];

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
				<QuestionCard
					question={question}
					currentQuestion={currentQuestion}
					selectedScore={selectedScore}
					answer={answer}
					submitting={submitting}
				/>

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
						<Button
							onClick={goBack}
							disabled={currentQuestion === 0 || submitting}
							variant="ghost"
							size="sm"
							className="text-text-primary"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
							Back
						</Button>
						<Button
							onClick={handleNext}
							disabled={!answers[currentQuestion] || submitting}
							variant="ghost"
							size="sm"
							className="text-text-primary"
						>
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

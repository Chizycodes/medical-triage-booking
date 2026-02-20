import type { Question } from "../../types";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionCardProps {
	question: Question;
	currentQuestion: number;
	selectedScore: number | null;
	answer: (questionIndex: number, score: number) => void;
	submitting: boolean;
}

const QuestionCard = ({ question, currentQuestion, selectedScore, answer, submitting }: QuestionCardProps) => {
	return (
		<div className="max-w-xl w-full relative overflow-hidden">
			<AnimatePresence mode="wait">
				<motion.div
					key={currentQuestion}
					initial={{ opacity: 0, x: 40 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -40 }}
					transition={{ duration: 0.35, ease: "easeInOut" }}
					className="space-y-8"
				>
					<h2 className="text-2xl font-bold text-text-heading leading-snug">{question.text}</h2>

					<div className="space-y-3">
						{question.options.map((opt) => {
							const isSelected = selectedScore === opt.score;
							return (
								<button
									key={opt.score}
									onClick={() => answer(currentQuestion, opt.score)}
									disabled={submitting}
									className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer
                    ${
											isSelected
												? "border-brand bg-brand-subtle text-brand"
												: "border-border bg-white text-text-heading hover:border-brand-hover hover:bg-brand-subtle"
										}`}
								>
									<div className="flex items-center gap-3">
										<div
											className={`w-5 h-5 rounded-full border-2 shrink-0 transition-colors
                      ${isSelected ? "border-brand bg-brand" : "border-border"}`}
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
						<div className="flex items-center justify-center gap-3 text-text-body py-2">
							<div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
							<span className="text-sm">Analysing your responses…</span>
						</div>
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};
export default QuestionCard;

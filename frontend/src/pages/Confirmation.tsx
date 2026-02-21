import { useNavigate, Navigate } from "react-router-dom";
import { useAppStore } from "../store/useTriageStore";
import { formatSlot, RECOMMENDATION_INFO } from "../utils";
import Button from "../components/ui/Button";

export default function ConfirmationPage() {
	const navigate = useNavigate();
	const booking = useAppStore((s) => s.booking);
	const reset = useAppStore((s) => s.reset);

	if (!booking) return <Navigate to="/" replace />;

	const info = RECOMMENDATION_INFO[booking.recommendation];

	return (
		<>
			<main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
				<div className="max-w-md w-full text-center space-y-8">
					<div className="flex justify-center">
						<div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center">
							<svg className="w-10 h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
							</svg>
						</div>
					</div>

					<div className="space-y-2">
						<h1 className="text-3xl font-bold text-text-primary">You're booked!</h1>
						<p className="text-text-body text-lg">Your appointment has been confirmed.</p>
					</div>

					<div className="bg-white border border-border rounded-2xl p-6 text-left space-y-4 shadow-sm">
						<div className="flex items-center gap-3">
							<span className="text-2xl">{info.icon}</span>
							<div>
								<p className="text-xs font-semibold text-text-muted uppercase tracking-widest">Type</p>
								<p className="font-semibold text-text-primary">{info.title}</p>
							</div>
						</div>

						<div className="border-t border-border pt-4 space-y-3">
							<div>
								<p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-0.5">Date & Time</p>
								<p className="font-semibold text-text-primary">{formatSlot(booking.slot)}</p>
							</div>
							<div>
								<p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-0.5">
									Confirmation ID
								</p>
								<p className="font-mono text-sm text-text-body bg-brand-subtle rounded-lg px-3 py-1.5 inline-block">
									{booking.confirmationId}
								</p>
							</div>
						</div>
					</div>

					<Button
						onClick={() => {
							reset();
							navigate("/");
						}}
						className="w-full"
					>
						Return to Home
					</Button>
				</div>
			</main>
		</>
	);
}

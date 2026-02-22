import { useNavigate } from "react-router-dom";
import Footer from "../components/ui/Footer";
import Button from "../components/ui/Button";
import { useTriageStore } from "../store/useTriageStore";
import { formatSlot, formatWaitTime } from "../utils";

export default function HomePage() {
	const navigate = useNavigate();
	const waitingMinutes = useTriageStore((s) => s.waitingMinutes);
	const booking = useTriageStore((s) => s.booking);
	const reset = useTriageStore((s) => s.reset);

	const handleBook = () => {
		reset();
		navigate("/questionnaire");
	};

	return (
		<>
			<main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
				<div className="max-w-lg w-full text-center flex flex-col items-center space-y-8">
					<div className="inline-flex items-center gap-2 bg-brand-subtle border border-brand rounded-full px-4 py-2">
						<span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
						<span className="text-brand text-sm font-medium">
							See a doctor in <strong>{formatWaitTime(waitingMinutes)}</strong>
						</span>
					</div>

					<div className="space-y-4">
						<h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight tracking-tight">
							Get the right care,
							<br />
							<span className="text-brand">right now.</span>
						</h1>
						<p className="text-text-body text-lg leading-relaxed">
							Answer 5 quick questions about your symptoms and we'll connect you with the right clinician - fast.
						</p>
					</div>

					<Button className="" onClick={handleBook}>
						Book a Meeting
					</Button>

					{booking && (
						<div className="bg-white border border-border rounded-2xl p-5 text-left shadow-sm space-y-1 w-full">
							<p className="text-xs font-semibold text-brand uppercase tracking-widest">Upcoming appointment</p>
							<p className="text-text-primary font-semibold">{formatSlot(booking.slot)}</p>
							<p className="text-text-body text-sm">
								{booking.recommendation} appointment · Ref: <span className="font-mono">{booking.confirmationId}</span>
							</p>
						</div>
					)}
				</div>
			</main>

			<Footer />
		</>
	);
}

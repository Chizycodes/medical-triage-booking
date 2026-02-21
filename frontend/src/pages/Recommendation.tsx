import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { RECOMMENDATION_INFO, formatSlotDate, formatSlotShort } from "../utils";
import { confirmBooking } from "../services/api";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";

export default function RecommendationPage() {
	const navigate = useNavigate();
	const { assessmentResult, setBooking } = useAppStore((s) => s);
	const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	if (!assessmentResult) return <Navigate to="/" replace />;

	const { recommendation, availableSlots } = assessmentResult;
	const info = RECOMMENDATION_INFO[recommendation];

	const slotsByDate = availableSlots.reduce<Record<string, string[]>>((acc, slot) => {
		const date = formatSlotDate(slot);
		if (!acc[date]) acc[date] = [];
		acc[date].push(slot);
		return acc;
	}, {});

	const handleConfirm = async () => {
		if (!selectedSlot) return;
		setSubmitting(true);
		try {
			const result = await confirmBooking(selectedSlot, recommendation);
			setBooking(result);
			navigate("/confirmed");
		} catch {
			toast.error("Failed to confirm booking. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<main className="flex-1 px-6 py-8 max-w-xl mx-auto w-full space-y-6 bg-page-bg">
				<div className="border-2 rounded-2xl p-6 bg-brand-subtle border-brand text-chat-text">
					<div className="flex items-start gap-4">
						<span className="text-4xl">{info.icon}</span>
						<div className="space-y-1">
							<p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Recommended</p>
							<h2 className="text-xl font-bold text-text-primary">{info.title}</h2>
							<p className="text-sm leading-relaxed text-text-body">{info.description}</p>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="text-text-primary font-semibold text-lg">Select an appointment slot</h3>

					{availableSlots.length === 0 ? (
						<div className="bg-white border border-border rounded-xl p-6 text-center text-text-muted">
							No slots available
						</div>
					) : (
						Object.entries(slotsByDate).map(([date, slots]) => (
							<div key={date} className="space-y-2">
								<p className="text-xs font-semibold text-text-muted uppercase tracking-widest">{date}</p>
								<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
									{slots.map((slot) => {
										const isSelected = selectedSlot === slot;
										return (
											<Button
												key={slot}
												onClick={() => setSelectedSlot(slot)}
												className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition-all duration-150 shadow-none hover:text-white!
                          ${
														isSelected
															? "border-brand bg-white text-brand!"
															: "border-border bg-white text-text-secondary! hover:border-brand"
													}`}
											>
												{formatSlotShort(slot)}
											</Button>
										);
									})}
								</div>
							</div>
						))
					)}
				</div>

				<Button onClick={handleConfirm} disabled={!selectedSlot || submitting} loading={submitting} className="w-full">
					Confirm Booking
				</Button>
			</main>
		</>
	);
}

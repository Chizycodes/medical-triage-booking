import React from "react";
import Logo from "../ui/Logo";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="min-h-screen grid lg:grid-cols-2">
			<div className="relative hidden lg:flex flex-col justify-between bg-brand px-14 py-12 overflow-hidden">
				<div className="absolute -top-32 -left-32 w-125 h-125 rounded-full border border-white/10" />
				<div className="absolute -top-16 -left-16 w-95 h-95 rounded-full border border-white/10" />
				<div className="absolute bottom-0 right-0 w-105 h-105 rounded-full border border-white/10 translate-x-1/3 translate-y-1/3" />
				<div className="absolute bottom-24 right-12 w-65 h-65 rounded-full border border-white/10" />

				<div
					className="absolute inset-0 opacity-[0.07]"
					style={{
						backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
						backgroundSize: "28px 28px",
					}}
				/>

				<Link to="/" className="relative flex items-center gap-3">
					<Logo containerClass="bg-white/15 backdrop-blur" />
					<span className="text-white font-semibold text-lg tracking-tight">MediTriage</span>
				</Link>

				<div className="relative space-y-6">
					<h2 className="text-white text-5xl leading-[1.15] tracking-tight">
						The right care,
						<br />
						<em className="not-italic text-brand-light">exactly when</em>
						<br />
						you need it.
					</h2>
					<p className="text-brand-light text-base leading-relaxed max-w-xs">
						Answer a few questions about your symptoms and we'll match you with the right clinician - in minutes.
					</p>
				</div>

				<div className="relative flex items-center gap-6">
					{["GDPR Compliant", "NHS Approved", "256-bit Encrypted"].map((badge) => (
						<div key={badge} className="flex items-center gap-1.5">
							<div className="w-1.5 h-1.5 rounded-full bg-brand-light" />
							<span className="text-brand-subtle text-xs font-medium">{badge}</span>
						</div>
					))}
				</div>
			</div>

			<div className="flex flex-col items-center justify-center px-6 py-12 bg-white">
				<div className="w-full max-w-sm space-y-10">
					<div className="flex lg:hidden items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
							<svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
							</svg>
						</div>
						<span className="text-text-primary font-semibold text-lg tracking-tight">MediTriage</span>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
}

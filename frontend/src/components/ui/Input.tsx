import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	hint?: string;
}

export default function Input({ label, error, hint, className = "", ...props }: InputProps) {
	const id = useId();
	const errorId = `${id}-error`;
	const hintId = `${id}-hint`;

	const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className="text-xs font-semibold text-text-muted uppercase tracking-widest">
				{label}
				{props.required && (
					<span className="text-error-text ml-1" aria-hidden="true">
						*
					</span>
				)}
			</label>

			<input
				id={id}
				aria-describedby={describedBy || undefined}
				aria-invalid={!!error}
				aria-required={props.required}
				className={`
          w-full px-4 py-3 rounded-b-md border border-brand text-text-secondary text-sm
          placeholder:text-text-muted bg-white
          focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-150
          ${error ? "border-error-text" : "border-page-border"}
          ${className}
        `}
				{...props}
			/>

			{hint && !error && (
				<p id={hintId} className="text-text-muted text-xs">
					{hint}
				</p>
			)}

			{error && (
				<p id={errorId} role="alert" className="text-error-text text-xs">
					{error}
				</p>
			)}
		</div>
	);
}

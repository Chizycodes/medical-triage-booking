import React from "react";

type Variant = "primary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	size?: Size;
	loading?: boolean;
	children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
	primary:
		"bg-brand hover:bg-brand-hover text-white shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-200 hover:-translate-y-0.5",
	ghost: "text-text-muted hover:text-text-body",
};

const sizeClasses: Record<Size, string> = {
	sm: "py-2 px-4 text-sm",
	md: "py-3 px-6 text-base",
	lg: "py-4 px-8 text-lg",
};

export default function Button({
	variant = "primary",
	size = "lg",
	loading = false,
	disabled,
	children,
	className = "",
	...props
}: ButtonProps) {
	return (
		<button
			disabled={disabled || loading}
			className={`
        font-semibold rounded-2xl transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none cursor-pointer
        flex items-center justify-center gap-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
			{...props}
		>
			{loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
			{children}
		</button>
	);
}

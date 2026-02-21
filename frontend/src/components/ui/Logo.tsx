import logoSvg from "../../assets/logo.svg";

interface LogoProps {
	size?: "sm" | "md" | "lg";
	containerClass?: string;
}

const sizeMap = {
	sm: { container: "w-7 h-7", icon: "w-4 h-4" },
	md: { container: "w-9 h-9", icon: "w-5 h-5" },
	lg: { container: "w-12 h-12", icon: "w-7 h-7" },
};

export default function Logo({ size = "md", containerClass = "" }: LogoProps) {
	const { container, icon } = sizeMap[size];

	return (
		<div className={`${container} rounded-lg bg-brand flex items-center justify-center shrink-0 ${containerClass}`}>
			<img src={logoSvg} alt="MediTriage logo" className={icon} />
		</div>
	);
}

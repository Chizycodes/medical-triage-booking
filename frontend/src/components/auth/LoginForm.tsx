import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/useAuthStore";
import { MOCK_USERS } from "../../data/users";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface LoginFormValues {
	email: string;
	password: string;
}

export default function LoginForm() {
	const navigate = useNavigate();
	const login = useAuthStore((s) => s.login);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>();

	const onSubmit = async (data: LoginFormValues) => {
		await new Promise((r) => setTimeout(r, 600));

		const match = MOCK_USERS.find((u) => u.email === data.email && u.password === data.password);

		if (match) {
			login(data.email);
			navigate("/");
		} else {
			toast.error("Invalid email or password");
		}
	};

	return (
		<>
			<div className="space-y-1.5">
				<h1 className="text-3xl text-text-primary font-semibold">Welcome back</h1>
				<p className="text-text-secondary text-base font-semibold">Sign in to access your health dashboard.</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
				<Input
					label="Email address"
					type="email"
					placeholder="you@example.com"
					error={errors.email?.message}
					{...register("email", {
						required: "Email is required",
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: "Enter a valid email address",
						},
					})}
				/>

				<Input
					label="Password"
					type="password"
					placeholder="••••••••"
					error={errors.password?.message}
					{...register("password", {
						required: "Password is required",
						minLength: {
							value: 3,
							message: "Password must be at least 3 characters",
						},
					})}
				/>

				<Button type="submit" loading={isSubmitting} size="md" className="mt-2">
					Sign In
				</Button>
			</form>

			{/* Demo hint */}
			<div className="border border-dashed border-page-border rounded-xl px-4 py-3 space-y-1">
				<p className="text-text-muted text-xs font-semibold uppercase tracking-widest">Demo credentials</p>
				<p className="text-text-body text-sm font-mono">demo@meditriage.com / demo</p>
			</div>
		</>
	);
}

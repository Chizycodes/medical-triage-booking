import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "./Button";

const Header = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore((s) => s);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<header className="bg-white border-b border-border px-6 py-4">
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				<Link to="/" className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
						<svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
						</svg>
					</div>
					<span className="text-text-primary font-semibold text-lg tracking-tight">MediTriage</span>
				</Link>

				<div className="flex items-center gap-3">
					<span className="text-text-muted text-sm hidden sm:block">{user}</span>
					{user ? (
						<Button onClick={handleLogout} className="" size="sm">
							Sign Out
						</Button>
					) : (
						<Link to="/login">
							<Button className="" size="sm">
								Log in
							</Button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;

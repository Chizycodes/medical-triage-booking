import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "./Button";
import Logo from "./Logo";

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
					<Logo />
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

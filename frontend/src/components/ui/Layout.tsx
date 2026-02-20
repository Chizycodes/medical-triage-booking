import { Outlet } from "react-router-dom";
import Header from "./Header";

const AppLayout = () => {
	return (
		<div className="min-h-screen bg-page-bg flex flex-col">
			<Header />
			<Outlet />
		</div>
	);
};

export default AppLayout;

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Questionnaire from "./pages/Questionnaire";
import Recommendation from "./pages/Recommendation";
import Confirmation from "./pages/Confirmation";
import AppLayout from "./components/ui/Layout";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route element={<AppLayout />}>
					<Route path="/" element={<HomePage />} />

					<Route element={<ProtectedRoute />}>
						<Route path="/questionnaire" element={<Questionnaire />} />
						<Route path="/recommendation" element={<Recommendation />} />
						<Route path="/confirmed" element={<Confirmation />} />
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Route>
			</Routes>
			<ToastContainer />
		</BrowserRouter>
	);
}

export default App;

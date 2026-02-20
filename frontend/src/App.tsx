import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Questionnaire from "./pages/Questionnaire";
import Recommendation from "./pages/Recommendation";
import Confirmation from "./pages/Confirmation";
import AppLayout from "./components/ui/Layout";
import { ToastContainer } from "react-toastify";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/questionnaire" element={<Questionnaire />} />
					<Route path="/recommendation" element={<Recommendation />} />
					<Route path="/confirmed" element={<Confirmation />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Route>
			</Routes>
			<ToastContainer />
		</BrowserRouter>
	);
}

export default App;

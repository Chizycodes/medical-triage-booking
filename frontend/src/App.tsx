import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Questionnaire from "./pages/Questionnaire";
import Recommendation from "./pages/Recommendation";
import Confirmation from "./pages/Confirmation";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/questionnaire" element={<Questionnaire />} />
				<Route path="/recommendation" element={<Recommendation />} />
				<Route path="/confirmed" element={<Confirmation />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

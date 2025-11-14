import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PersonalInfoPage from './pages/PersonalInfoPage';
import SurveyPage from './pages/SurveyPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <BrowserRouter basename="/seniorvibe-ils-survey">
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/personal-info" element={<PersonalInfoPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

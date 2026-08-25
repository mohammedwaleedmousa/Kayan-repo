import { Link, Route, Routes } from 'react-router-dom';
import LegacyPage from './LegacyPage.jsx';
import HomePage from './home/HomePage.jsx';
import { CharterPage, JourneyPage, LegalPage, PeoplePage, PlanetPage, RecordPage, SealPage } from './pages/core/CorePages.jsx';
import { routes } from './routes.js';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/charter" element={<CharterPage />} />
      <Route path="/journey" element={<JourneyPage />} />
      <Route path="/people" element={<PeoplePage />} />
      <Route path="/planet" element={<PlanetPage />} />
      <Route path="/record" element={<RecordPage />} />
      <Route path="/seal" element={<SealPage />} />
      <Route path="/legal" element={<LegalPage />} />
      {routes.filter(([path]) => !['/', '/charter', '/journey', '/people', '/planet', '/record', '/seal', '/legal'].includes(path)).map(([path, file]) => (
        <Route key={path} path={path} element={<LegacyPage file={file} />} />
      ))}
      <Route
        path="*"
        element={
          <main className="route-not-found" dir="rtl">
            <h1>الصفحة غير موجودة</h1>
            <Link to="/">العودة إلى كيان</Link>
          </main>
        }
      />
    </Routes>
  );
}

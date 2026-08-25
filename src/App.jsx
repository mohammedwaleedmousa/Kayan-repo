import { Link, Route, Routes } from 'react-router-dom';
import LegacyPage from './LegacyPage.jsx';
import HomePage from './home/HomePage.jsx';
import { routes } from './routes.js';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {routes.filter(([path]) => path !== '/').map(([path, file]) => (
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

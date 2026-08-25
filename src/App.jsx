import { Link, Route, Routes } from 'react-router-dom';
import LegacyPage from './LegacyPage.jsx';
import HomePage from './home/HomePage.jsx';
import { CharterPage, JourneyPage, LegalPage, PeoplePage, PlanetPage, RecordPage, SealPage } from './pages/core/CorePages.jsx';
import { ClientsPage, DeliveryArPage, DeliveryEnPage, ForgeArPage, ForgeEnPage, HubArPage, HubEnPage, K4yPage, ProductsPage, TalentPage } from './pages/services/ServicePages.jsx';
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
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/talent" element={<TalentPage />} />
      <Route path="/lines/delivery" element={<DeliveryArPage />} />
      <Route path="/en/lines/delivery" element={<DeliveryEnPage />} />
      <Route path="/lines/products" element={<ProductsPage />} />
      <Route path="/lines/hub" element={<HubArPage />} />
      <Route path="/en/lines/hub" element={<HubEnPage />} />
      <Route path="/lines/forge" element={<ForgeArPage />} />
      <Route path="/en/lines/forge" element={<ForgeEnPage />} />
      <Route path="/k4y" element={<K4yPage />} />
      {routes.filter(([path]) => !['/', '/charter', '/journey', '/people', '/planet', '/record', '/seal', '/legal', '/clients', '/talent', '/lines/delivery', '/en/lines/delivery', '/lines/products', '/lines/hub', '/en/lines/hub', '/lines/forge', '/en/lines/forge', '/k4y'].includes(path)).map(([path, file]) => (
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

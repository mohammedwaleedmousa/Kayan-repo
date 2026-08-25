import { useLayoutEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './home/HomePage.jsx';
import { CharterPage, JourneyPage, LegalPage, PeoplePage, PlanetPage, RecordPage, SealPage } from './pages/core/CorePages.jsx';
import { ClientsPage, DeliveryArPage, DeliveryEnPage, ForgeArPage, ForgeEnPage, HubArPage, HubEnPage, K4yPage, ProductsPage, TalentPage } from './pages/services/ServicePages.jsx';
import { AccessPage, AdminPage, ApplyPage, ClientProfilePage, PodPage, PortalPage, SpaceClientPage, SpaceTalentPage, TalentProfilePage } from './pages/workspace/WorkspacePages.jsx';
import { AtlasPage, HubLocationPage, ToolkitPage, VoyagePage } from './pages/experiences/ExperiencePages.jsx';

export default function App() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.documentElement.removeAttribute('data-mo');
  }, [location.key, location.pathname]);

  return (
    <Routes location={location} key={`${location.key}:${location.pathname}`}>
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
      <Route path="/access" element={<AccessPage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/portal" element={<PortalPage />} />
      <Route path="/clients/account" element={<ClientProfilePage />} />
      <Route path="/talent/profile" element={<TalentProfilePage />} />
      <Route path="/space/client" element={<SpaceClientPage />} />
      <Route path="/space/talent" element={<SpaceTalentPage />} />
      <Route path="/pod/:code?" element={<PodPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/atlas" element={<AtlasPage />} />
      <Route path="/voyage" element={<VoyagePage />} />
      <Route path="/hub-location" element={<HubLocationPage />} />
      <Route path="/tools/scope" element={<ToolkitPage />} />
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

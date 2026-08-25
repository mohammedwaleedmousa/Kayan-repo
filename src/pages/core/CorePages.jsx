import NativeDcPage from '../../native/NativeDcPage.jsx';
import StaticLogic from '../../native/StaticLogic.js';
import CharterLogic from './CharterLogic.js';
import JourneyLogic from './JourneyLogic.js';
import PeopleLogic from './PeopleLogic.js';
import PlanetLogic from './PlanetLogic.js';
import RecordLogic from './RecordLogic.js';
import SealLogic from './SealLogic.js';
import charterTemplate from './charter.template.txt?raw';
import journeyTemplate from './journey.template.txt?raw';
import peopleTemplate from './people.template.txt?raw';
import planetTemplate from './planet.template.txt?raw';
import recordTemplate from './record.template.txt?raw';
import sealTemplate from './seal.template.txt?raw';
import legalTemplate from './legal.template.txt?raw';
import charterStyles from './charter.css?raw';
import journeyStyles from './journey.css?raw';
import peopleStyles from './people.css?raw';
import planetStyles from './planet.css?raw';
import recordStyles from './record.css?raw';
import sealStyles from './seal.css?raw';
import legalStyles from './legal.css?raw';

const COMPASS_MARK = ['/legacy/kayan-compass.js', '/legacy/kayan-mark.js'];
const COMPASS = ['/legacy/kayan-compass.js'];
const MARK = ['/legacy/kayan-mark.js'];

const page = (Logic, template, styles, title, scripts = [], props) => function CorePage() {
  return <NativeDcPage Logic={Logic} template={template} styles={styles} title={title} scripts={scripts} props={props} />;
};

export const CharterPage = page(CharterLogic, charterTemplate, charterStyles, 'الميثاق — كيان', COMPASS_MARK);
export const JourneyPage = page(JourneyLogic, journeyTemplate, journeyStyles, 'مسار المنفذ · The worker path', COMPASS);
export const PeoplePage = page(PeopleLogic, peopleTemplate, peopleStyles, 'كيان — فريق كيان والتدريب الداخلي');
export const PlanetPage = page(PlanetLogic, planetTemplate, planetStyles, 'كيان — البيئة والالتزامات');
export const RecordPage = page(RecordLogic, recordTemplate, recordStyles, 'سجل عمل — كيان', COMPASS, { tier: 'T4', revoked: false, startOn: 'record', sound: true });
export const SealPage = page(SealLogic, sealTemplate, sealStyles, 'الختم المحسوب · The Computed Seal');
export const LegalPage = page(StaticLogic, legalTemplate, legalStyles, 'الشروط والخصوصية وحماية البيانات · كيان', MARK);

import NativeDcPage from '../../native/NativeDcPage.jsx';
import NativePlainPage from '../../native/NativePlainPage.jsx';
import ToolkitLogic from './ToolkitLogic.js';
import mountDimension from './mountDimension.js';
import { installVisualizationGlobals } from '../../native/visualizationGlobals.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import atlasTemplate from './atlas.template.html?raw';
import dimensionTemplate from './dimension.template.html?raw';
import hubTemplate from './hub-location.template.html?raw';
import toolkitTemplate from './toolkit.template.html?raw';
import atlasStyles from './atlas.css?raw';
import dimensionStyles from './dimension.css?raw';
import hubStyles from './hub-location.css?raw';
import toolkitStyles from './toolkit.css?raw';
import atlasScript from './atlas.script.js.txt?raw';
import hubScript from './hub-location.script.js.txt?raw';

const mountAtlas = () => { installVisualizationGlobals(); return new Function(atlasScript)(); };
const mountHub = () => { window.L = L; return new Function(hubScript)(); };

export function AtlasPage() {
  return <NativePlainPage template={atlasTemplate} styles={atlasStyles} title="أطلس كيان — قرص عدن" mount={mountAtlas} language />;
}
export function VoyagePage() {
  return <NativePlainPage template={dimensionTemplate} styles={dimensionStyles} title="كيان — الجولة المجسمة" mount={mountDimension} />;
}
export function HubLocationPage() {
  return <NativePlainPage template={hubTemplate} styles={hubStyles} title="The Hub · Aden — where work stays up" mount={mountHub} />;
}
export function ToolkitPage() {
  return <NativeDcPage Logic={ToolkitLogic} template={toolkitTemplate} styles={toolkitStyles} title="Kayan · Scoping Form · KAY-A07" />;
}

import * as d3Module from 'd3';
import * as topojsonModule from 'topojson-client';

const d3 = { ...d3Module };
const topojson = { ...topojsonModule };

export function installVisualizationGlobals() {
  window.d3 = d3;
  window.topojson = topojson;
}

export { d3, topojson };

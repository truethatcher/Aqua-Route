import type { ComponentFamily, ComponentTemplate } from '../types';

function pt(x: number, y: number, z: number) { return { x, y, z }; }

const pumps: ComponentTemplate[] = [
  { id: 'pump-es-3x4', family: 'pumps', name: 'End Suction 3\u00d74-11', description: '3" discharge \u00d7 4" suction, 11" impeller', width: 30, depth: 14, height: 20, shape: 'pump-centrifugal', color: '#4a7fa8', topColor: '#5e9dc8', sideColor: '#3a6888',
    connections: [{ id: 'suction', label: 'Suction (4")', position: pt(0,7,8), normal: pt(-1,0,0), nominalSize: 4, endType: 'flanged' }, { id: 'discharge', label: 'Discharge (3")', position: pt(12,7,20), normal: pt(0,0,1), nominalSize: 3, endType: 'flanged' }] },
  { id: 'pump-es-4x6', family: 'pumps', name: 'End Suction 4\u00d76-13', description: '4" discharge \u00d7 6" suction, 13" impeller', width: 40, depth: 18, height: 26, shape: 'pump-centrifugal', color: '#4a7fa8', topColor: '#5e9dc8', sideColor: '#3a6888',
    connections: [{ id: 'suction', label: 'Suction (6")', position: pt(0,9,10), normal: pt(-1,0,0), nominalSize: 6, endType: 'flanged' }, { id: 'discharge', label: 'Discharge (4")', position: pt(16,9,26), normal: pt(0,0,1), nominalSize: 4, endType: 'flanged' }] },
  { id: 'pump-es-6x8', family: 'pumps', name: 'End Suction 6\u00d78-17', description: '6" discharge \u00d7 8" suction, 17" impeller', width: 52, depth: 24, height: 34, shape: 'pump-centrifugal', color: '#4a7fa8', topColor: '#5e9dc8', sideColor: '#3a6888',
    connections: [{ id: 'suction', label: 'Suction (8")', position: pt(0,12,14), normal: pt(-1,0,0), nominalSize: 8, endType: 'flanged' }, { id: 'discharge', label: 'Discharge (6")', position: pt(20,12,34), normal: pt(0,0,1), nominalSize: 6, endType: 'flanged' }] },
  { id: 'pump-split-6x8', family: 'pumps', name: 'Split Case 6\u00d78', description: 'Horizontal split case, 6" discharge \u00d7 8" suction', width: 60, depth: 30, height: 38, shape: 'pump-centrifugal', color: '#5080a0', topColor: '#6090b8', sideColor: '#407090',
    connections: [{ id: 'suction', label: 'Suction (8")', position: pt(0,15,14), normal: pt(-1,0,0), nominalSize: 8, endType: 'flanged' }, { id: 'discharge', label: 'Discharge (6")', position: pt(60,15,14), normal: pt(1,0,0), nominalSize: 6, endType: 'flanged' }] },
  { id: 'pump-vt-10', family: 'pumps', name: 'Vertical Turbine 10"', description: 'Vertical turbine pump, 10" column', width: 24, depth: 24, height: 72, shape: 'pump-centrifugal', color: '#507090', topColor: '#6088a8', sideColor: '#406080',
    connections: [{ id: 'discharge', label: 'Discharge (10")', position: pt(12,12,72), normal: pt(0,0,1), nominalSize: 10, endType: 'flanged' }] },
];

function makeGateValve(nomSize: number, faceToFace: number, bodyW: number, bodyH: number): ComponentTemplate {
  const pipeZ = 4 + nomSize / 2;
  return { id: `gate-${nomSize}`, family: 'valves-gate', name: `Gate Valve ${nomSize}"`, description: `AWWA C500 resilient seat gate valve, ${nomSize}" NPS`, width: faceToFace, depth: bodyW, height: pipeZ + bodyH, shape: 'valve-gate', color: '#6b8c6b', topColor: '#80a880', sideColor: '#557055',
    connections: [{ id: 'inlet', label: `Inlet (${nomSize}")`, position: pt(0,bodyW/2,pipeZ), normal: pt(-1,0,0), nominalSize: nomSize, endType: 'flanged' }, { id: 'outlet', label: `Outlet (${nomSize}")`, position: pt(faceToFace,bodyW/2,pipeZ), normal: pt(1,0,0), nominalSize: nomSize, endType: 'flanged' }] };
}
const gateValves = [makeGateValve(2,4,5,12),makeGateValve(3,5.5,6,14),makeGateValve(4,7,7,16),makeGateValve(6,9.5,9,20),makeGateValve(8,11.5,11,24),makeGateValve(10,14,13,28),makeGateValve(12,17,15,32)];

function makeBallValve(nomSize: number, faceToFace: number, bodyW: number): ComponentTemplate {
  const pipeZ = 3 + nomSize / 2;
  return { id: `ball-${nomSize}`, family: 'valves-ball', name: `Ball Valve ${nomSize}"`, description: `Full-port flanged ball valve, ${nomSize}" NPS`, width: faceToFace, depth: bodyW, height: pipeZ + bodyW * 1.2, shape: 'valve-ball', color: '#8c6b8c', topColor: '#a880a8', sideColor: '#705570',
    connections: [{ id: 'inlet', label: `Inlet (${nomSize}")`, position: pt(0,bodyW/2,pipeZ), normal: pt(-1,0,0), nominalSize: nomSize, endType: 'flanged' }, { id: 'outlet', label: `Outlet (${nomSize}")`, position: pt(faceToFace,bodyW/2,pipeZ), normal: pt(1,0,0), nominalSize: nomSize, endType: 'flanged' }] };
}
const ballValves = [makeBallValve(2,5.5,4),makeBallValve(3,7,6),makeBallValve(4,9,7),makeBallValve(6,13,10),makeBallValve(8,16,13)];

function makeButterflyValve(nomSize: number, bodyThick: number): ComponentTemplate {
  const pipeZ = 3 + nomSize / 2; const bodyW = nomSize + 4;
  return { id: `butterfly-${nomSize}`, family: 'valves-butterfly', name: `Butterfly Valve ${nomSize}"`, description: `Wafer/lug style butterfly valve, ${nomSize}" NPS`, width: bodyThick, depth: bodyW, height: pipeZ + bodyW * 1.4, shape: 'valve-butterfly', color: '#8c7a4a', topColor: '#b09860', sideColor: '#6e5e38',
    connections: [{ id: 'inlet', label: `Inlet (${nomSize}")`, position: pt(0,bodyW/2,pipeZ), normal: pt(-1,0,0), nominalSize: nomSize, endType: 'flanged' }, { id: 'outlet', label: `Outlet (${nomSize}")`, position: pt(bodyThick,bodyW/2,pipeZ), normal: pt(1,0,0), nominalSize: nomSize, endType: 'flanged' }] };
}
const butterflyValves = [makeButterflyValve(4,3),makeButterflyValve(6,3.5),makeButterflyValve(8,4),makeButterflyValve(10,4.5),makeButterflyValve(12,5),makeButterflyValve(16,6),makeButterflyValve(20,7),makeButterflyValve(24,8)];

function makeCheckValve(nomSize: number, faceToFace: number, bodyW: number): ComponentTemplate {
  const pipeZ = 3 + nomSize / 2;
  return { id: `check-${nomSize}`, family: 'valves-check', name: `Check Valve ${nomSize}"`, description: `Swing check valve, flanged ends, ${nomSize}" NPS`, width: faceToFace, depth: bodyW, height: pipeZ + bodyW, shape: 'valve-check', color: '#8c6a4a', topColor: '#a88060', sideColor: '#6e5038',
    connections: [{ id: 'inlet', label: `Inlet (${nomSize}")`, position: pt(0,bodyW/2,pipeZ), normal: pt(-1,0,0), nominalSize: nomSize, endType: 'flanged' }, { id: 'outlet', label: `Outlet (${nomSize}")`, position: pt(faceToFace,bodyW/2,pipeZ), normal: pt(1,0,0), nominalSize: nomSize, endType: 'flanged' }] };
}
const checkValves = [makeCheckValve(3,7,6),makeCheckValve(4,9,8),makeCheckValve(6,12,10),makeCheckValve(8,15,13),makeCheckValve(10,19,16),makeCheckValve(12,22,19)];

function makeGlobeValve(nomSize: number, faceToFace: number): ComponentTemplate {
  const bodyW = nomSize + 4; const pipeZ = 3 + nomSize / 2;
  return { id: `globe-${nomSize}`, family: 'valves-globe', name: `Globe Valve ${nomSize}"`, description: `Globe valve, flanged ends, ${nomSize}" NPS`, width: faceToFace, depth: bodyW, height: pipeZ + bodyW * 1.6, shape: 'valve-gate', color: '#6b6b8c', topColor: '#8080a8', sideColor: '#555570',
    connections: [{ id: 'inlet', label: `Inlet (${nomSize}")`, position: pt(0,bodyW/2,pipeZ), normal: pt(-1,0,0), nominalSize: nomSize, endType: 'flanged' }, { id: 'outlet', label: `Outlet (${nomSize}")`, position: pt(faceToFace,bodyW/2,pipeZ), normal: pt(1,0,0), nominalSize: nomSize, endType: 'flanged' }] };
}
const globeValves = [makeGlobeValve(2,8),makeGlobeValve(3,10),makeGlobeValve(4,12),makeGlobeValve(6,16)];

const prvValves: ComponentTemplate[] = [
  { id: 'prv-4x6', family: 'valves-prv', name: 'Pressure Relief Valve 4\u00d76"', description: 'Spring-loaded PRV, 4" inlet \u00d7 6" outlet', width: 12, depth: 10, height: 24, shape: 'valve-prv', color: '#a84a4a', topColor: '#c86060', sideColor: '#883838',
    connections: [{ id: 'inlet', label: 'Inlet (4")', position: pt(0,5,5), normal: pt(-1,0,0), nominalSize: 4, endType: 'flanged' }, { id: 'outlet', label: 'Outlet (6")', position: pt(6,5,24), normal: pt(0,0,1), nominalSize: 6, endType: 'flanged' }] },
  { id: 'prv-6x8', family: 'valves-prv', name: 'Pressure Relief Valve 6\u00d78"', description: 'Spring-loaded PRV, 6" inlet \u00d7 8" outlet', width: 14, depth: 12, height: 28, shape: 'valve-prv', color: '#a84a4a', topColor: '#c86060', sideColor: '#883838',
    connections: [{ id: 'inlet', label: 'Inlet (6")', position: pt(0,6,6), normal: pt(-1,0,0), nominalSize: 6, endType: 'flanged' }, { id: 'outlet', label: 'Outlet (8")', position: pt(7,6,28), normal: pt(0,0,1), nominalSize: 8, endType: 'flanged' }] },
];

function makeMagMeter(nomSize: number, faceToFace: number): ComponentTemplate {
  const bodyW = nomSize + 6; const pipeZ = 3 + nomSize / 2;
  return { id: `mag-${nomSize}`, family: 'meters', name: `Magnetic Flow Meter ${nomSize}"`, description: `Electromagnetic flow meter, wafer style, ${nomSize}" NPS`, width: faceToFace, depth: bodyW, height: pipeZ + bodyW + 4, shape: 'meter', color: '#4a8c8c', topColor: '#60a8a8', sideColor: '#387070',
    connections: [{ id: 'inlet', label: `Inlet (${nomSize}")`, position: pt(0,bodyW/2,pipeZ), normal: pt(-1,0,0), nominalSize: nomSize, endType: 'flanged' }, { id: 'outlet', label: `Outlet (${nomSize}")`, position: pt(faceToFace,bodyW/2,pipeZ), normal: pt(1,0,0), nominalSize: nomSize, endType: 'flanged' }] };
}

const meters: ComponentTemplate[] = [
  makeMagMeter(3,12), makeMagMeter(4,14), makeMagMeter(6,18), makeMagMeter(8,22), makeMagMeter(10,26), makeMagMeter(12,30),
  { id: 'turbine-4', family: 'meters', name: 'Turbine Flow Meter 4"', description: 'Axial turbine flow meter, flanged, 4" NPS', width: 14, depth: 10, height: 14, shape: 'meter', color: '#4a7a8c', topColor: '#5e9098', sideColor: '#38606e',
    connections: [{ id: 'inlet', label: 'Inlet (4")', position: pt(0,5,7), normal: pt(-1,0,0), nominalSize: 4, endType: 'flanged' }, { id: 'outlet', label: 'Outlet (4")', position: pt(14,5,7), normal: pt(1,0,0), nominalSize: 4, endType: 'flanged' }] },
  { id: 'ultrasonic-6', family: 'meters', name: 'Ultrasonic Flow Meter 6"', description: 'Clamp-on ultrasonic flow meter, 6" NPS', width: 20, depth: 14, height: 18, shape: 'meter', color: '#508c7a', topColor: '#68a892', sideColor: '#406c60',
    connections: [{ id: 'inlet', label: 'Inlet (6")', position: pt(0,7,10), normal: pt(-1,0,0), nominalSize: 6, endType: 'flanged' }, { id: 'outlet', label: 'Outlet (6")', position: pt(20,7,10), normal: pt(1,0,0), nominalSize: 6, endType: 'flanged' }] },
];

function makeYStrainer(nomSize: number, faceToFace: number): ComponentTemplate {
  const bodyW = nomSize + 5; const pipeZ = 3 + nomSize / 2;
  return { id: `y-strainer-${nomSize}`, family: 'strainers', name: `Y-Strainer ${nomSize}"`, description: `Y-type strainer, flanged ends, ${nomSize}" NPS`, width: faceToFace, depth: bodyW, height: pipeZ + bodyW * 1.5, shape: 'strainer', color: '#7a6a4a', topColor: '#988060', sideColor: '#5e5038',
    connections: [{ id: 'inlet', label: `Inlet (${nomSize}")`, position: pt(0,bodyW/2,pipeZ), normal: pt(-1,0,0), nominalSize: nomSize, endType: 'flanged' }, { id: 'outlet', label: `Outlet (${nomSize}")`, position: pt(faceToFace,bodyW/2,pipeZ), normal: pt(1,0,0), nominalSize: nomSize, endType: 'flanged' }, { id: 'blowdown', label: `Blowdown (${Math.max(1.5,nomSize/4)}")`, position: pt(faceToFace/2,bodyW/2,0), normal: pt(0,0,-1), nominalSize: Math.max(1.5,nomSize/4), endType: 'flanged' }] };
}
const strainers = [makeYStrainer(3,9),makeYStrainer(4,12),makeYStrainer(6,15),makeYStrainer(8,19),makeYStrainer(10,23),makeYStrainer(12,27)];

const accessories: ComponentTemplate[] = [
  { id: 'exp-joint-6', family: 'accessories', name: 'Expansion Joint 6"', description: 'Rubber expansion joint, flanged, 6" NPS', width: 12, depth: 14, height: 14, shape: 'expansion-joint', color: '#4a4a4a', topColor: '#606060', sideColor: '#383838',
    connections: [{ id: 'inlet', label: 'Inlet (6")', position: pt(0,7,7), normal: pt(-1,0,0), nominalSize: 6, endType: 'flanged' }, { id: 'outlet', label: 'Outlet (6")', position: pt(12,7,7), normal: pt(1,0,0), nominalSize: 6, endType: 'flanged' }] },
  { id: 'air-release-2', family: 'accessories', name: 'Air Release Valve 2"', description: 'Combination air/vacuum release valve, 2" NPT outlet', width: 8, depth: 8, height: 18, shape: 'air-valve', color: '#6a7a6a', topColor: '#809880', sideColor: '#506050',
    connections: [{ id: 'inlet', label: 'Inlet (2")', position: pt(4,4,0), normal: pt(0,0,-1), nominalSize: 2, endType: 'flanged' }] },
  { id: 'pressure-gauge', family: 'accessories', name: 'Pressure Gauge (\u00bc" NPT)', description: 'Bourdon tube pressure gauge, \u00bc" NPT bottom connection', width: 4, depth: 4, height: 8, shape: 'box', color: '#7a7a5a', topColor: '#9a9a70', sideColor: '#5a5a40',
    connections: [{ id: 'inlet', label: 'Process (\u00bc")', position: pt(2,2,0), normal: pt(0,0,-1), nominalSize: 0.25, endType: 'threaded' }] },
];

export const DEFAULT_FAMILIES: ComponentFamily[] = [
  { id: 'pumps', name: 'Pumps', icon: '\u2699', templates: pumps },
  { id: 'valves-gate', name: 'Gate Valves', icon: '\u2b1c', templates: gateValves },
  { id: 'valves-ball', name: 'Ball Valves', icon: '\u2b24', templates: ballValves },
  { id: 'valves-butterfly', name: 'Butterfly Valves', icon: '\U0001f98b', templates: butterflyValves },
  { id: 'valves-check', name: 'Check Valves', icon: '\u2192', templates: checkValves },
  { id: 'valves-globe', name: 'Globe Valves', icon: '\u25ce', templates: globeValves },
  { id: 'valves-prv', name: 'Relief Valves', icon: '\u26a0', templates: prvValves },
  { id: 'meters', name: 'Flow Meters', icon: '\U0001f4ca', templates: meters },
  { id: 'strainers', name: 'Strainers', icon: '\u229e', templates: strainers },
  { id: 'accessories', name: 'Accessories', icon: '\U0001f527', templates: accessories },
];

export function getTemplate(families: ComponentFamily[], id: string): ComponentTemplate | undefined {
  for (const f of families) { const t = f.templates.find(t => t.id === id); if (t) return t; }
  return undefined;
}

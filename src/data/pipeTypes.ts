import type { PipeType } from '../types';

export const PIPE_TYPES: PipeType[] = [
  { id: 'di-flanged', name: 'Ductile Iron — Flanged', material: 'Ductile Iron', endType: 'flanged', color: '#7a8c9e' },
  { id: 'di-grooved', name: 'Ductile Iron — Roll Grooved', material: 'Ductile Iron', endType: 'roll-grooved', color: '#6e8098' },
  { id: 'ms-flanged', name: 'Mild Steel — Flanged', material: 'Carbon Steel (A53)', endType: 'flanged', color: '#8c8c6e' },
  { id: 'ms-butt-weld', name: 'Mild Steel — Butt Weld', material: 'Carbon Steel (A53)', endType: 'butt-weld', color: '#9e8a6e', strokeDash: '6 3' },
  { id: 'ms-butt-weld-flanged', name: 'Mild Steel — Butt Weld + Flanged Ends', material: 'Carbon Steel (A53)', endType: 'flanged', color: '#b09070' },
  { id: 'ss304-butt-weld', name: '304 SS — Butt Weld', material: 'Stainless Steel 304', endType: 'butt-weld', color: '#a8c0d0', strokeDash: '6 3' },
  { id: 'ss304-butt-weld-flanged', name: '304 SS — Butt Weld + Flanged Ends', material: 'Stainless Steel 304', endType: 'flanged', color: '#90b8cc' },
  { id: 'ss316-butt-weld', name: '316 SS — Butt Weld', material: 'Stainless Steel 316L', endType: 'butt-weld', color: '#b8d0e0', strokeDash: '6 3' },
  { id: 'ss316-butt-weld-flanged', name: '316 SS — Butt Weld + Flanged Ends', material: 'Stainless Steel 316L', endType: 'flanged', color: '#a0c8dc' },
  { id: 'hdpe-butt-weld', name: 'HDPE — Butt Weld', material: 'HDPE (IPS DR11)', endType: 'butt-weld', color: '#6aaa6a', strokeDash: '8 4' },
  { id: 'pvc-solvent-weld', name: 'PVC — Solvent Weld (Sch 80)', material: 'PVC Schedule 80', endType: 'socket-weld', color: '#b0b0d0' },
  { id: 'copper-soldered', name: 'Copper — Soldered (Type L)', material: 'Copper Type L', endType: 'socket-weld', color: '#c88040' },
];

export const PIPE_SIZES = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 36];

export const PIPE_OD: Record<number, number> = {
  1: 1.315, 1.25: 1.660, 1.5: 1.900,
  2: 2.375, 2.5: 2.875, 3: 3.500,
  4: 4.500, 5: 5.563, 6: 6.625,
  8: 8.625, 10: 10.75, 12: 12.75,
  14: 14, 16: 16, 18: 18, 20: 20, 24: 24, 30: 30, 36: 36,
};

import type { Point2D, Point3D, ViewType } from '../types';

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

export function project(p: Point3D, view: ViewType): Point2D {
  switch (view) {
    case 'iso-se': return { x: (p.x - p.y) * COS30, y: (p.x + p.y) * SIN30 - p.z };
    case 'iso-sw': return { x: (p.y - p.x) * COS30, y: (p.x + p.y) * SIN30 - p.z };
    case 'front':  return { x: p.x, y: -p.z };
    case 'side':   return { x: -p.y, y: -p.z };
  }
}

export function unproject(screen: Point2D, view: ViewType): Point3D {
  switch (view) {
    case 'iso-se': { const sum = screen.y / SIN30; const diff = screen.x / COS30; return { x: (sum + diff) / 2, y: (sum - diff) / 2, z: 0 }; }
    case 'iso-sw': { const sum = screen.y / SIN30; const diff = -screen.x / COS30; return { x: (sum - diff) / 2, y: (sum + diff) / 2, z: 0 }; }
    case 'front':  return { x: screen.x, y: 0, z: -screen.y };
    case 'side':   return { x: 0, y: -screen.x, z: -screen.y };
  }
}

export function screenToCanvas(screenX: number, screenY: number, panX: number, panY: number, scale: number): Point2D {
  return { x: (screenX - panX) / scale, y: (screenY - panY) / scale };
}

export function projectToSVG(p: Point3D, view: ViewType, scale: number, pan: Point2D): Point2D {
  const proj = project(p, view);
  return { x: proj.x * scale + pan.x, y: proj.y * scale + pan.y };
}

export function polyPoints(pts: Point3D[], view: ViewType, scale: number, pan: Point2D): string {
  return pts.map(p => { const s = projectToSVG(p, view, scale, pan); return `${s.x},${s.y}`; }).join(' ');
}

export function rotateY(p: Point3D, deg: number): Point3D {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad); const sin = Math.sin(rad);
  return { x: p.x * cos + p.z * sin, y: p.y, z: -p.x * sin + p.z * cos };
}

export function worldConnectionPos(localPos: Point3D, compPos: Point3D, rotY: number): Point3D {
  const rotated = rotateY(localPos, rotY);
  return { x: compPos.x + rotated.x, y: compPos.y + rotated.y, z: compPos.z + rotated.z };
}

export function worldConnectionNormal(normal: Point3D, rotY: number): Point3D { return rotateY(normal, rotY); }

export function dist3(a: Point3D, b: Point3D): number {
  const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
  return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

export function snapAxis(n: Point3D): Point3D {
  const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
  if (ax >= ay && ax >= az) return { x: Math.sign(n.x), y: 0, z: 0 };
  if (ay >= ax && ay >= az) return { x: 0, y: Math.sign(n.y), z: 0 };
  return { x: 0, y: 0, z: Math.sign(n.z) };
}

export function add3(a: Point3D, b: Point3D): Point3D { return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }; }
export function scale3(a: Point3D, s: number): Point3D { return { x: a.x * s, y: a.y * s, z: a.z * s }; }
export function sub3(a: Point3D, b: Point3D): Point3D { return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }; }

import type { PipeRoute, PipeSegment, PipeElbow, PipeFlange, Point3D, ConnectionEndType } from '../types';
import { add3, scale3, snapAxis } from './projection';

let _eid = 0;
const uid = () => `e${++_eid}-${Math.random().toString(36).slice(2, 7)}`;

const CLEARANCE = 24;

export function buildPipeRoute(
  id: string, fromComponentId: string, fromConnectionId: string,
  toComponentId: string, toConnectionId: string,
  fromPos: Point3D, fromNormal: Point3D, toPos: Point3D, toNormal: Point3D,
  pipeTypeId: string, nominalSize: number, endType: ConnectionEndType
): PipeRoute {
  const fNorm = snapAxis(fromNormal);
  const tNorm = snapAxis(toNormal);
  const p0 = fromPos;
  const p1 = add3(fromPos, scale3(fNorm, CLEARANCE));
  const p3 = add3(toPos, scale3(tNorm, CLEARANCE));
  const p4 = toPos;
  const middlePts = routeOrthogonal(p1, p3, fNorm, tNorm);
  const allPts = [p0, p1, ...middlePts, p3, p4];
  const segments: PipeSegment[] = [];
  const elbows: PipeElbow[] = [];
  for (let i = 0; i < allPts.length - 1; i++) {
    const s = allPts[i], e = allPts[i + 1];
    if (isSamePoint(s, e)) continue;
    segments.push({ id: uid(), start: s, end: e, axis: dominantAxis(s, e) });
  }
  for (let i = 0; i < segments.length - 1; i++) {
    const a = segments[i], b = segments[i + 1];
    const inDir = normalize3(sub3(a.end, a.start));
    const outDir = normalize3(sub3(b.end, b.start));
    if (!sameDir(inDir, outDir)) elbows.push({ id: uid(), position: a.end, inDir, outDir });
  }
  const flanges: PipeFlange[] = [
    { id: uid(), position: fromPos, normal: fNorm, nominalSize, endType },
    { id: uid(), position: toPos, normal: scale3(tNorm, -1), nominalSize, endType },
  ];
  return { id, fromComponentId, fromConnectionId, toComponentId, toConnectionId, pipeTypeId: pipeTypeId as PipeRoute['pipeTypeId'], nominalSize, segments, elbows, flanges, inlineComponents: [] };
}

function routeOrthogonal(p1: Point3D, p3: Point3D, inNorm: Point3D, outNorm: Point3D): Point3D[] {
  const dx = p3.x - p1.x, dy = p3.y - p1.y, dz = p3.z - p1.z;
  if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1 && Math.abs(dz) < 0.1) return [];
  const needX = Math.abs(dx) > 0.1, needY = Math.abs(dy) > 0.1, needZ = Math.abs(dz) > 0.1;
  const count = (needX ? 1 : 0) + (needY ? 1 : 0) + (needZ ? 1 : 0);
  if (count === 1) return [];
  const seq = chooseAxisOrder(inNorm, outNorm, needX, needY, needZ);
  const pts: Point3D[] = [];
  let cur = { ...p1 };
  for (let i = 0; i < seq.length - 1; i++) {
    const axis = seq[i];
    const target = { ...cur };
    if (axis === 'x') target.x = p3.x;
    if (axis === 'y') target.y = p3.y;
    if (axis === 'z') target.z = p3.z;
    if (!isSamePoint(cur, target)) pts.push(target);
    cur = target;
  }
  return pts;
}

function chooseAxisOrder(inNorm: Point3D, outNorm: Point3D, needX: boolean, needY: boolean, needZ: boolean): Array<'x'|'y'|'z'> {
  const axes: Array<'x'|'y'|'z'> = [];
  const inAxis = dominantAxisFromVec(inNorm);
  const outAxis = dominantAxisFromVec(outNorm);
  if (needX && inAxis === 'x') axes.push('x');
  if (needY && inAxis === 'y') axes.push('y');
  if (needZ && inAxis === 'z') axes.push('z');
  for (const a of ['x','y','z'] as const) {
    if ((a === 'x' ? needX : a === 'y' ? needY : needZ) && !axes.includes(a) && a !== outAxis) axes.push(a);
  }
  if ((outAxis === 'x' ? needX : outAxis === 'y' ? needY : needZ) && !axes.includes(outAxis)) axes.push(outAxis);
  for (const a of ['x','y','z'] as const) {
    if ((a === 'x' ? needX : a === 'y' ? needY : needZ) && !axes.includes(a)) axes.push(a);
  }
  axes.push(axes[axes.length - 1] || 'x');
  return axes;
}

function sub3(a: Point3D, b: Point3D): Point3D { return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }; }
function isSamePoint(a: Point3D, b: Point3D): boolean { return Math.abs(a.x-b.x)<0.01 && Math.abs(a.y-b.y)<0.01 && Math.abs(a.z-b.z)<0.01; }
function sameDir(a: Point3D, b: Point3D): boolean { return Math.abs(a.x-b.x)<0.01 && Math.abs(a.y-b.y)<0.01 && Math.abs(a.z-b.z)<0.01; }
function dominantAxis(a: Point3D, b: Point3D): 'x'|'y'|'z' { const dx=Math.abs(b.x-a.x),dy=Math.abs(b.y-a.y),dz=Math.abs(b.z-a.z); return dx>=dy&&dx>=dz?'x':dy>=dx&&dy>=dz?'y':'z'; }
function dominantAxisFromVec(v: Point3D): 'x'|'y'|'z' { const ax=Math.abs(v.x),ay=Math.abs(v.y),az=Math.abs(v.z); return ax>=ay&&ax>=az?'x':ay>=ax&&ay>=az?'y':'z'; }
function normalize3(v: Point3D): Point3D { const len=Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z)||1; return {x:v.x/len,y:v.y/len,z:v.z/len}; }

export function rebuildElbows(segments: PipeSegment[]): PipeElbow[] {
  const elbows: PipeElbow[] = [];
  for (let i = 0; i < segments.length - 1; i++) {
    const a = segments[i], b = segments[i+1];
    const inDir = normalize3(sub3(a.end, a.start));
    const outDir = normalize3(sub3(b.end, b.start));
    if (!sameDir(inDir, outDir)) elbows.push({ id: uid(), position: a.end, inDir, outDir });
  }
  return elbows;
}

export function closestSegmentPoint(segments: PipeSegment[], worldPt: Point3D): { segmentId: string; t: number; worldPoint: Point3D } | null {
  let best: { segmentId: string; t: number; worldPoint: Point3D } | null = null;
  let bestDist = Infinity;
  for (const seg of segments) {
    const { t, pt } = closestPointOnSegment(seg.start, seg.end, worldPt);
    const dx=pt.x-worldPt.x, dy=pt.y-worldPt.y, dz=pt.z-worldPt.z;
    const d = Math.sqrt(dx*dx+dy*dy+dz*dz);
    if (d < bestDist) { bestDist = d; best = { segmentId: seg.id, t, worldPoint: pt }; }
  }
  return best;
}

function closestPointOnSegment(a: Point3D, b: Point3D, p: Point3D): { t: number; pt: Point3D } {
  const ab = sub3(b, a), ap = sub3(p, a);
  const len2 = ab.x*ab.x+ab.y*ab.y+ab.z*ab.z;
  if (len2 < 0.0001) return { t: 0, pt: a };
  const t = Math.max(0, Math.min(1, (ap.x*ab.x+ap.y*ab.y+ap.z*ab.z)/len2));
  return { t, pt: { x: a.x+t*ab.x, y: a.y+t*ab.y, z: a.z+t*ab.z } };
}

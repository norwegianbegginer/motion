export interface Point { x: number; y: number; }
export function calculateAngle(a: Point, vertex: Point, c: Point): number { const ab = {x:a.x-vertex.x,y:a.y-vertex.y}, cb={x:c.x-vertex.x,y:c.y-vertex.y}; const denom=Math.hypot(ab.x,ab.y)*Math.hypot(cb.x,cb.y); if (!denom) return 0; const cosine=Math.max(-1,Math.min(1,(ab.x*cb.x+ab.y*cb.y)/denom)); return Math.acos(cosine)*180/Math.PI; }

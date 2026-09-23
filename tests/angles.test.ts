import { describe, expect, it } from "vitest"; import { calculateAngle } from "../src/biomechanics/angles";
describe("calculateAngle",()=>{it("calculates common angles",()=>{expect(calculateAngle({x:-1,y:0},{x:0,y:0},{x:1,y:0})).toBeCloseTo(180);expect(calculateAngle({x:0,y:-1},{x:0,y:0},{x:1,y:0})).toBeCloseTo(90);expect(calculateAngle({x:0,y:-1},{x:0,y:0},{x:1,y:-1})).toBeCloseTo(45);});});

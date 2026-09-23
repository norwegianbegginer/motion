export function toCanvasPoint(x:number,y:number, width:number,height:number, mirrored:boolean){return {x:(mirrored?1-x:x)*width,y:y*height};}

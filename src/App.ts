import p5 from "p5";
import { getElementSize } from "./dom_utils";

export interface LatLng{
  lat:number,
  lng:number,
}

interface DrawingSettings{
  canvasSize:p5.Vector;
  padding:p5.Vector;
  drawingSize:p5.Vector;
  pointSize:number;
  lineWidth:number;
}

export default class App{
  p:p5;
  sectionElement:HTMLElement;
  points:LatLng[];
  min:LatLng;
  max:LatLng;
  constructor(points:LatLng[]){
    const sectionElement=document.querySelector<HTMLElement>(".p-section-hero");
    if(!sectionElement){
      throw new Error("sectionElement is null");
    }
    this.sectionElement=sectionElement;
    this.points=points;
    this.min=points.reduce((a,b)=>{
      return {
        lat:Math.min(a.lat,b.lat),
        lng:Math.min(a.lng,b.lng),
      }
    })
    this.max=points.reduce((a,b)=>{
      return {
        lat:Math.max(a.lat,b.lat),
        lng:Math.max(a.lng,b.lng),
      }
    })
    const sketch=(p:p5)=>{
      this.p=p;
      p.setup=()=>{
        this.onSetup();
      };
      p.windowResized=()=>{
        this.onWindowResized();
      }
      p.draw=()=>{
        // this.stats.begin();
        this.onDraw();
        // this.stats.end();
      };
    };
    this.p=new p5(sketch,sectionElement);
  
  }
  onSetup(){
    const {width,height} = getElementSize(this.sectionElement);
    const {p}=this;
    p.createCanvas(width,height);
  }
  onWindowResized(){
    const {width,height} = getElementSize(this.sectionElement);
    const {p}=this;
    p.resizeCanvas(width,height);

  }
  onDraw(){
    const {p}=this;
    p.background(0,0,0);
    // p.rect(0,0,100,100);
    const {pointSize,lineWidth}=this.calcDrawingSettings();

    const color=p.color(255*0.5);

    // p.push();
    // p.noStroke();
    // p.fill(color);
    // for(let point of this.points){
    //   const v=this.convertLatLngToVector(point);
    //   p.circle(v.x,v.y,pointSize);
    // }
    // p.pop();
    // 双方向に描画する

    const lineDash=[pointSize*0.1,pointSize*0.9];
    const r=(performance.now()/1000)%1;
    const lineDashOffset=pointSize*r;

    p.push();
    p.blendMode(p.ADD);
    p.stroke(color);
    p.strokeWeight(lineWidth);
    const drawingContext=p.drawingContext as CanvasRenderingContext2D;
    drawingContext.setLineDash(lineDash);
    drawingContext.lineDashOffset=lineDashOffset;
    for(let pointFrom of this.points){
      for(let pointTo of this.points){
        if(pointFrom===pointTo){
          continue;
        }
        const vFrom=this.convertLatLngToVector(pointFrom);
        const vTo=this.convertLatLngToVector(pointTo);
        const vDiff=vTo.copy().sub(vFrom);
        if(vDiff.magSq()<pointSize*pointSize*10){
          p.line(vFrom.x,vFrom.y,vTo.x,vTo.y);
        }

      }
    }
    p.pop();

  }
  convertLatLngToVector(latlng:LatLng):p5.Vector{
    const {padding,drawingSize}=this.calcDrawingSettings();

    const drawingAspectRatio = drawingSize.x / drawingSize.y;
    const latDiff = this.max.lat - this.min.lat;
    const lngDiff = this.max.lng - this.min.lng;
    const latLngAspectRatio = lngDiff / latDiff;

    let drawingOffsetX = padding.x;
    let drawingOffsetY = padding.y;
    let scale;
    if (drawingAspectRatio > latLngAspectRatio) {
      // Fit to height
      scale = drawingSize.y / latDiff;
      drawingOffsetX += (drawingSize.x - lngDiff * scale) / 2;
    } else {
      // Fit to width
      scale = drawingSize.x / lngDiff;
      drawingOffsetY += (drawingSize.y - latDiff * scale) / 2;
    }
    
    const x = drawingOffsetX + (latlng.lng - this.min.lng) * scale;
    const y = drawingOffsetY + (this.max.lat - latlng.lat) * scale;
    const v=new p5.Vector(x,y);
    return v;
  }
  calcDrawingSettings():DrawingSettings{
    const {p}=this;
    const canvasSize=new p5.Vector(
      p.width,
      p.height
    );
    const padding=new p5.Vector(50,50);
    const drawingSize=canvasSize.copy().sub(padding.copy().mult(2));
    const min=Math.min(drawingSize.x,drawingSize.y);
    const lineWidth=min/400;
    const pointSize=lineWidth*10;
    return {
      canvasSize,
      padding,
      drawingSize,
      pointSize,
      lineWidth,
    }

  }
}
import p5 from "p5";
import { getElementSize } from "./dom_utils";

export interface LatLng{
  lat:number,
  lng:number,
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
    p.rect(0,0,100,100);

  }
}
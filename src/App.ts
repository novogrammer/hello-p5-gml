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
  convertLatLngToVector(latlng:LatLng):p5.Vector{
    const {p}=this;
    // const sizeLatLng={
    //   lat:this.max.lat - this.min.lat,
    //   lng:this.max.lng - this.min.lng,
    // };
    const sizeCanvas=new p5.Vector(
      p.width,
      p.height
    );
    const padding=new p5.Vector(50,50);
    // ひとまず単純にマッピング、アスペクト比は変わる

    const x=p.map(latlng.lng,this.min.lng,this.max.lng,padding.x,sizeCanvas.x-padding.x);
    const y=p.map(latlng.lat,this.min.lat,this.max.lat,sizeCanvas.y-padding.y,padding.y);
    const v=new p5.Vector(x,y);
    return v;
  }
  
  onDraw(){
    const {p}=this;
    // p.rect(0,0,100,100);
    for(let point of this.points){
      const v=this.convertLatLngToVector(point);
      p.circle(v.x,v.y,10);
    }

  }
}
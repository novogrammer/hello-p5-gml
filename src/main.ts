import App, { LatLng } from './App';
import './style.scss'
import {XMLParser} from "fast-xml-parser";


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <section class="p-section-hero"></section>
`



async function mainAsync(){
  const xmlData = await fetch("./P34-14_01.xml").then((res)=>res.text());
  const parser = new XMLParser({
    ignoreAttributes:false,
  });
  const obj=parser.parse(xmlData);
  // console.log(obj);
  const points:LatLng[]=obj?.["ksj:Dataset"]?.["gml:Point"]?.map((element:any)=>element?.["gml:pos"]).filter((point?:string)=>!!point).map((point:string)=>{
    const [lat,lng]=point.split(" ");
    return {
      lat:parseFloat(lat),
      lng:parseFloat(lng),
    }
  });
  // console.log(points);
  (window as any).app=new App(points);


  
}

mainAsync().catch((error)=>{
  console.error(error);
})
import './style.scss'
import {XMLParser} from "fast-xml-parser";


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>Hello!</div>
`

interface LatLng{
  lat:number,
  lng:number,
}

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
  console.log(points);
  const min:LatLng=points.reduce((a,b)=>{
    return {
      lat:Math.min(a.lat,b.lat),
      lng:Math.min(a.lng,b.lng),
    }
  })
  console.log(min);
  const max:LatLng=points.reduce((a,b)=>{
    return {
      lat:Math.max(a.lat,b.lat),
      lng:Math.max(a.lng,b.lng),
    }
  })
  console.log(max);

  
}

mainAsync().catch((error)=>{
  console.error(error);
})
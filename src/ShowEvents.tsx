import type { EventData } from "./models"


interface props{
    soc:EventData[],provider:string
}
 export const ShowEvents:React.FC<props>=({soc,provider} )=>{
return( soc.map((s, index) => (
    
            s.platform===provider?
        <div key={s.sourceId || index} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
          <h3>{s.title}</h3>
          <p><strong>Platform:</strong> {s.platform}</p>
          <p><strong>Start:</strong> {new Date(s.startTime).toLocaleString()}</p>
          <p><strong>End:</strong> {new Date(s.endTime).toLocaleString()}</p>
          <a href={s.link} target="_blank" rel="noopener noreferrer">Open in {provider}</a>
        </div>:""
      ))
    )

}
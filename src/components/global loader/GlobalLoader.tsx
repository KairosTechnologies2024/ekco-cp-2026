import { MoonLoader } from "react-spinners"

function GlobalLoader() {
  return (
      <div className="global-margin" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <MoonLoader color='white' size={25}/>
            </div>
  )
}

export default GlobalLoader
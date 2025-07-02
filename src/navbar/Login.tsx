import React, { useState } from 'react'
import { Connect } from './connprov'

export const Login=()=> {
  const [email,setEmail]=useState<string>();
  return (
    <div className='outerp1'>
      <div className='innerp1'>
        <div className='cont1'>
        <label>Login in with Google</label>
        <div className='gogl1'><button onClick={()=>Connect("","google")} className='logb1'>Login</button></div>
         <label>Login in with Facebook</label>
        <div className='fbl1'>
          <label>Email:</label>
          <input type='email' placeholder='Enter your Email' className='email1 ' id='Email' value={email} onChange={e=>setEmail(e.target.value)}></input>
          <button type='submit' onClick={()=>{
             if(email)
            Connect(email,"facebook");
          else alert('no email/email not valid')


          }} className='logb1'>Login</button>
          </div >
           <label>Login in with Twitter</label>
            <div className='twl1'>
        
          <label>Email:</label>
          <input type='email' placeholder='Enter your Email' className='email1' id='Email' value={email} onChange={e=>setEmail(e.target.value)}></input>
       
          <button onClick={()=>{
            if (email)
            Connect(email,"twitter");
          else alert('no email/email not valid')

          }} className='logb1'>Login</button>
          </div>
        </div>
      </div>
    </div>
  )

}
//import axios from 'axios'
//import React, { useEffect, useState } from 'react'

import { useState, type JSX } from "react";
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';

//import type { SessionData } from 'react-router-dom'
interface props{
    name:string,
    info:string |null,
    connected:boolean

}
const providerIcons: Record<string, JSX.Element> = {
  google: <FaGoogle color="#DB4437" />,
  facebook: <FaFacebook color="#1877F2" />,
  twitter: <FaTwitter color="#1DA1F2" />,
};


export const Connprov : React.FC<props>=({name,info,connected}) => {



  return (
    <div className='prov1'>
        <div className='provname1'>{name}<span style={{ margin:5 }} className="icn__pro">{providerIcons[name]}</span>
</div>
        
        <div className='proinfo1'>
          
        {  connected? <p style={{fontSize:20}}>{info}</p>:
            <button onClick={()=>{ 
                Connect(info,name);
                }
                  } className="cnt1">connect</button>
         }
        </div>
    </div>
  )
}




 export function   Connect (email:string|null,prov:string):void{
                    if (!email)
                       email="";
      
                     
       window.location.href = `http://localhost:8020/${prov}?state=${encodeURIComponent(email)}`;

  }
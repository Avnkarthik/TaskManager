import React, { useEffect, useState } from 'react'
import "./main.css"
import { Link, Navigate, Route, Routes, useNavigate, type NavigateFunction } from 'react-router-dom'
import { Connections } from './navbar/Connections'
import { Deadlines } from './navbar/Deadlines'
import { Home } from './navbar/Home'
import { Login } from './navbar/Login'
import { Register } from './Register'
import logo from './navbar/logo SEM.png';
import axios from 'axios'
import { useUserStore,useConnectionStore } from './store'
import { UserProfile } from './Profile'


export const Header:React.FC=()=> {
   const {resetConnections} = useConnectionStore()
 const {name,clearUser,email}=useUserStore();
  const navigate = useNavigate();
  
  
  const[username,setUserName]=useState<string>("login");
  const UserName= async()=>{
    try{
 await axios.get("http://localhost:8020/userData",{withCredentials:true}).then((respose)=>{
        
       setUserName(respose.data.username||"login"); 
       console.log(respose.data.username);
 })
      }catch (error) {
         console.error("Failed to fetch username:", error);
      }

 
}
  useEffect(()=>{
    UserName();
    
  },[])
  return (
    <div>
      <div className='main1'>
      
      <Routes>
            <Route path='/' element={<Navigate to="/login" replace />} ></Route>
        <Route path='/home' element={<Home/>}></Route>
         <Route path='/connections' element={<Connections />}></Route>
          <Route path='/deadlines' element={<Deadlines/>}></Route>
           <Route path='/login' element={<Login/>}></Route>
           <Route path='/register' element={<Register/>}></Route>
           <Route path="/profile" element={<UserProfile user={{name:name ||"",email:email||""}} />}></Route>
           
        
      </Routes>
     
      
  

    </div>
     
        <div className='nav__bar1'>
          <div className='logo1' style={{padding:0, marginLeft:50, marginBottom:37 }}><img src={logo}></img></div>
            <div className='nav__1 home1'>
              <Link to="/home" > Home</Link>
            </div>
             <div className='nav__1 con1'>
              <Link to='/connections'>Connections</Link></div>
              <div className='nav__1 dl1'>
                <Link to='/deadlines'>
                Deadlines
                </Link></div>
                {name?
               <div className='nav__1 login1'><Link to='/profile'>{name }</Link></div> :
               <div className='nav__1 login1'><Link to='/login'>{"login"}</Link></div>
               }
              { name?
               <div className='nav__1'> <Link to='/logout'><p onClick={()=>logout(clearUser,navigate,resetConnections)} style={{border:0}} className='l__outb'>logout</p> </Link></div>:""}
        </div>
    </div>
  )
}

 const logout= async (clearUser:()=>void,navigate:NavigateFunction,resetConnections: () => void)=>{
    resetConnections();
  try {
      await axios.post('http://localhost:8020/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      clearUser();
      navigate("/login");
    }

 }
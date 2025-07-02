import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useTodoStore } from '../store';

export const Deadlines=()=> {

  const{todos}=useTodoStore();
  const [events,setEvents]=useState<any[]>([]);
  const [date,setDate]=useState<Date>(new Date());
  const reqDate=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const newdate=e.target.value?new Date(e.target.value):new Date();
    console.log(newdate);
    setDate(newdate);
  }
  useEffect(()=>{
    loadNotif();
  },[]);

  const loadNotif=()=>{
   try {
    if (date !== undefined) {
      const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      axios.get(`http://localhost:8020/SortedEvents?date=${formattedDate}`, {
      
        withCredentials: true,
      }).then((res) => {
        console.log(res.data.events);
        setEvents(res.data.events);
      });
    } else {
      console.log("Enter date");
    }
  } catch (err) {
    console.log(err);
  }


  }
  return (
    <div className='dead__main'>
   <div className='dead__sp'>
    <label>ADDED DEADLINES</label>
    <div className='dead__1'>
      {todos
  .filter(evnt => {
    const today = new Date().toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'
    return evnt.dueDate === today;
  })
  .map(evnt => (
    <div className='dead__2' key={evnt.id || evnt.text}>
       <p className='danger__text'>
        {evnt.text}{' '}
        {evnt.completed ? <span style={{ color: 'green' }}>✅</span> : <span style={{ color: 'orange' }}>⚠️</span>}
      </p>

      <p>Task : {evnt.text}</p>
      <p>Due : {evnt.dueDate}</p>

    </div>
))}


    </div>
   </div>
   <div className='dead__sp'>
    <div className='dead__1'>
    <label>ALL DEADLINES</label>
    <span style={{display:"flex", marginLeft:"10px" }}>
    <input type='date' onChange={(e)=>{reqDate(e)}} value={date?.toISOString().split('T')[0]} className='inp__dd' ></input>
    <button onClick={loadNotif} className='inb__1'>Get</button>
    </span>
    </div>
    {  events&&events.length>0?
        events.map(event=>(
      <div className='dead__2'>
        
        <p><strong>Platform:</strong> {event.platform}</p>
          <p><strong>Start:</strong> {new Date(event.startTime).toLocaleString()}</p>
          <p><strong>Title</strong> {(event.title)}</p>
        
      </div>
      )) 
      :"No Events Found"
    }
   </div>
    </div>
  )
}


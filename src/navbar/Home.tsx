import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTodoStore } from '../store';
import { TaskInput } from './TaskInput';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import type { EventData } from '../models';
import { ShowEvents } from '../ShowEvents';




export const Home = () => {
  const todos = useTodoStore((state) => state.todos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const [twitEvents, setTwitEvents] = useState<any[]>([]);
  const [fbEvents,setFbEvents]=useState<any[]>([]);
  const [Task,setTask]=useState<string[]>();
  const [social, setSocial] = useState<EventData[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingDate, setEditingDate] = useState('');

  useEffect(() => {
    setTask(todos.map((t) => (t.completed ? `✅ ${t.text}` : t.text)));
  }, [todos]);

  const AddTask = () => {
    setEditingTaskId(null);
    setEditingText('');
    setEditingDate('');
    setShowInput(true);
  };

  useEffect(() => {
    axios.get<{ message: string; events: EventData[] }>(
        "http://localhost:8020/refreshNotif",
        { withCredentials: true }
      )
      .then((response) => {
        setSocial(response.data.events);
      })
      .catch((err) => {
        console.log(err);
      });

      axios.get<{ message: string; events: any[] }>( "http://localhost:8020/facebookEvents", { withCredentials: true })
      .then((res)=>{
        console.log("fbevents",res.data.events);
       setFbEvents(res.data.events);

      })
      .catch((err) => {
       
        console.log(err);
      });

      axios.get<{ message: string; events: Event[] }>( "http://localhost:8020/TwitterEvents", { withCredentials: true })
      .then((res)=>{
       setTwitEvents(res.data.events);
        console.log("twievents",res.data.events);
       

      })
      .catch((err) => {
        console.log(err);
      });


  }, []);

  const Refresh=()=>{
     axios.get<{ message: string; events: EventData[] }>(
        "http://localhost:8020/refreshNotif",
        { withCredentials: true }
      )
      .then((response) => {
        setSocial(response.data.events);
      })
      .catch((err) => {
        console.log(err);
      });

      axios.get<{ message: string; events: any[] }>( "http://localhost:8020/facebookEvents", { withCredentials: true })
      .then((res)=>{
        console.log("fbevents",res.data.events);
       setFbEvents(res.data.events);

      })
      .catch((err) => {
       
        console.log(err);
      });

      axios.get<{ message: string; events: Event[] }>( "http://localhost:8020/TwitterEvents", { withCredentials: true })
      .then((res)=>{
       setTwitEvents(res.data.events);
        console.log("twievents",res.data.events);
       

      })
      .catch((err) => {
        console.log(err);
      });



  }

  return (
    <div className='main1'>
      <div className='ws1'>
        <ul style={{ listStyleType: 'none' }}>
          {todos.map((t) => (
            <li key={t.id} className='Tsk1'>
              <span
                style={{
                  textDecoration: t.completed ? 'line-through' : 'none',
                  color:t.completed ? 'black':'red',
                  cursor: 'pointer',
                  
                }}
                onClick={() => toggleComplete(t.id)}
              >
                {t.completed ? '✅ ' : ''}
                {t.text}
                {t.dueDate && (
                  <span style={{ fontSize: '15px', color: 'blue', marginLeft: '0.5rem' }}>
                    (Due: {new Date(t.dueDate).toLocaleDateString()})
                  </span>
                )}
              </span>
              <div className='dam__1'>
                <button
                  onClick={() => {
                    setEditingTaskId(t.id);
                    setEditingText(t.text);
                    setEditingDate(t.dueDate || '');
                    setShowInput(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button onClick={() => deleteTodo(t.id)}>
                  <RiDeleteBin2Fill />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {showInput ? (
          <TaskInput
            onSave={(text, dueDate) => {
              if (editingTaskId) {
                updateTodo(editingTaskId, text, dueDate);
                setEditingTaskId(null);
              } else {
                addTodo(text, dueDate);
              }
              setShowInput(false);
              setEditingDate('');
            }}
            onCancel={() => {
              setShowInput(false);
              setEditingTaskId(null);
              setEditingDate('');
            }}
            initialValue={editingText}
            initialDate={editingDate}
          />
        ) : (
          <button className='btn1' onClick={AddTask}>+ADD</button>
        )}
      </div>

      <div className='ws2'>
        <button className='wsb__1' onClick={Refresh}>Refresh</button>
        <div className='alts1'>
          Google
          {social && social.length>0 ? (
            <div className='event1'>
              <ShowEvents soc={social} provider='Google' />
            </div>
          ) :  <p>No data yet</p> }
        </div>
        <div className='alts1'>
          Facebook
          {fbEvents && fbEvents.length > 0 ? (
    <div className='event1'>
      {fbEvents.map(event => (
        <div key={event.id} className="event-card">
          <p><strong>Message:</strong> {event.message ?? 'No message provided'}</p>
          <p><strong>Created:</strong> {new Date(event.created_time).toLocaleString()}</p>
          <a href={event.permalink_url} target="_blank" rel="noopener noreferrer">
            View Post
          </a>
        </div>
      ))}
    </div>
  ) : (
    <p>No Facebook events found.</p>
  )}

        </div>
        <div className='alts1'>
          Twitter
          {twitEvents && twitEvents.length>0 ? (
            <div className='event1'>
                <ShowEvents soc={twitEvents} provider='Twitter' />
            </div>
          ) : (
            <p>No Events Yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
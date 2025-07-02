import axios from 'axios';
import {create} from 'zustand';
import { persist } from 'zustand/middleware';
interface UserState{
    name:string|null,
    email:string |null,
    googleAT:string|null,
    facebookAt:string|null,
    twitterAt:string|null,
    
    fetchUser:()=>void,
    setUser:(email:string,name:string)=>void,
    clearUser:()=>void
}


export const useUserStore = create<UserState>((set) => ({
  name: null,
  email: null,
  googleAT:null,
  facebookAt:null,
  twitterAt:null,


  fetchUser: async () => {
    try {
      const response = await axios.get('http://localhost:8020/user',{withCredentials:true}); 
      const { name, email,googleAT,facebookAt,twitterAt } = response.data;
      set({ name, email,googleAT,facebookAt,twitterAt});
    } catch(err){
        console.log(err);
    }
    },

  setUser: (name, email) => set({ name, email }),
  clearUser: () => set({ name: null, email: null,googleAT:null,facebookAt:null,twitterAt:null }),
}));


// store/connectionStore.ts


interface ConnectionState {
  allProviders: string[];
  connected: string[];
  addConnected: (provider: string) => void;
  resetConnections: () => void;
  getUnconnected: () => string[];
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      allProviders: ['google', 'facebook', 'twitter'],
      connected: [],

      addConnected: (provider) =>
  set((state) => ({
    connected: Array.from(new Set([...state.connected, provider])),
  })),
      resetConnections: () => set({ connected: [] }),

      getUnconnected: () => {
        const { allProviders, connected } = get();
        return allProviders.filter((p) => !connected.includes(p));
      },
    }),
    {
      name: 'connection-storage', 
      partialize: (state) => ({
        connected: state.connected, 
      }),
    }
  )
);





export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; 
}

interface TodoState {
  todos: Todo[];
  addTodo: (text: string, dueDate?: string) => void; 
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  updateTodo: (id: string, newText: string, dueDate?: string) => void; 
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (text, dueDate) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: crypto.randomUUID(), text, completed: false, dueDate },
          ],
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      toggleComplete: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      updateTodo: (id, newText, dueDate) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text: newText, dueDate } : todo
          ),
        })),
    }),
    {
      name: 'todo-storage',
    }
  )
);

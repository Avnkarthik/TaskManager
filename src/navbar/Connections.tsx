import React, { useEffect } from 'react';
import { Connprov } from './connprov';
import { useSearchParams } from 'react-router-dom';
import { useUserStore } from '../store';
import { useConnectionStore } from '../store';

export const Connections = () => {
  const { email, fetchUser,googleAT,facebookAt,twitterAt } = useUserStore();
  const { connected, addConnected, getUnconnected } = useConnectionStore();
  const [paramget] = useSearchParams();

  useEffect(() => {
    const p = paramget.get('provider');
    if (p) {
          fetchUser();
          if(googleAT)
      addConnected("google");
         if(facebookAt)
      addConnected("facebook");
      if(twitterAt)
      addConnected("twitter");  
      
    }
   

  }, [paramget]);

  const unconnected = getUnconnected();
  
 // resetConnections();

  return (
    <div>
      { <div className='consp'>
        {connected.map((provider:string) => (
          <Connprov key={provider} name={provider} info={email} connected={true} />
        ))}
      </div> }
      <div className='consp'>
        {unconnected.map((provider:string) => (
          <div key={provider}>
            <Connprov name={provider} info={email} connected={false} />
          </div>
        ))}
      </div>
    </div>
  );
};
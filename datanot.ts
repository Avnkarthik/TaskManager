import axios from "axios";
import "express-session"


export async function fetchGoogleEvents(accessToken: String) {
    console.log("in google api");
    console.log(accessToken);
    try{
  const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data.items;
}catch(err){
  return (err);
}
  
}

export async function fetchFacebookEvents(accessToken: String) {
     console.log("in fb api");
     console.log(accessToken);
  const response = await axios.get(`https://graph.facebook.com/v12.0/me/events?access_token=${accessToken}`);
   console.log(response);
  return response.data.data;
}

export async function fetchTwitterEvents(accessToken: String) {
     console.log("in tw api");
     console.log(accessToken);
  const response = await axios.get(`https://api.twitter.com/2/tweets/search/recent?query=event`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data.data;
}

 

 export function notifyUser(title: string, message: string) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  }
}
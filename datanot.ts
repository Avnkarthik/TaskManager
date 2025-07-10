import axios from "axios";
import "express-session"
import  dotenv from "dotenv";
import {google} from "googleapis"

dotenv.config();
export async function fetchGoogleEvents(accessToken: string) {
    console.log("in google api");
   // console.log(accessToken);
    try{
  const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
   
  return response.data.items;
}catch(err){
  return (err);
}
  
}
export async function fetchGmailEvents(accessToken:string){
   const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 10,
    });

    const messages = response.data.messages || [];

    const detailedMessages = await Promise.all(
      messages.map((msg) =>
        gmail.users.messages.get({ userId: 'me', id: msg.id! })
      )
    );

    const parsed = detailedMessages.map((msg) => ({
      id: msg.data.id,
      snippet: msg.data.snippet,
      from: msg.data.payload?.headers?.find((h) => h.name === 'From')?.value,
      subject: msg.data.payload?.headers?.find((h) => h.name === 'Subject')?.value,
      date: msg.data.payload?.headers?.find((h) => h.name === 'Date')?.value,
    }));

    return (parsed);
  } catch (err) {
    console.error('Gmail fetch error:', err);
  }

}

export async function fetchFacebookEvents(accessToken: string) {
     console.log("in fb api");
     console.log(accessToken);
  const response = await axios.get(`https://graph.facebook.com/v12.0/me/posts?fields=id,message,created_time,story,permalink_url&access_token=${accessToken}`);
  console.log("sucess on fb");
  // console.log(response);
  return response.data.data;
}

export async function fetchTwitterEvents(accessToken: string) {
     console.log("in tw api");
     console.log(accessToken);
  const response = await axios.get(`https://api.twitter.com/2/tweets/search/recent?query=event&tweet.fields=created_at,author_id`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  console.log("sucess on twit");
  return response.data.data;
}

 

 export function notifyUser(title: string, message: string) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  }
}

export const normalizeGoogle = (event: any, userId: String) => ({
  platform: "Google",
  title: event.summary,
  description: event.description,
  startTime: event.start?.dateTime,
  endTime: event.end?.dateTime,
  link: event.htmlLink,
  sourceId: event.id,
  raw: event,
  userId
});

export const normalizeFacebook = (event: any, userId: String) => ({
  platform: "Facebook",
  title: event.name,
  description: event.description,
  startTime: event.start_time,
  endTime: event.end_time,
  link: `https://facebook.com/events/${event.id}`,
  sourceId: event.id,
  raw: event,
  userId
});

export const normalizeTwitter = (tweet: any, userId: String) => ({
  platform: "Twitter",
  title: tweet.text.slice(0, 50),
  description: tweet.text,
  startTime: tweet.created_at,
  endTime: undefined,
  link: `https://twitter.com/i/web/status/${tweet.id}`,
  sourceId: tweet.id,
  raw: tweet,
  userId
});

export const normalizeGmail = (event: any, userId: String) => ({
  platform: "Google",
  title: event.snippet,
  description: event.subject,
  startTime: event.date,
  sourceId: event.id,
  raw: event,
  userId
});
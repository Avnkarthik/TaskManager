import { validationResult } from "express-validator";
import { dbconnection, FacebookUser, GoogleUser, mergedModel, TaskModel, UnifiedEvent, Usermodel } from "./database";
import express,{NextFunction, Request,Response} from "express"
import dotenv from "dotenv"
import axios from "axios";
import passport from "passport";
import { fetchFacebookEvents, fetchGmailEvents, fetchGoogleEvents, fetchTwitterEvents, normalizeFacebook, normalizeGmail, normalizeGoogle, normalizeTwitter } from "./datanot";
import { codeChallenge, codeVerifier, generateCodeChallenge, generateCodeVerifier } from "./OAuth";
import { createToken, googleRefresh, twitterRefresh, verifyToken } from "./middleware";
import webpush from "web-push";
import schedule from "node-schedule"
dotenv.config();
export const gettask=async (req:Request,res:Response)=>{
 await dbconnection();
res.status(200).json( await TaskModel.find());


} ;


//inserting tasks




export const inserttasks=async (req:Request,res:Response)=>{
    await dbconnection();
    let errors=validationResult(req);
    if(!errors.isEmpty()){
      res.status(400).json(errors);

    }
    let newobj=new TaskModel(req.body);
    await newobj.save();
    
    res.status(201).json({"mssg":"inserted sucessfully",obj:newobj});


};


//updating tasks


export const updatetask=async (req:Request,res:Response)=>{
    await dbconnection();
   let id=req.params.id;
   let updatedobj=req.body;
    let obj=TaskModel.find({id});
    let newobj=new TaskModel({...obj,...updatedobj});
  let dbres= await  newobj.save()
    res.json(204).json(dbres);
};


//logging in for new user



export const userlogin=async (req:Request,res:Response)=>{
await dbconnection();
let result;
if(req.query.newuser){
let newobj=new Usermodel(req.body);
 result=await newobj.save();
}else{
  result=Usermodel.find(req.body);
  if(!result||result==undefined)
    res.status(404).json({mssg:"user not found"})
}

res.status(201).json({mssg:"inserted",obj:result});
};
/*export const authenticated=async (req:Request,res:Response)=>{
  let response;
  if(req.query.sucessbygoogle){
     response=await axios.post('https://oauth2.googleapis.com/token', {
  client_id: process.env.GOOGLE_CLIENT_ID!,
  client_secret: process.env.GOOGLE_CLIENT_SECRET!,
  redirect_uri:"http://localhost/dashboard",
  grant_type: 'authorization_code',
  code: req.query.code // Authorization code received from Google
});
const google_access_token=response.data.accessToken;
if(req.user!=undefined){
/*req.session.user ={
  name:req.user.name,
  email:req.user.emails?.[0].value,
googleaccessToken:google_access_token,
  twitteraccesstoken: req.user.twitteraccesstoken ?? undefined,
  facebookaccesstoken: req.body.facebookaccesstoken ?? undefined



}
}
req.session.save(() => {
  res.redirect('/dashboard'); 
});

  }
  if(req.query.successbytwitter){

  }if(req.query.successbyfacebook){

  }

};*/


//saving user tokens using session




/*export const googleSaveSession= async (req:Request,res:Response)=>{
  console.log("Save sesssion");
 
 // req.session.user=req.user as typeof req.session.user;
  console.log("Session  merge:", req.session.user);
  if(!req.session.user){
   req.session.user={};
  }
  
  const user=req.user as GoogleUser;
  if(user!==undefined){
         req.session.user = req.session.user || {};
         req.session.user.google={};
                  req.session.user.id = user.id;
            req.session.user.name = user.name ;
            req.session.user.email = user.email;
            req.session.user.google.googleAccessToken = user.googleAccessToken;
            req.session.user.google.googleRefreshToken = user.googleRefreshToken;
  }


 
  console.log(req.session.user);
   console.log("Session after merge:", req.session.user);


    req.session.save((err)=>{
    if(err){
    console.log("saves successfully")
  res.status(401).json(err);
    }
     res.redirect("/dashboard");
  
  });
 
};


export const fbSaveSession=async (req:Request,res:Response)=>{
  console.log(req.session.id);
  if(req.session.user===undefined){
     res.status(400).json({errormssg:req.session.user});
     return;
  }
         const user = req.user as FacebookUser;
         req.session.user.facebook={};
    req.session.user.facebook.facebookAccessToken = user.facebookAccessToken;
      req.session.user.facebook.facebookRefreshToken = user.facebookRefreshToken;
       req.session.save((err) => {
    if (err) {
      console.error("Session save failed", err);
       res.status(500).json({ error: "Session save failed", details: err });
       return;
    }

    res.redirect("/dashboard");
  
});
}*/

//google acess tokens saving
export const googleSaveSession=async (req:Request,res:Response)=>{
 // await dbconnection();
  console.log("in google save session")
  const user = req.user as GoogleUser;
  if (!user) return res.redirect("/login?error=google_failed");

  const token = createToken({
    id: user.id,
    name: user.name,
    email: user.email,
    googleAccessToken: user.googleAccessToken,
    googleRefreshToken: user.googleRefreshToken,
    provider: "google",
  });

  res.redirect(`/dashboard?token=${token}`);


};
export const facebookhandler=(req:Request, res:Response, next:NextFunction) => {
  
// console.log("in handlers");
  passport.authenticate("facebook", {
   
    scope: ["public_profile"],
    state: res.locals.state,
    session: false
  })(req, res, next);
};
export const fbSaveSession=async (req:Request,res:Response)=>{
   //console.log("in fb save session")

  const user = req.user as FacebookUser;
       const stateToken = decodeURIComponent(req.query.state as string);

   //console.log("user",user,"state",stateToken);
  if (!user||!stateToken) return res.redirect("/login?error=facebook_failed");
 //const googleData = verifyToken(stateToken) as any;

    // Merge user data from both Google and Facebook
    const combinedUser = {
      
      
      email: stateToken,
      
      facebookAccessToken: user.facebookAccessToken,
      facebookRefreshToken: user.facebookRefreshToken,
    };

    const token = createToken({
      ...combinedUser,
      provider:"facebook"
    });

  res.redirect(`/dashboard?token=${encodeURIComponent(token)}`);



}


//refetch data from social media apps



export const renotify=async (req:Request,res:Response)=>{
 
      console.log("in renotify");
     //  setInterval(async ()=>{
      console.log("in set intervel");
      //const email= decodeURIComponent(req.query.state as string);
      const email=req.session.user?.email;
       console.log("Eamil:",email);
      if(!email){
         console.log("No session found, redirecting...");
    res.status(401).json({ message: 'Not authenticated' });
    return;
       // res.redirect("http://localhost:5173/login");
        
      }

      await dbconnection();
     
      const UserData= await mergedModel.findOne({email:email});
        if(!UserData){
          res.json({error:"no user"})
          return;
        }
     
            let twitterEvents,googleEvents,facebookEvents,gmailEvents; 
            if(UserData?.googleAccessToken!==undefined && UserData.googleAccessToken!=null){

                  console.log("in gg api");
                  googleEvents=await fetchGoogleEvents(UserData.googleAccessToken!);
                  gmailEvents=await fetchGmailEvents(UserData.googleAccessToken);

                  
   
            }
         /*  if(UserData.facebookAccessToken!==undefined){
                    console.log("in fb api");
                    facebookEvents=await fetchFacebookEvents(UserData.facebookAccessToken!);
             }
          if(UserData.twitterAccessToken){
                    console.log("in twit api");
                    twitterEvents=await fetchTwitterEvents(UserData.twitterAccessToken);
            }
              // res.send({ge:googleEvents,fe:facebookEvents,te:twitterEvents});
              console.log("googleEvents",googleEvents);
              console.log("twitter Events",twitterEvents);
             //  console.log("facebook Events:",facebookEvents);*/
            
              let userId=UserData._id.toString();
              if(userId!==undefined){
                   const events: any[] = [];
                   if (googleEvents){

                    events.push(...googleEvents.map((e:any) => normalizeGoogle(e, userId)));
                    if(gmailEvents)
                    events.push(...gmailEvents.map((e:any)=>normalizeGmail(e,userId)))

                   }
                //   if (facebookEvents) events.push(...facebookEvents.map((e:any)=> normalizeFacebook(e, userId)));
             // if (twitterEvents) events.push(...twitterEvents.map((e:any)=> normalizeTwitter(e, userId)));
                  //  console.log(events.map(e => [e.platform, e.userId]));
                  
                try{ 
                   await UnifiedEvent.insertMany(events);
                    res.json({ message: "Events stored", events:events });
                } catch (err) {
                     console.error("Ingest error:", err);
                     res.status(500).json({ error: "Failed to ingest events" });
                }

                     console.log("Events: ",events);
                }else{
                  console.log("nouser");
                      res.status(401).json("unregistered user");
                }


  // res.send({googmssg:googleEvents,twittermssg:twitterEvents||" no data",facebookmssg:facebookEvents||"no data"});
 
      


   // },100);
 };
 dotenv.config();


 //twitter Authentication


 export const twitterauth=async (req:Request,res:Response)=>{
   const stateToken = decodeURIComponent(req.query.state as string); // Google JWT token
   let token=encodeURIComponent(stateToken);
  if (!stateToken) {
     res.status(400).json({ error: "Missing state token" });
     return;
  }

  
  const TWITTER_REDIRECT_URI="http://localhost:8020/auth/twitter";
  const codeVerifier = await generateCodeVerifier();
   const codeChallenge = generateCodeChallenge(codeVerifier);
    res.cookie("twitter_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });

   //req.session.user.codeVerifier=codeVerifier;
  // console.log("🔁 Callback query:", req.query);

  // console.log("code verifier1:",codeVerifier);
  
  const  authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${TWITTER_REDIRECT_URI}&scope=tweet.read users.read offline.access&state=${token}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  res.redirect(authUrl);
  

 };



 //callback for twitter



 export const callbackTwitter=async (req:Request,res:Response)=>{
     console.log("in call back");
     const clientIdSecret = `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`;
     const encodedCredentials = Buffer.from(clientIdSecret).toString('base64');


     const authCode = req.query.code as string;
      //console.log(authCode)
      const stateToken = decodeURIComponent(req.query.state as string || "");
      const codeVerifier=req.cookies.twitter_code_verifier;

       try {
             const TWITTER_REDIRECT_URI="http://localhost:8020/auth/twitter";
            const response = await axios.post('https://api.twitter.com/2/oauth2/token', {
              client_id: process.env.TWITTER_CLIENT_ID,
              client_secret: process.env.TWITTER_CLIENT_SECRET,
              redirect_uri: TWITTER_REDIRECT_URI,
              grant_type: 'authorization_code',
              code: authCode,
              code_verifier:codeVerifier
          },{
            headers:{
              'Authorization': `Basic ${encodedCredentials}`,
              'Content-Type': 'application/x-www-form-urlencoded'

            }
          });
          //  console.log("Received Token Data:", response.data)
            const { access_token, refresh_token } = response.data;

           const email=decodeURIComponent(req.query.state as string || "");
          
    const mergedUser={
      
      email:email,
    
      twitterAccessToken:access_token,
      twitterRefreshToken:refresh_token,
        provider:"twitter"

    }

    const finalToken = createToken(mergedUser);
    res.redirect(`/dashboard?token=${encodeURIComponent(finalToken)}`);


  }catch(error:any){

            console.error("OAuth Error Response:", error.response?.data || error.message);
          res.status(500).json({ error: error.response?.data || "Authentication failed" });



  }

  


 };
export const dashboard = async (req:Request,res:Response)=>{
    //console.log("in  dashboard")

dotenv.config();
  try {
    const token = req.query.token as string;
    if (!token) {
       res.status(401).json({mssg:"No token provided"});
       return;
    }

    const userData = verifyToken(token) as any;
    if (!userData?.email || !userData?.provider) {
      res.status(401).json({mssg:"Invalid token"});
      return;
    }
  if(userData.name){
console.log("family name:",userData.name.familyName);
console.log("givenName:",userData.name.givenName);
  }
    if(!req.session.user)
       req.session.user={};
      if( !req.session.user?.email&& userData.email)
                       req.session.user.email=userData.email;
if (!req.session.user.name && userData.name) {
  const { familyName, givenName } = userData.name;
  if (familyName || givenName) {
    req.session.user.name = [familyName, givenName].filter(Boolean).join(" ");
  }
}

      console.log("name:",req.session.user.name);

    await dbconnection();

    // Upsert user info in DB
    const filter = { email:userData.email };
    const update = {
      name:userData.familyName+userData.givenName,
      email: userData.email,
      ...(userData.googleAccessToken && {
        googleAccessToken: userData.googleAccessToken,
        googleRefreshToken: userData.googleRefreshToken,
      }),
      ...(userData.facebookAccessToken && {
        facebookAccessToken: userData.facebookAccessToken,
        facebookRefreshToken: userData.facebookRefreshToken,
      }),
      ...(userData.twitterAccessToken && {
        twitterAccessToken: userData.twitterAccessToken,
        twitterRefreshToken: userData.twitterRefreshToken,
      }),
    }; 
  

    await mergedModel.findOneAndUpdate(filter, {$set:update}, { upsert: true, new: true });
  //res.status(200).json({mssg:"update success"});
 // console.log("token",token);
  /*  res.send(`
      <h2>Welcome, ${userData.name}</h2>
      <p>From: ${userData.provider}</p>
      <p>Email: ${userData.email}</p>
      <a href="/facebook?state=${encodeURIComponent(token)}">Link to facebook</a></br>
      <a href="/twitter?state=${encodeURIComponent(userData.email)}">Link to twitter</a></br>
      <a href="/refreshNotif?state=${encodeURIComponent(userData.email)}">Refresh Notifications</a>
      <pre>${JSON.stringify(userData, null, 2)}</pre></br>
      
    `);*/
    console.log("Redirecting to:", process.env.front_end);
   res.redirect(`${process.env.front_end}/connections?email=${userData.email}&provider=${userData.provider}`)
  // res.redirect("http://localhost:5173/connections");
  } catch (error: any) {
    console.error("Dashboard error:", error);
    res.status(500).send("Invalid or expired token.");
  }



 };
 export const UserName=async(req:Request,res:Response)=>{
       let googleAT=false,facebookAT=false,twitterAT=false;
       // const email=req.query.email;
        // console.log("email",email);
      if(req.session.user){
       await  dbconnection();
      
      
       const email=req.session.user.email;
      
        const UserData=await mergedModel.findOne({email:email});
          if(UserData){
           //  console.log("google",UserData?.googleAccessToken);
        if(UserData.googleAccessToken!==undefined &&  UserData.googleAccessToken!==null)
            googleAT=true;
           if(UserData.facebookAccessToken!==undefined && UserData.facebookAccessToken!==null)
            facebookAT=true;
           if(UserData.twitterAccessToken!==undefined && UserData.twitterAccessToken!==null)
            twitterAT=true;

      }
    }
    
    
      // console.log("User details:",googleAT,facebookAT,twitterAT);
      if(req.session.user?.name&& req.session.user?.email)
        res.json({name:req.session.user.name,email:req.session.user.email,googleAT,facebookAT,twitterAT});
      else 
    res.status(401).json({ error: "User not logged in" });


 }
 export const logout=(req:Request,res:Response)=>{
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('connect.sid'); 
    res.sendStatus(200);
  });



 }

 export const fbEvents=async(req:Request,res:Response)=>{
       console.log("in fb events");

        const email=req.session.user?.email;
       console.log("Eamil:",email);
      if(!email){
         console.log("No session found, redirecting...");
    res.status(401).json({ message: 'Not authenticated' });
    return;
       
        
      }


       await dbconnection();
     
      const UserData= await mergedModel.findOne({email:email});
        if(!UserData){
          console.log("no user in fb");
          res.json({error:"no user"})
          return;
        }
        let facebookEvents="";
         if(UserData.facebookAccessToken!==undefined&&UserData.facebookAccessToken!=null){
                    console.log("in fb api");
                    facebookEvents=await fetchFacebookEvents(UserData.facebookAccessToken!);
                    console.log(facebookEvents);
                    res.json({message:"Data sent successfully",events:facebookEvents});
             }
             else{
              console.log("no user au  in fb");
              res.json({error:"no user is authenticated" });
             }


 }



 export const twitEvents=async(req:Request,res:Response)=>{
     console.log("in twit events");
        const email=req.session.user?.email;
       console.log("Eamil:",email);
      if(!email){
         console.log("No session found, redirecting...");
    res.status(401).json({ message: 'Not authenticated' });
    return;
       
        
      }


       await dbconnection();
     
      const UserData= await mergedModel.findOne({email:email});
        if(!UserData){
            console.log("no user in twit");

          res.json({error:"no user"})
          return;
        }
        let twitterEvents;
         if(UserData.twitterAccessToken!==undefined&&UserData.twitterAccessToken!=null){
                    console.log("in twit api");
                    twitterEvents=await UnifiedEvent.find({platform:"Twitter"});
                   // twitterEvents=await fetchTwitterEvents(UserData.facebookAccessToken!);
                    console.log(twitEvents);
                    res.json({message:"Data sent successfully",events:twitterEvents});
             }
             else{
              console.log("no user au  in twit");
              res.json({error:"no user is authenticated" });
             }


 }




interface NormalizedEvent {
  platform: 'Google' | 'Facebook' | 'Twitter';
  title: string;
  description: string;
  startTime: string;
  endTime?: string;
  link?: string;
  sourceId?: string;
  userId?: string;
  raw: any;
}

export const SortedEvents = async (req: Request, res: Response): Promise<void>  => {

  
  try {
    const rawDate = req.query.date;
    if (typeof rawDate !== 'string') {
      res.status(400).json({ error: 'Invalid or missing date parameter' });
      return;
    }

    const targetDate = new Date(rawDate);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const email = req.session.user?.email;
    if (!email) {
       res.status(401).json({ message: 'Not authenticated' });
       return;
    }

    await dbconnection();
    const UserData = await mergedModel.findOne({ email });
    if (!UserData) {
       res.status(404).json({ error: "No user found" });
       return;
    }

    // Fetch events from all platforms
    let googleEvents: any[] = [];
    let facebookEvents: any[] = [];
    let twitterEvents: any[] = [];

    if (UserData.googleAccessToken) {
      googleEvents = (await fetchGoogleEvents(UserData.googleAccessToken));
         googleEvents= googleEvents.map(evnt => ({
        ...evnt,
        platform: 'Google',
      }));
    }

    if (UserData.facebookAccessToken) {
      facebookEvents = (await fetchFacebookEvents(UserData.facebookAccessToken))
      facebookEvents=facebookEvents.map(e => ({
        ...e,
        platform: 'Facebook',
      }));
    }

    if (UserData.twitterAccessToken) {
      console.log("in twitter sorted");
      twitterEvents = (await UnifiedEvent.find({ platform:"Twitter" }));
      console.log("teiiter Evnts:",twitterEvents);
     /* twitterEvents=twitterEvents.map(e => ({
        ...e,
        platform: 'Twitter',
      }));*/
    }

    const allEvents = [...googleEvents, ...facebookEvents, ...twitterEvents];

    // Normalize events — return type is (NormalizedEvent | null)[]
    const rawNormalizedEvents = allEvents.map((event): NormalizedEvent | null => {
      // Google
      if (event.platform === 'Google' || event.kind === 'calendar#event') {
        const title = event.summary?.trim();
        const description = event.description?.trim() || '';
        const startTime = event.start?.dateTime;
        const endTime = event.end?.dateTime;
        const link = event.htmlLink;
        const sourceId = event.id;
        const userId = UserData._id.toString();

        if (!title && !description) return null;
        if (!startTime) return null;

        return {
          platform: 'Google',
          title,
          description,
          startTime,
          endTime,
          link,
          sourceId,
          userId,
          raw: event,
        };
      }

      // Facebook
      if (event.platform === 'Facebook') {
        const message = event.message?.trim();
        const startTime = event.created_time;
        const link = event.permalink_url;
        const sourceId = event.id;
        const userId = UserData._id.toString();

        if (!message || !startTime) return null;

        return {
          platform: 'Facebook',
          title: 'Facebook Post',
          description: message,
          startTime,
          link,
          sourceId,
          userId,
          raw: event,
        };
      }

      // Twitter
     if (event.platform === 'Twitter') {
  const title = event.title;
  const description = event.description || '';
  const startTime = event.startTime.toISOString();
  const link = event.link;
  const sourceId = event.sourceId || event.raw?.id;
  const userId = event.userId;

  if (!title || !startTime || !sourceId) return null;

  return {
    platform: "Twitter",
    title,
    description,
    startTime,
    link,
    sourceId,
    userId,
    raw: event,
  };
}


      return null;
    });

    // ✅ Now safely filter to enforce `NormalizedEvent[]` type
    const normalizedEvents: NormalizedEvent[] = rawNormalizedEvents.filter(
      (e): e is NormalizedEvent => e !== null && typeof e.startTime === 'string'
    );

    // Filter by date
    const filteredEvents = normalizedEvents.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= startOfDay && eventDate <= endOfDay;
    });

     res.json({ message: "Filtered events", events: filteredEvents });
  } catch (error) {
    console.error("Error in SortedEvents:", error);
    res.status(500).json({ error: "Internal server error", details: (error as Error).message });
  }
};

export const DeleteAccount=async (req:Request,res:Response)=>{
  const prov=req.query.prov as string;
  const email=req.session.user?.email;
  if(!email){
    res.status(401).json("User not authenticated");
    return;
  }
  dbconnection();

  if(prov=='google'){
    await mergedModel.updateOne({email:email},{$set:{
      googleAccessToken:null,
      googleRefreshToken:null,
    }})

  }else if(prov=='facebook'){
     await mergedModel.updateOne({email:email},{$set:{
      facebookAccessToken:null,
      facebookRefreshToken:null,
    }})

  }else if(prov=='twitter'){
    await  mergedModel.updateOne({email:email},{$set:{
      twitterAccessToken:null,
      twitterRefreshToken:null,
    }})

  }
  res.status(200).json({mssg:"Account deleted sucessfully"});

}


export const EmailEvents=async(req:Request,res:Response)=>{
  
 console.log("in twit events");
        const email=req.session.user?.email;
       console.log("Eamil:",email);
      if(!email){
         console.log("No session found, redirecting...");
    res.status(401).json({ message: 'Not authenticated' });
    return;
       
        
      }


       await dbconnection();
     
      const UserData= await mergedModel.findOne({email:email});
        if(!UserData){
            console.log("no user in twit");

          res.json({error:"no user"})
          return;
        }
        let emailEvents;
         if(UserData.googleAccessToken!==undefined){
                    console.log("in twit api");
                    
                    emailEvents=await fetchGmailEvents(UserData.googleAccessToken!);
                    console.log(emailEvents);
                    res.json({message:"Data sent successfully",events:emailEvents});
                    return;
             }
             else{
              console.log("no user au  in google");
              res.json({error:"no user is authenticated" });
             }



}




export const Subscribe = (req: Request, res: Response) => {
  const { subscription, task } = req.body;
  dotenv.config();

  
  if (!subscription || !task || !task.time || !task.title) {
     res.status(400).json({ error: 'Missing subscription or task data' });
     return;
  }

  let scheduledDate = new Date(task.time);
  console.log(scheduledDate)
  const now = new Date();

  // ✅ Prevent scheduling in the past
  if (scheduledDate.getTime() <= now.getTime()) {
     return;
  }

  const jobId = `${task.id}-${scheduledDate.getTime()}`;

  const payload = JSON.stringify({
    title: `🔔 ${task.title}`,
    body: `🕒 ${task.time || '10:00 PM'} on ${task.platform || 'Custom'}\n📝 ${task.description || 'No details provided.'}`,
    icon: '/icon-192.png',
    data: {
      url: task.link || `${process.env.front_end}/deadlines`,
    },
  });

  // ✅ Schedule the push notification
  schedule.scheduleJob(jobId, scheduledDate, () => {
    console.log(`📬 Sending push for "${task.title}" at ${scheduledDate}`);
    webpush.sendNotification(subscription, payload).catch(console.error);
  });

  console.log(`📅 Scheduled push for "${task.title}" at ${scheduledDate.toISOString()} with job ID: ${jobId}`);

  res.status(201).json({ message: 'Notification scheduled' });
};
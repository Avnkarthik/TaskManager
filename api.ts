import { validationResult } from "express-validator";
import { dbconnection, TaskModel, Usermodel } from "./database";
import express,{Request,Response} from "express"
import app from "./server";
import dotenv from "dotenv"
import MongoStore from "connect-mongo";
import session,{SessionOptions} from "express-session"
import axios from "axios";
import { profile } from "console";
import passport from "passport";
import { fetchFacebookEvents, fetchGoogleEvents, fetchTwitterEvents } from "./datanot";
import { codeChallenge, codeVerifier, generateCodeChallenge, generateCodeVerifier } from "./OAuth";
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


//saving user tikens using session




export const savesession=(req:Request,res:Response)=>{
  console.log("Save sesssion");
 
 // req.session.user=req.user as typeof req.session.user;
 req.session.user={...req.session.user,...req.user};
  console.log(req.session.user);
  req.session.save((err)=>{
    if(err){
    console.log("saves successfully")
  res.status(401).json(err);
    }
  });
  res.redirect("/dashboard");
  
};




//refetch data from social media apps



export const renotify=async (req:Request,res:Response)=>{
 if(req.session.user===undefined)
 res.status(401).json({mssg:req.session.user});
console.log("in renotify");
  //  setInterval(async ()=>{
      console.log("in set intervel");
      if(req.session.user!==undefined){ 
        let twitterEvents,googleEvents,facebookEvents; 
        if(req.session.user.googleAccessToken!==undefined){ 
          console.log("in gg api");
   googleEvents=await fetchGoogleEvents(req.session.user.googleAccessToken);
        }
        if(req.session.user.facebookAccessToken!==undefined){
          console.log("in fb api");
  // facebookEvents=await fetchFacebookEvents(req.session.user.facebookAccessToken);
        }
  if(req.session.user.twitterAccessToken){
    console.log("in twit api");
  // twitterEvents=await fetchTwitterEvents(req.session.user.twitterAccessToken);
        }
 // res.send({ge:googleEvents,fe:facebookEvents,te:twitterEvents});
 //console.log("googleEvents",googleEvents);
// console.log("twitter Events",twitterEvents);
// console.log("facebook Events:",facebookEvents);
 res.send({googmssg:googleEvents,twittermssg:twitterEvents||"",facebookmssg:facebookEvents||""});
 
      }


   // },100);
 };
 dotenv.config();


 //twitter Authentication


 export const twitterauth=async (req:Request,res:Response)=>{
  if(req.session.user===undefined)
    res.status(401).json({mssg:"not valid user"});
  else{
  const TWITTER_REDIRECT_URI="http://localhost:8020/auth/twitter";
  const codeVerifier = await generateCodeVerifier();
   const codeChallenge = generateCodeChallenge(codeVerifier);
   req.session.user.codeVerifier=codeVerifier;
   console.log("code verifier1:",codeVerifier);
  
  const  authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${TWITTER_REDIRECT_URI}&scope=tweet.read users.read offline.access&state=random_state&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  res.redirect(authUrl);
  }
 };



 //callback for twitter



 export const callbackTwitter=async (req:Request,res:Response)=>{
  console.log("in call back");
  const clientIdSecret = `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`;
const encodedCredentials = Buffer.from(clientIdSecret).toString('base64');


   const authCode = req.query.code as string;
   console.log(authCode)

  try {
    const TWITTER_REDIRECT_URI="http://localhost:8020/auth/twitter";
    const response = await axios.post('https://api.twitter.com/2/oauth2/token', {
      client_id: process.env.TWITTER_CLIENT_ID,
      client_secret: process.env.TWITTER_CLIENT_SECRET,
      redirect_uri: TWITTER_REDIRECT_URI,
      grant_type: 'authorization_code',
      code: authCode,
      code_verifier:req.session.user?.codeVerifier
    },{
      headers:{
         'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'

      }
    });
    console.log("Received Token Data:", response.data)
    const { access_token, refresh_token } = response.data;

    
    req.session.user = {
     
      twitterAccessToken: access_token,
      twitterRefreshToken: refresh_token
    };
    req.session.save(() => {
      res.json({ message: 'Twitter Auth Successful', accessToken: access_token });
    });

  }catch(error:any){
     console.error("OAuth Error Response:", error.response?.data || error.message);
  res.status(500).json({ error: error.response?.data || "Authentication failed" });



  }

  


 }
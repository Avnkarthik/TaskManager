import {z,AnyZodObject} from "zod"
import { Response,Request,NextFunction } from "express";
import {body,validationResult} from "express-validator";
import jwt from "jsonwebtoken";
import axios from "axios";
import passport from "passport";
import dotenv from "dotenv"
dotenv.config();
export const userSchema=z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(8)
});

export const userval=(schema:AnyZodObject)=>(req:Request,res:Response,nxt:NextFunction)=>{
   try{ schema.parse(req.body);
    nxt();
   }catch(error){
    res.status(400).json({"mssg":"insert failed due to  error",errors:error});
   }

}
export const taskval=[
    body("Eventdate").matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("time and date not  in required format"),
    body('Eventname').isString().withMessage("Not a string"),
   body('Eventtime')
  .matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/)
  .withMessage('Eventtime must be in HH:MM:SS format')

];
export const googleRefresh=async (req:Request,res:Response,next:NextFunction)=>{
    
    if(req.session.user?.google!==undefined){
        
  try{
  const ggAccessToken=await axios.post("https://oauth2.googleapis.com/token",{
    client_id:process.env.GOOGLE_CLIENT_ID!,
    client_secret:process.env.GOOGLE_CLIENT_SECRET,
     refresh_token: req.session.user.google.googleRefreshToken,
      grant_type: "refresh_token",


  });
  req.session.user.google.googleAccessToken=ggAccessToken.data.access_token;
  next();
}catch(err){
   res.json(err);
}
    }else res.status(400).json("invalid user");
 }
 export const facebookRefresh=async (req:Request,res:Response,next:NextFunction)=>{
    if(req.session.user?.facebook!==undefined){
       
        try {
            let refreshToken=req.session.user.facebook.facebookRefreshToken;
    const response = await axios.get(
      `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&fb_exchange_token=${refreshToken}`
    );

    req.session.user.facebook.facebookAccessToken = response.data.access_token;
    console.log({ message: "Facebook token refreshed", accessToken: response.data.access_token });
    next();
  } catch (error:any) {
    res.status(500).json({ error: error.response?.data || "Failed to refresh Facebook token" });
  }
    }
 }
 export const twitterRefresh=async (req:Request,res:Response,next:NextFunction)=>{
           if(req.session.user?.twitter!==undefined){
            let refreshToken=req.session.user.twitter.twitterRefreshToken!;
            try {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    const response = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      params.toString(),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
     req.session.user.twitter.twitterAccessToken = response.data.access_token;
    req.session.user.twitter.twitterRefreshToken = response.data.refresh_token;
    res.json({ message: "Twitter token refreshed", accessToken: response.data.access_token });
  } catch (error:any) {
    res.status(500).json({ error: error.response?.data || "Failed to refresh Twitter token" });
  }



           }

 }
 

export const createToken = (payload: any) => {
  //console.log("secret jwt",process.env.JWT_SECRET,"payload",payload);
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });
};


export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}

export const stateMiddleware=(req:Request,res:Response,next:NextFunction)=>{
  const { state } = req.query;
  //console.log("in middle ware");
  if (!state) {
     res.status(400).send("Missing state (Google JWT)");
     return;
  }
  // Store the state for access later (e.g., in session or res.locals)
  res.locals.state = state;
  next();

}
import {z,AnyZodObject} from "zod"
import { Response,Request,NextFunction } from "express";
import {body,validationResult} from "express-validator";
import axios from "axios";
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
    
    if(req.session.user!==undefined){
        
  try{
  const ggAccessToken=await axios.post("https://oauth2.googleapis.com/token",{
    client_id:process.env.GOOGLE_CLIENT_ID!,
    client_secret:process.env.GOOGLE_CLIENT_SECRET,
     refresh_token: req.session.user.googleRefreshToken,
      grant_type: "refresh_token",


  });
  req.session.user.googleAccessToken=ggAccessToken.data.access_token;
  next();
}catch(err){
   res.json(err);
}
    }else res.status(400).json("invalid user");
 }
 export const facebookRefresh=async (req:Request,res:Response,next:NextFunction)=>{
    if(req.session.user!==undefined){
       
        try {
            let refreshToken=req.session.user.facebookRefreshToken;
    const response = await axios.get(
      `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&fb_exchange_token=${refreshToken}`
    );

    req.session.user.facebookAccessToken = response.data.access_token;
    console.log({ message: "Facebook token refreshed", accessToken: response.data.access_token });
    next();
  } catch (error:any) {
    res.status(500).json({ error: error.response?.data || "Failed to refresh Facebook token" });
  }
    }
 }
 export const twitterRefresh=async (req:Request,res:Response,next:NextFunction)=>{
           if(req.session.user!==undefined){
            let refreshToken=req.session.user.twitterRefreshToken!;
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
     req.session.user.twitterAccessToken = response.data.access_token;
    req.session.user.twitterRefreshToken = response.data.refresh_token;
    res.json({ message: "Twitter token refreshed", accessToken: response.data.access_token });
  } catch (error:any) {
    res.status(500).json({ error: error.response?.data || "Failed to refresh Twitter token" });
  }



           }

 }
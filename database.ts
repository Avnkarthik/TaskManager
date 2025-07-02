
import  express  from "express";
import mongoose,{Schema,model} from "mongoose";
import { date, string } from "zod";
import "express-session";
import dotenv from "dotenv";
export const dbconnection=async()=>{
   dotenv.config();
    try{
     
    await mongoose.connect(process.env.dburl!).then(()=>{
   console.log("Database connected Succesfully");
   return;
    })
  
    }catch(error){
        console.log("some error:",error);

    }
}


let user= new mongoose.Schema({
       name:{
        type:String,
        required:true,


       },
       email:{
        type:String,
        required:true

       },
       password:{
        type:String,
        required:true
       }


});

let  events=new mongoose.Schema({
    Eventname:{
        type:String,
        required:true

    },
    Eventdate:{
        type:String,
        required:true
    },
    Eventtime:{
        type:String,
        required:true
    }
});
declare module 'express-session'{
     interface SessionData{
        user: {
  id?: String;
  name?: String;
  email?: String;
   codeVerifier?:String
   

  google?: {
    googleAccessToken?: String;
    googleRefreshToken?: String;
  };
  facebook?: {
    facebookAccessToken?: String;
    facebookRefreshToken?: String;
  };
  twitter?: {
    twitterAccessToken?: string;
    twitterRefreshToken?: string;
  };
 
}

    }


}
export const normDataSchema=new mongoose.Schema({

  platform: { type: String, 
            enum: ["Google", "Facebook", "Twitter"],
            required: true
         },
  title: String,
  description: String,
  startTime: Date,
  endTime: Date,
  link: String,
  sourceId: String,
  raw: Object,
  userId: { type: String, 
          required: true
 }
});

  

export const UnifiedEvent= mongoose.model("UnifiedEvent", normDataSchema);




export let Usermodel=model("user",user);
export let TaskModel=model("Task",events);
export interface FacebookUser{
      id:String,
   name:String,
   email:String,
   facebookAccessToken:String,
   facebookRefreshToken:String
  }
  export interface GoogleUser{
      id:String,
   name:String,
   email:String,
   googleAccessToken:String,
   googleRefreshToken:String
  }
  const Mergedschema=new mongoose.Schema({
    id:String,
    token:String,
    name:String,
    email:String,
     googleAccessToken: String,
    googleRefreshToken: String,
     facebookAccessToken: String,
    facebookRefreshToken: String,
     twitterAccessToken: String,
    twitterRefreshToken: String,
    codeVerifier:String


  });
 export  const mergedModel=model("MergedSession",Mergedschema);
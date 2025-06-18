
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
        user?:{  
                id?:String|undefined,
               name?:String|undefined,
                email?:String|undefined,
                googleAccessToken?:String,
                googleRefreshToken?:String,
                facebookAccessToken?:String,
                facebookRefreshToken?:String,
                twitterAccessToken?:String,
                twitterRefreshToken?:string,
                codeVerifier?:String
           };
    }


}
export let Usermodel=model("user",user);
export let TaskModel=model("Task",events);
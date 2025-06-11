import  express  from "express";
import mongoose,{Schema,model} from "mongoose";
import { date } from "zod";
export const dbconnection=async()=>{
    console.log("called dbconnection");
    try{
      console.log("in try");
    await mongoose.connect("mongodb+srv://codesurfers:Anna2004@mydatabase.qsqf5jj.mongodb.net/APPUSERS?retryWrites=true&w=majority&appName=mydatabase").then(()=>{
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
    Eventtime:{
        type:Date,
        required:true
    }
});
export let Usermodel=model("user",user);
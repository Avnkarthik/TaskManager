import { Express } from "express";
import mongoose,{Schema,model} from "mongoose";
import { date } from "zod";
export const dbconnection=async()=>{
    try{
    
    await mongoose.connect("mongodb+srv://codesurfers:avn@codeforce2025@mydatabase.qsqf5jj.mongodb.net/?retryWrites=true&w=majority&appName=mydatabase");
   console.log("Database connected Succesfully");
    }catch(error){
        console.log("some error:",error);

    }
}

const user= new mongoose.Schema({
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
const events=new mongoose.Schema({
    Eventname:{
        type:String,
        required:true

    },
    Eventtime:{
        type:Date,
        required:true
    }
});

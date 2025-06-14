import { validationResult } from "express-validator";
import { dbconnection, TaskModel, Usermodel } from "./database";
import express,{Request,Response} from "express"
import app from "./server";
import dotenv from "dotenv"
import MongoStore from "connect-mongo";
import session,{SessionOptions} from "express-session"
dotenv.config();
export const gettask=async (req:Request,res:Response)=>{
 await dbconnection();
res.status(200).json( await TaskModel.find());


} ;
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
export const updatetask=async (req:Request,res:Response)=>{
    await dbconnection();
   let id=req.params.id;
   let updatedobj=req.body;
    let obj=TaskModel.find({id});
    let newobj=new TaskModel({...obj,...updatedobj});
  let dbres= await  newobj.save()
    res.json(204).json(dbres);
};
export const userlogin=async (req:Request,res:Response)=>{
await dbconnection();
let result;
if(req.query.newuser){
let newobj=new Usermodel(req.body);
 result=await newobj.save();
}

res.status(201).json({mssg:"inserted",obj:result});
};
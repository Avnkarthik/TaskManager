import express,{Router} from "express";

import { taskval, userSchema, userval } from "./middleware";
import { validationResult } from "express-validator";
import { gettask, inserttasks, updatetask, userlogin } from "./api";
import passport from "./OAuth";

 

export const controll=Router();
controll.get("/tasks",gettask);
controll.post("/insert",taskval,inserttasks );
controll.put("/update:id",updatetask);
controll.post("/userlogin",userlogin);

controll.get("/google",passport.authenticate('google',{scope:['email','profile']}));
controll.get("/auth/google",passport.authenticate('google',{successRedirect:"/dashboard/success",failureRedirect:"/dashboard/failure"}));
controll.get("twitter",passport.authenticate('twitter'));
controll.get("/auth/twitter",passport.authenticate('twitter',{successRedirect:"/dashboard/success",failureRedirect:"/dashboard/failure"}));
controll.get("/facebook",passport.authenticate('facebook',{scope:['email','profile']}));
controll.get("auth/facebook",passport.authenticate('facebook',{successRedirect:"/dashboard/success",failureRedirect:"/dashboard/failure"}));
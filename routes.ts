import express,{Router} from "express";

import { taskval, userSchema, userval } from "./middleware";
import { validationResult } from "express-validator";
import { callbackTwitter, gettask, inserttasks, renotify, savesession, twitterauth, updatetask, userlogin } from "./api";
import passport from "./OAuth";


 

export const controll=Router();
controll.get("/tasks",gettask);
controll.post("/insert",taskval,inserttasks );
controll.put("/update:id",updatetask);
controll.post("/userlogin",userlogin);

controll.get("/google",passport.authenticate('google',{scope:['email','profile','https://www.googleapis.com/auth/calendar'] ,prompt: 'consent',accessType: 'offline' }));
controll.get("/auth/google",passport.authenticate('google',{failureRedirect:"/dashboard?failure"}),savesession);
controll.get("/twitter",twitterauth);
controll.get("/auth/twitter",callbackTwitter);
controll.get("/facebook",passport.authenticate('facebook',{scope:['email','public_profile','user_events']}));
controll.get("auth/facebook",passport.authenticate('facebook',{failureRedirect:"/dashboard?failure"}),savesession);
controll.get("/refreshNotif",renotify)
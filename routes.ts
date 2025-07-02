import express,{NextFunction, Router,Request,Response} from "express";

import { facebookRefresh, googleRefresh, stateMiddleware, taskval, twitterRefresh, userSchema, userval } from "./middleware";
import { validationResult } from "express-validator";
import { callbackTwitter, gettask, inserttasks, renotify, fbSaveSession, twitterauth, updatetask, userlogin, googleSaveSession, dashboard, facebookhandler, UserName, logout, fbEvents, twitEvents, SortedEvents } from "./api";
import passport from "./OAuth";


 

export const controll=Router();
controll.get("/tasks",gettask);
controll.post("/insert",taskval,inserttasks );
controll.put("/update:id",updatetask);
controll.post("/userlogin",userlogin);

controll.get("/google",passport.authenticate('google',{scope:['email','profile','https://www.googleapis.com/auth/calendar'] ,prompt: 'consent',accessType: 'offline' }));
controll.get("/auth/google",passport.authenticate('google',{failureRedirect:"/dashboard?failure"}),googleSaveSession);
controll.get("/twitter",twitterauth);
controll.get("/auth/twitter",callbackTwitter);
//controll.get("/facebook",passport.authenticate('facebook',{scope:["email"]}));
controll.get("/facebook",stateMiddleware,facebookhandler);
/*controll.get("/facebook", (req, res, next) => {
  const token = "<HARDCODED_VALID_GOOGLE_JWT>";
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
    state: token,
  session:false
  })(req, res, next);
});*/

controll.get("/auth/facebook/callback",passport.authenticate('facebook',{failureRedirect:"/dashboard?failure",session:false}),fbSaveSession);

controll.get("/refreshNotif",renotify);
controll.get("/dashboard",dashboard);
controll.get("/user",UserName);
controll.post("/logout",logout);
controll.get("/facebookEvents",fbEvents);
controll.get("/TwitterEvents",twitEvents);
controll.get("/sortedEvents",SortedEvents);
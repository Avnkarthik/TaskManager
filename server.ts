import express from "express";
import { controll } from "./routes";
import session, { SessionData } from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors"
import { dbconnection, UnifiedEvent } from "./database";
import bodyParser from "body-parser";
import webpush from "web-push"
import path from "path";
dotenv.config();
const app = express();


app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));
dotenv.config();

const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey =  process.env.VAPID_PRIVATE_KEY;


webpush.setVapidDetails(
  'mailto:annavarapukarthik0@gmail.com',
  publicVapidKey!,
  privateVapidKey!
);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: true,
  saveUninitialized:false,
  store: MongoStore.create({
    mongoUrl: process.env.dburl!,
    dbName:"APPUSERS",
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 ,
    httpOnly: true,
      secure: false,
      sameSite:"lax"
  } 
}));
app.use(passport.initialize());
app.use(passport.session());
 passport.serializeUser((user,done)=> {
     console.log({mssg:user});
    done(null,user);
   
});
  passport.deserializeUser((user:any,done)=>done(null,user));
  
 

  app.use(controll)
    app.listen(8020, () => {
      console.log("Listening to port 8020");
    });

 


export default app;









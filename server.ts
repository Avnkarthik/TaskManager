import express from "express";
import { controll } from "./routes";
import session, { SessionData } from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import passport from "passport";
dotenv.config();
const app = express();


app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.dburl!,
    dbName:"APPUSERS",
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } 
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
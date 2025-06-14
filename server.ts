import express from "express";
import { controll } from "./routes";
import { dbconnection } from "./database";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();
const app = express();


app.use(express.json());
const sessionOptions: session.SessionOptions = {
  secret: process.env.SESSION_SECRET!, 
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.dburl!,
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } 
};

app.use(session(sessionOptions));
      

  app.use(controll)
    app.listen(8020, () => {
      console.log("Listening to port 8020");
    });

 


export default app;
import express, { Request, Response, NextFunction } from "express";
import { dbconnection, Usermodel } from "./database";

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to the database
const db=dbconnection()
  .then(() => {
    app.listen(8020, () => {
      console.log("Listening to port 8000");
    });
  })
  .catch((error: Error) => {
    console.error("Failed to connect to database:", error);
  });
  const newuser=new Usermodel({
    name:"Karthik",
    email:"annakarthik@gmail",
    password:"123@avn"

  })
  newuser.save().then(()=>{console.log("saves sucessfuly")});



export default app;
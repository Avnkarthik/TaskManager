import {z,AnyZodObject} from "zod"
import { Response,Request,NextFunction } from "express";
import {body,validationResult} from "express-validator";
export const userSchema=z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(8)
});

export const userval=(schema:AnyZodObject)=>(req:Request,res:Response,nxt:NextFunction)=>{
   try{ schema.parse(req.body);
    nxt();
   }catch(error){
    res.status(400).json({"mssg":"insert failed due to  error",errors:error});
   }

}
export const taskval=[
    body("Eventdate").matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("time and date not  in required format"),
    body('Eventname').isString().withMessage("Not a string"),
   body('Eventtime')
  .matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/)
  .withMessage('Eventtime must be in HH:MM:SS format')

]
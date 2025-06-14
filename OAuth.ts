import  passport  from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as FacebookStrategy } from "passport-facebook";

import dotenv from "dotenv"
dotenv.config();

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID!,
    clientSecret:process.env.GOOGLE_SECRET!,
    callbackURL:"http://localhost:8020/auth/google"

},async(accessToken, refreshToken, profile, done)=>{

 return done(null,profile)}));
 passport.use(new FacebookStrategy({
    clientID:process.env.FACEBOOK_CLIENT_ID!,
    clientSecret:process.env.FACEBOOK_CLIENT_SECRET!,
    callbackURL:"http://localhost:8020/auth/facebook",
    profileFields: ['id', 'displayName', 'emails']

 },async (accessToken,refreshToken,profile,done)=>{
    return done(null,profile)
 }));
 passport.use(new TwitterStrategy({
   consumerKey:process.env.TWITTER_CLIENT_ID!,
   consumerSecret:process.env.TWITTER_CLIENT_SECRET!,
   callbackURL:"http://localhost:8020/auth/twitter"
 },(token,tokenSecret,profile ,done)=>{
  return done(null,profile)
 }));

export default passport;
import  passport  from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as TwitterStrategy } from "passport-oauth2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import crypto from "crypto";

import dotenv from "dotenv"
dotenv.config();
console.log(process.env.GOOGLE_CLIENT_ID);
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID!,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL:"http://localhost:8020/auth/google",
 scope: ['https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly']
},async(accessToken, refreshToken, profile, done)=>{
  const user={
   id:profile.id,
   name:profile.name,
   email:profile.emails?.[0].value,
   googleAccessToken:accessToken,
   googleRefreshToken:refreshToken
  }
 return done(null,user)}));
 passport.use(new FacebookStrategy({
    clientID:process.env.FACEBOOK_CLIENT_ID!,
    clientSecret:process.env.FACEBOOK_CLIENT_SECRET!,
    callbackURL:"http://localhost:8020/auth/facebook",
    profileFields: ['id', 'displayName', 'emails']

 },async (accessToken,refreshToken,profile,done)=>{
   const user={
      id:profile.id,
   name:profile.name,
   email:profile.emails?.[0].value,
   facebookAccessToken:accessToken,
   facebookRefreshToken:refreshToken
  }
    return done(null,user)
 }));
 passport.use(new TwitterStrategy({
   authorizationURL: 'https://twitter.com/i/oauth2/authorize',
  tokenURL: 'https://api.twitter.com/2/oauth2/token',
  clientID: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  callbackURL: "http://localhost:8020/auth/twitter",
  scope: ['tweet.read', 'users.read', 'offline.access'], // ✅ Added required scopes
  state: true


 }, async (accessToken: any, refreshToken: any, profile: any, done:any) => {
    console.log("in callback");
   const user={   id:profile.id,
   name:profile.name,
   email:profile.emails?.[0].value,
   twitterAccessToken:accessToken,
   twitterRefreshToken:refreshToken
   }
   return done(null, user);
}));
 export function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

export function generateCodeChallenge(verifier: string) {
  return crypto.createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // ✅ Ensures proper Base64-URL encoding
}
export const codeVerifier = generateCodeVerifier();
export const codeChallenge = generateCodeChallenge(codeVerifier);



export default passport;
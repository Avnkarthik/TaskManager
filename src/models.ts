 export interface SessionData{
        
  id?: string;
  name?: string;
  email?: string;
  provider:string,
    googleAccessToken?: string;
    googleRefreshToken?: string;
    facebookAccessToken?: string;
    facebookRefreshToken?: string;
    twitterAccessToken?: string;
    twitterRefreshToken?: string;
  
 
}

    export interface EventData {
      platform: string;
      title: string;
      startTime: string;
      endTime: string;
      link: string;
      sourceId: string;
    }
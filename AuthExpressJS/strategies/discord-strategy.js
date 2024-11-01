import passport from "passport";
import { Strategy } from "passport-discord"
import dotenv from "dotenv"

dotenv.config()

passport.use(
    new Strategy({
clientID : process.env.DISCORD_SECRET_ID,
clientSecret: process.env.DISCORD_SECRET,
callbackURL : "http://localhost:3000/api/auth/discord/redirect",
scope : ['identify', "guilds"]
    } , () => {

    })
)
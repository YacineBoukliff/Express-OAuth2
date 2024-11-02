import passport from "passport";
import { Strategy } from "passport-discord";
import dotenv from "dotenv";
import { DiscordUser } from "../models/discordSchema.js";

dotenv.config();

passport.serializeUser((user,done) => {
    done(null,user.id)
})
passport.deserializeUser(async (id, done) => {
    try {
        const utilisateur = await DiscordUser.findById(id);
        done(null, utilisateur);
    } catch (err) {
        done(err);
    }
});

export default passport.use(
    new Strategy({
        clientID: process.env.DISCORD_SECRET_ID,
        clientSecret: process.env.DISCORD_SECRET,
        callbackURL: "http://localhost:3000/api/auth/discord/redirect",
        scope: ['identify',"email"]
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const findUser = await DiscordUser.findOne({ discordId: profile.id });
            
            if (!findUser) {
                const newUser = new DiscordUser({
                    utilisateur: profile.username,  
                    discordId: profile.id,
                    email: profile.email
                });
                const newSavedUser = await newUser.save();
                return done(null, newSavedUser);
            }
            
            return done(null, findUser);
            
        } catch (error) {
            console.error('Erreur:', error);  
            return done(error, null);
        }
    })
);



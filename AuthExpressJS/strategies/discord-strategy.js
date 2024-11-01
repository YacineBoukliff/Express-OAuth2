import passport from "passport";
import { Strategy } from "passport-discord";
import dotenv from "dotenv";
import { DiscordUser } from "../models/discordSchema.js";

dotenv.config();

export default passport.use(
    new Strategy({
        clientID: process.env.DISCORD_SECRET_ID,
        clientSecret: process.env.DISCORD_SECRET,
        callbackURL: "http://localhost:3000/api/auth/discord/redirect",
        scope: ['identify']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Profile reçu:', profile);  // Pour voir le contenu du profil
            const findUser = await DiscordUser.findOne({ discordId: profile.id });
            
            if (!findUser) {
                const newUser = new DiscordUser({
                    utilisateur: profile.username,  // Changé ici
                    discordId: profile.id
                });
                console.log('Tentative de création:', newUser);  // Pour voir l'objet avant sauvegarde
                const newSavedUser = await newUser.save();
                console.log('Utilisateur sauvegardé:', newSavedUser);  // Pour confirmer la sauvegarde
                return done(null, newSavedUser);
            }
            
            return done(null, findUser);
            
        } catch (error) {
            console.error('Erreur:', error);  // Pour voir les erreurs en détail
            return done(error, null);
        }
    })
);
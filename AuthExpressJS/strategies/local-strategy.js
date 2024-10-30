import passport from "passport";
import { Strategy } from "passport-local";
import { Utilisateur } from "../models/model.js";
import bcrypt from 'bcrypt';

passport.use(new Strategy({
    usernameField: 'utilisateur',
    passwordField: 'motdepasse'
}, async (utilisateur, motdepasse, done) => {
    try {
        const utilisateurTrouve = await Utilisateur.findOne({ utilisateur });
        
        if (!utilisateurTrouve) {
         throw new Error("Utilisateur non existant");
        }

        const motDePasseValide = await bcrypt.compare(motdepasse, utilisateurTrouve.motdepasse);
        if (!motDePasseValide) {
            return done(null, false, { message: "Mot de passe incorrect" });
        }

        return done(null, utilisateurTrouve);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((MonUser, done) => {
    done(null, MonUser._id);
});

passport.deserializeUser(async (_id, done) => {
    try {
        const utilisateur = await Utilisateur.findById(_id);
        done(null, utilisateur);
    } catch (err) {
        done(err);
    }
});


export default passport;
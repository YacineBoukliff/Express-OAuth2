import { Router } from "express";
import { Utilisateur } from "../models/model.js";
import bcrypt from "bcrypt"
import passport from "../strategies/local-strategy.js";
import "../strategies/discord-strategy.js"


const router = Router()

const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json("Vous devez être connecté pour accéder à cette ressource");
};


router.post("/register", async (req,res) => {
const {utilisateur,motdepasse} = req.body

const nouvelUtilisateur = await Utilisateur.findOne({utilisateur})

 if(nouvelUtilisateur) return res.status(400).send("Cet Utilisateur existe déja ")

    const motdepassehash = await bcrypt.hash(motdepasse,10)
    const NewUtilisateur = new Utilisateur({
        utilisateur,
        motdepasse : motdepassehash

    })

    await NewUtilisateur.save()
    res.status(200).send(NewUtilisateur)
})

router.post("/login", async (req, res) => {
    const {utilisateur,motdepasse} = req.body

    const UtilisateurExistant = await Utilisateur.findOne({utilisateur})

    if(!UtilisateurExistant) return res.status(400).send("Cet Utilisateur n'existe pas  ")

    const motdepassevalide = await bcrypt.compare(motdepasse, UtilisateurExistant.motdepasse)
    if(!motdepassevalide) return res.status(400).send('Votre mot de passe est incorrect')


        res.status(200).send("Bravo pour la connexion")

});

router.post("/passeport" , passport.authenticate("local"), (req,res) => {
    res.status(200).send("Connexion validée")
})


router.get('/passeport/auth',checkAuth, (req, res) => {
    res.send(req.user)
})

router.get("/passeport/stop", checkAuth, (req, res) => {
    res.json("Accès autorisé - vous êtes connecté");
});

router.post('/passeport/logout', checkAuth, (req, res) => {
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        
        req.session.destroy((err) => {
            if (err) return res.status(400).send("Erreur lors de la déconnexion");
            
            res.clearCookie('connect.sid');
            
            return res.status(200).json("Vous êtes déconnecté");
        });
    });
});

router.get('/', (req,res) => {
    res.json('Coucou')
})

router.get ('/discord', passport.authenticate('discord'))

router.get ('/succes', (req,res) => {
    res.json("Super")
})

router.get ('/echec', (req,res) => {
    res.json("echec")
})

router.get('/discord/redirect', 
    passport.authenticate('discord', {
        successRedirect: '/api/auth/succes',  
        failureRedirect: '/api/auth/echec'
    })
);


export default router


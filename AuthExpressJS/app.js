import express from "express"
import session from "express-session"
import mongoose from "mongoose"
import MongoStore from 'connect-mongo'
import dotenv from "dotenv"
import { User } from "./models/model.js"

dotenv.config()
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', './views')

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connecté à MongoDB'))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,  
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.SESSION_DB_URI,
        collectionName: 'sessions',
        stringify: false,  
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,    // Empêche l'accès au cookie via JavaScript  
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' // Protection contre CSRF
    }
}));

const Autoriser = (req, res, next) => {
    if(req.session.username) next()
    else res.redirect('/login')
}

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    let user = await User.findOne({email})
    if(user) return res.redirect('/register')
    
    user = new User({ username, email, password})
    await user.save()
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({email})
        if(!user) return res.redirect('/register')
        req.session.username = user.username
        req.session.email = user.email
        req.session.save();
        res.redirect('/dashboard')
    } catch (error) {
        console.error("Erreur login:", error);
        res.redirect('/login')
    }
});
app.get('/dashboard', Autoriser, async (req, res) => {
    res.render('dashboard', { username: req.session.username })
    console.log(req.session.username);
    console.log(req.session.email);
})

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid'); 
        console.log('Session détruite avec succès');
        res.redirect('/login');
    });
});
app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000')
})
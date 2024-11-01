import express from "express";
import session from "express-session";
import MongoStore from 'connect-mongo';
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import MongoConnexion from "./config/MongoDbConnexion.js";
import authRoutes from "./routes/AuthRoutes.js"; 
import mongoose from "mongoose";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({
    origin: true,
    credentials: true
}));
app.set('view engine', 'ejs');
app.set('views', './views');

MongoConnexion();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    },
    store: MongoStore.create({
        mongoUrl: process.env.SESSION_DB_URI,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60,
        autoRemove: 'native',
        stringify: false
    })
}));
app.use(passport.initialize());
app.use(passport.session());


app.use("/api/auth", authRoutes);

app.get('/', (req,res) => {
    res.json('Coucou')
})

app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});
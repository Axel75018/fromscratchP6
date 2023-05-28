const express = require('express'); 
require('dotenv').config();
const mongoose = require('mongoose'); 
const saucesRoutes = require('./routes/sauce'); // Importation des routes pour les sauces
const userRoutes = require('./routes/user'); // Importation des routes pour les utilisateurs
const bodyParser = require('body-parser'); // Importation du module body-parser pour analyser les corps de requête
const path = require('path'); // Importation du module path pour la gestion des chemins de fichiers
const mongoSanitize = require('express-mongo-sanitize'); //  prévenir les injections dans mongo DB
const helmet = require("helmet"); // couche de protection supplémentaire en ajoutant des en-têtes de sécurité aux requêtes et réponses HTTP en sus de COR

const app = express(); 

// Connexion à MongoDB
const mdbLog = process.env.LOGINMDB;
mongoose.connect(mdbLog,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Configuration CORS (partage de ressources entre serveurs)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permet à toutes les origines d'accéder à l'API ne devrait on pas limiter sur le localhost ?
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Définit les en-têtes autorisés pour les requêtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Définit les méthodes HTTP autorisées
    next();
});

app.use(bodyParser.json()); // Middleware body-parser pour analyser les corps de requête au format JSON

app.use(mongoSanitize()); // Middleware express-mongo-sanitize pour prévenir les injections

app.use(helmet()); // Middleware Helmet pour la sécurité de l'application masque X-Powered-By
//  attaques CSRF (Cross-Site Request Forgery) en ajoutant des jetons CSRF aux formulaires et en vérifiant leur validité lors des requêtes POST.
// Désactivation de la mise en cache du navigateur : Helmet configure les en-têtes de cache pour empêcher le navigateur de mettre en cache les ressources sensibles et ainsi réduire les risques de fuites d'informations.

app.use(helmet.crossOriginResourcePolicy({ policy: 'same-site' })); // Par sécurité cors même site 

app.use('/images', express.static(path.join(__dirname, 'images'))); // Définit un chemin statique pour les images
app.use('/api/sauces', saucesRoutes); // Définit les routes pour les sauces
app.use('/api/auth', userRoutes); // Définit les routes pour les utilisateurs

module.exports = app; // Exporte l'application Express

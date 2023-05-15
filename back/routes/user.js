const express = require('express'); 
const router = express.Router(); // Création d'un routeur Express
const rateLimit = require('express-rate-limit'); //  express-rate-limit pour la prévention des attaques de force brute
const userCtrl = require('../controllers/user'); // Importation du contrôleur pour les utilisateurs

const passLimiter = rateLimit({ // Configuration du rate limiter pour les tentatives de connexion
    windowMs: 30 * 1000, // 30s pour tester l'application, a alonger après
    max: 10 //10 tentatives pour tes a diminuer a près.
});

// Routes pour créer un compte et se connecter
router.post('/signup', userCtrl.signup); // Route pour créer un compte en appelant la fonction signup du contrôleur userCtrl
router.post('/login', passLimiter, userCtrl.login); // Route pour se connecter en appelant la fonction login du contrôleur userCtrl, avec la limite de taux (rate limiter)

module.exports = router; // Exportation du routeur

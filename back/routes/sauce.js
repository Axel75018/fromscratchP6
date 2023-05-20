const express = require('express'); 
const router = express.Router(); // Création d'un routeur Express

const sauceCtrl = require('../controllers/sauce'); // contrôleur pour les sauces
const auth = require('../middleware/auth'); //middleware pour l'authentification
const multer = require('../middleware/multer-config'); // configuration de Multer (gestion des fichiers)

// Routes pour la création, la modification, la suppression et la gestion des likes des sauces
router.post('/', auth, multer, sauceCtrl.createSauce); // Route pour créer une nouvelle sauce (requiert une authentification et utilise le middleware multer pour la gestion des images)
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Route pour modifier une sauce existante (requiert une authentification et utilise le middleware multer pour la gestion des images)
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Route pour supprimer une sauce (requiert une authentification)
router.post('/:id/like', auth, sauceCtrl.likeSauce); // Route pour gérer les likes d'une sauce (requiert une authentification)

// Routes pour récupérer toutes les sauces et une sauce spécifique
router.get('/',auth, sauceCtrl.getAllSauces); // Route pour récupérer toutes les sauces (requiert une authentification)
router.get('/:id',auth, sauceCtrl.getOneSauce); // Route pour récupérer une sauce spécifique (requiert une authentification)

module.exports = router; // Exportation du routeur

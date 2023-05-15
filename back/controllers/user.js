const bcrypt = require('bcrypt'); // Importation du package de chiffrement
const User = require('../schema/user'); // Importation du modèle User
const jwt = require('jsonwebtoken'); // Importation du package pour générer des tokens
const emailValidator = require('email-validator'); // Importation du package de validation d'adresse e-mail
const passwordValidator = require('password-validator'); // Importation du package de validation de mot de passe

const passwordSchema = new passwordValidator(); // Création d'un schéma pour la validation des mots de passe

passwordSchema
  .is().min(8) // Minimum 8 caractères  
  .is().max(50) // Maximum 50 caractères
  .has().uppercase() // Doit contenir des lettres majuscules
  .has().lowercase() // Doit contenir des lettres minuscules
  .has().digits() // Doit contenir au moins 1 chiffre
  

// Inscription d'un utilisateur
exports.signup = (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Veuillez fournir une adresse e-mail et un mot de passe' });
    }
  
    if (!emailValidator.validate(email)) {
      return res.status(400).json({ error: 'Adresse e-mail invalide' });
    }
  
    if (!passwordSchema.validate(password)) {
      return res.status(400).json({ error: 'Le mot de passe ne respecte pas les critères de validation' });
    }
  
    bcrypt.hash(password, 10)
      .then(hash => {
        const user = new User({
          email: email,
          password: hash
        });
  
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
  

// Connexion d'un utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Recherche de l'utilisateur dans la base de données en utilisant l'adresse e-mail
    .then(user => {
      if (!user) { // Si l'utilisateur n'est pas trouvé
        return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrect' });
      }
      bcrypt.compare(req.body.password, user.password) // Comparaison du mot de passe envoyé avec celui stocké dans la base de données
        .then(valid => {
          if (!valid) { // Si les mots de passe ne correspondent pas
            return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrect' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign( // Génération d'un token de session pour l'utilisateur connecté
              { userId: user._id }, //payload
              'RANDOM_TOKEN_SECRET', // Clé secrète utilisée pour signer le token
              // a changer en prod par phrase plus longue et abstraite
              { expiresIn: '24h' } // Durée de validité du token (24 heures dans cet exemple)
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

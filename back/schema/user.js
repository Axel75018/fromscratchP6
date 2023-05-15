const mongoose = require('mongoose'); // Importation du module Mongoose
const uniqueValidator = require('mongoose-unique-validator'); // Importation du module mongoose-unique-validator pour la vérification d'email unique

const userSchema = mongoose.Schema({ // Définition du schéma pour le modèle utilisateur
    email: { type: String, required: true, unique: true }, // Champ email avec contrainte de valeur requise et d'unicité flag pour unique validator
    password: { type: String, required: true } // Champ password avec contrainte de valeur requise
});

userSchema.plugin(uniqueValidator); // Application du plugin mongoose-unique-validator au schéma utilisateur
module.exports = mongoose.model('User', userSchema); // Exportation du modèle User basé sur le schéma utilisateur

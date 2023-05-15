const Sauce = require('../schema/sauce'); // Importation du modèle Sauce
const fs = require('fs'); // Importation du module fs (file system) pour la manipulation des fichiers

// Création, modification, suppression et récupération de sauce

// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // Extraction de l'objet sauce depuis le corps de la requête
    delete sauceObject._id; // Suppression de l'ID pour qu'il soit généré automatiquement par MongoDB lors de l'enregistrement
    const sauce = new Sauce({ // Création d'une nouvelle instance du modèle Sauce
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Construction de l'URL de l'image en utilisant le protocole, le nom d'hôte et le nom du fichier
    });
    sauce.save() // Sauvegarde de la sauce dans la base de données
        .then(() => res.status(201).json({ message: 'Sauce sauvegardée' }))
        .catch(error => res.status(400).json({ error }));
    console.log(sauce);
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? { // Vérification si la modification concerne le fichier ou seulement les données de la sauce
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch(() => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // Recherche de la sauce à supprimer dans la base de données
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // Récupération du nom du fichier image à partir de l'URL
            fs.unlink(`images/${filename}`, () => { // Suppression du fichier image du serveur
                Sauce.deleteOne({ _id: req.params.id }) // Suppression de la sauce de la base de données
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
            });
        });
};

// Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find() // Recherche de toutes les sauces dans la base de données
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Récupération d'une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // Recherche d'une sauce spécifique dans la base de données
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};
// Gestion des likes et dislikes d'une sauce
exports.likeSauce = (req, res, next) => {
    const like = req.body.like; // Récupération de la valeur du like depuis le corps de la requête
    if (like === 1) { // Si l'utilisateur aime la sauce (bouton j'aime)
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Vous aimez cette sauce' }))
            .catch(error => res.status(400).json({ error }));
    } else if (like === -1) { // Si l'utilisateur n'aime pas la sauce (bouton je n'aime pas)
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Vous n’aimez pas cette sauce' }))
            .catch(error => res.status(400).json({ error }));
    } else { // Annulation du like ou du dislike
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.indexOf(req.body.userId) !== -1) { // Si l'utilisateur avait déjà liké la sauce
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Vous n’aimez plus cette sauce' }))
                        .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) { // Si l'utilisateur avait déjà disliké la sauce
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Vous aimerez peut-être cette sauce à nouveau' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
};
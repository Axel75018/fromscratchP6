const Sauce = require('../schema/sauce'); // Importation du modèle Sauce
const fs = require('fs'); // Importation du module fs (file system) pour la manipulation des fichiers

// Création, modification, suppression et récupération de sauce

// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // Extraction de l'objet sauce depuis le corps de la requête
    delete sauceObject._id; // Suppression de l'ID pour récupérer celui de MongoDB lors de l'enregistrement
    // sécurité supprimer sauceOject.userID pour éviter injection
    delete sauceObject._userId; // ne jamais faire confiance au client
    const sauce = new Sauce({ // Création d'une nouvelle instance du modèle Sauce
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Construction de l'URL de l'image 
        //en utilisant le protocole, le nom d'hôte et le nom du fichier
    });
    sauce.save() // Sauvegarde de la sauce dans la base de données
        .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
        .catch(error => res.status(400).json({ error }));
    console.log(sauce);
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? { // Vérification de la présence d'un fichier dans la requête
        ...JSON.parse(req.body.sauce), // spread ... Extraction de l'objet sauce depuis le corps de la requête et parsing en JSON
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Construction de l'URL de l'image en utilisant le protocole, le nom d'hôte et le nom du fichier
    } : { ...req.body }; // Si aucun fichier n'est présent, utiliser le corps de la requête tel quel
    
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // Mise à jour de la sauce dans la base de données
        .then(() => res.status(200).json({ message: 'Sauce modifiée' })) // Envoi d'une réponse JSON en cas de succès
        .catch(() => res.status(400).json({ error })); // Envoi d'une réponse JSON en cas d'erreur
};



// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    delete sauceObject._userId; // ne jamais faire confiance au client
    Sauce.findOne({ _id: req.params.id }) // Recherche de la sauce  utilisant l'ID fourni
        .then(sauce => { // callback  
            
            const filename = sauce.imageUrl.split('/images/')[1]; // Extraction du nom du fichier image à partir de l'URL de l'image dans la sauce
            fs.unlink(`images/${filename}`, () => { // Suppression du fichier image du serveur en utilisant la fonction unlink du module fs. Une fois la suppression terminée, on exécute une fonction de rappel
                Sauce.deleteOne({ _id: req.params.id }) // Suppression de la sauce de la base de données en utilisant l'ID fourni
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' })) 
                    .catch(error => res.status(400).json({ error })); 
            });
        })
        .catch(error => res.status(500).json({ error: 'sauce non trouvée' })); // Si la recherche de la sauce échoue (aucune sauce n'est trouvée avec l'ID fourni), on envoie une réponse JSON avec un code de statut 500 (Erreur interne du serveur) et un message indiquant que la sauce n'a pas été trouvée
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
        // deux arguments : le premier spécifie les critères de recherche deuxième spécifie les modifications à appliquer
            .then(() => res.status(200).json({ message: 'Vous aimez cette sauce' }))
            .catch(error => res.status(400).json({ error }));
    } else if (like === -1) { // Si l'utilisateur n'aime pas la sauce (bouton je n'aime pas)
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Vous n’aimez pas cette sauce' }))
            .catch(error => res.status(400).json({ error }));
    } else { // Annulation du like ou du dislike
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.indexOf(req.body.userId) !== -1) { // Si l'utilisateur déja présent dans les liker
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
const jwt = require('jsonwebtoken'); 

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Récupération du token de la requête entrante à partir des en-têtes
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Vérification du token à l'aide de la clé secrète 'RANDOM_TOKEN_SECRET'
        const userId = decodedToken.userId; // Récupération de l'ID utilisateur extrait du token
        if (req.body.userId && req.body.userId !== userId) { // Comparaison de l'ID utilisateur de la requête avec celui extrait du token
            throw 'User id non valable !'; // Lève une exception si les ID utilisateur ne correspondent pas
        } else {
            next(); 
        }
    } catch (error) {
        res.status(401).json({ error: new Error('Requête non authentifiée !') }); // En cas d'erreur, renvoie une réponse d'erreur avec le statut 401 (Non autorisé)
    }
};

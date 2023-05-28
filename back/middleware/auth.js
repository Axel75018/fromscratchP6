const jwt = require('jsonwebtoken'); 


module.exports = (req, res, next) => {
    try { 
        // Récupération du token de la requête entrante à partir des en-têtes ('Authorization: Bearer TOKEN')
        const token = req.headers.authorization.split(' ')[1];

        // Vérification du token à l'aide de la clé secrète. Si le token est valide, il retourne le payload du token. 
        // Le payload est une partie du token qui contient les informations de l'utilisateur
        const decodedToken = jwt.verify(token, 'M A M E S K G C A L M L D I K L N G B O S H E D J D D D F B B A B F O M A I A K B I S H M _ H N I J A B M _ _ _ C H B C M L D H _ A D _ S H A N F _ K L F S C N O H _ M _ L H A B H N O O E D F E J J M _ _ K D L K E O J G O J O A E H H H O L C L M M A G M K');

        // Récupération de l'ID utilisateur extrait du token. Cet ID est généralement inséré dans le payload lors de la création du token
        const userId = decodedToken.userId; 

        // Comparaison de l'ID utilisateur de la requête avec celui extrait du token
        if (req.body.userId && req.body.userId !== userId) {
            // Lève une exception si les ID utilisateur ne correspondent pas
            throw 'User id non valable !'; 
        } else {
            // Si les IDs correspondent, passe à la prochaine fonction middleware dans la pile d'Express.js
            next(); 
        }
    } catch (error) {
        // En cas d'erreur, renvoie une réponse d'erreur avec le statut 401 (Non autorisé) et un message d'erreur personnalisé
        res.status(401).json({ error: new Error('Requête non authentifiée !') });
    }
};

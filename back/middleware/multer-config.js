const multer = require('multer'); // Importation du module multer pour la gestion des fichiers

const MIME_TYPES = { // Dictionnaire des extensions d'images correspondant aux types MIME
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ // Configuration du stockage des fichiers
    destination: (req, file, callback) => { // Destination des fichiers (répertoire dans lequel ils seront enregistrés)
        callback(null, 'images');
    },
    filename: (req, file, callback) => { // Nom du fichier
        const name = file.originalname.split(' ').join('_'); // Remplacement des espaces dans le nom de fichier par des underscores
        const extension = MIME_TYPES[file.mimetype]; // Récupération de l'extension du fichier à partir du type MIME
        callback(null, name + Date.now() + '.' + extension); // Construction du nom de fichier avec un timestamp pour éviter les doublons
    }
});

module.exports = multer({ storage: storage }).single('image');

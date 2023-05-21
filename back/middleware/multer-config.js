const multer = require('multer'); // Importation du module multer pour la gestion des fichiers

const MIME_TYPES = { // objet Dictionnaire des extensions d'images correspondant aux types MIME
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ // Storage objet configure stockage des fichiers par multer
    // multer fonction diskstorage methode  qui va définir destination et filename
    destination: (req, file, callback) => { // Destination des fichiers (répertoire dans lequel ils seront enregistrés)
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const originalName = file.originalname; // Nom de fichier original
        const extension = MIME_TYPES[file.mimetype]; // Extension du fichier à partir du type MIME
    
        // Supprimer l'extension du nom de fichier
        const fileNameWithoutExtension = originalName.replace(/\.[^.]+$/, '');
    
        // Supprimer les espaces et remplacer par des tirets bas
        const sanitizedFileName = fileNameWithoutExtension.replace(/\s/g, '_');
    
        callback(null, sanitizedFileName + Date.now() + '.' + extension); // Construction du nom de fichier modifié avec un timestamp
    }
    
});

module.exports = multer({ storage: storage }).single('image');

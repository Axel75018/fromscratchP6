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
    filename: (req, file, callback) => { // Nom du fichier
        //split casse la chaine sur les espaces pour en faire un tableau
        // join transforme le tableau en une chaine ou les partie sont jointes par _
        const name = file.originalname.split(' ').join('_'); 
        //name = name.split('.').join('_');
        const extension = MIME_TYPES[file.mimetype]; // Récupération de l'extension du fichier à partir du type MIME
        callback(null, name + Date.now() + '.' + extension); // Construction du nom de fichier avec un timestamp pour éviter les doublons
    }
});

module.exports = multer({ storage: storage }).single('image');

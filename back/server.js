const http = require('http'); // Importation du module http intégré à Node.js
const app = require('./app'); // Importation du module app depuis le fichier app.js

// Fonction pour normaliser le port
const normalizePort = val => {
  const port = parseInt(val, 10); // Conversion de la valeur du port en entier

  if (isNaN(port)) { // Si la valeur n'est pas un nombre
    return val; // Retourne la valeur telle quelle
  }
  if (port >= 0) { // Si la valeur est un nombre positif
    return port; // Retourne le numéro de port
  }
  return false; // Si la valeur est invalide, retourne false
};

const port = normalizePort(process.env.PORT || '3000'); // Obtention du port à utiliser

app.set('port', port); // Définition de la propriété 'port' sur l'objet app

// Fonction de gestion des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') { // Si l'erreur ne concerne pas l'écoute du serveur
    throw error; // Lève l'erreur
  }
  const address = server.address(); // Récupération de l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Construction de la description de l'adresse
  switch (error.code) {
    case 'EACCES': // Erreur d'autorisation
      console.error(bind + ' requires elevated privileges.');
      process.exit(1); // Arrêt du processus avec un code d'erreur
      break;
    case 'EADDRINUSE': // Erreur d'adresse déjà utilisée
      console.error(bind + ' is already in use.');
      process.exit(1); // Arrêt du processus avec un code d'erreur
      break;
    default:
      throw error; // Lève l'erreur
  }
};

const server = http.createServer(app); // Création du serveur HTTP en utilisant l'objet app

server.on('error', errorHandler); // Gestionnaire d'erreur pour les erreurs du serveur

server.on('listening', () => { // Gestionnaire d'événement pour l'écoute du serveur
  const address = server.address(); // Récupération de l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Construction de la description de l'adresse
  console.log('Listening on ' + bind); // Affichage d'un message indiquant sur quel port ou canal le serveur écoute
});

server.listen(port); // Démarrage du serveur et écoute des connexions entrantes sur le port spécifié

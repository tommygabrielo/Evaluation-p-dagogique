const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Configuration de MongoDB
mongoose.connect('mongodb://localhost:27017/evaluation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Affichage d'un message de confirmation de la connexion
mongoose.connection.on('connected', () => {
  console.log('Connecté à la base de données MongoDB');
});

// Middleware pour analyser le corps des requêtes en JSON
app.use(bodyParser.json());

// Schéma MongoDB pour les utilisateurs
const Schema = mongoose.Schema;
const utilisateurSchema = new Schema({
  nom: String,
  prénom: String,
  motDePasse: String,
});

const Utilisateur = mongoose.model('Utilisateurs', utilisateurSchema);

// Routes CRUD pour les utilisateurs
// Création d'un utilisateur
app.post('/api/utilisateurs', async (req, res) => {
  const { nom, prénom, motDePasse } = req.body;
  const utilisateur = new Utilisateur({ nom, prénom, motDePasse });

  try {
    const newUser = await utilisateur.save();
    res.status(201).json(newUser);
    console.log(utilisateur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Récupération de tous les utilisateurs
app.get('/api/utilisateurs', async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mise à jour d'un utilisateur par son ID
app.put('/api/utilisateurs/:id', async (req, res) => {
  const { nom, prénom, motDePasse } = req.body;
  
  try {
    const updatedUser = await Utilisateur.findByIdAndUpdate(req.params.id, 
      { nom, prénom, motDePasse }, 
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Suppression d'un utilisateur par son ID
app.delete('/api/utilisateurs/:id', async (req, res) => {
  try {
    await Utilisateur.findByIdAndRemove(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});

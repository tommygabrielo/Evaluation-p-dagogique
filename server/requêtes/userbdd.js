const User = require('../models/UserModel'); // Importez le modèle d'utilisateur

// Ajouter un nouvel utilisateur
module.exports.addnewuser = (req, res) => {
  // Récupérez les données de la requête
  const { NOM_UTILISATEUR, PRENOM_UTILISATEUR, CONTACT, MOT_DE_PASS, ADMIN, ACTIVE } = req.body;

  // Créez une instance de l'utilisateur avec les données fournies
  const newUser = new User({
    NOM_UTILISATEUR,
    PRENOM_UTILISATEUR,
    CONTACT,
    MOT_DE_PASS,
    ADMIN,
    ACTIVE,
  });

  // Enregistrez l'utilisateur dans la base de données
  newUser.save((err, user) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur :', err);
      res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
    } else {
      console.log('Utilisateur ajouté avec succès :', user);
      res.status(201).json(user);
    }
  });
};

const { classeSchema } = require("../models/ClasseModel");
const usermodel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

//ajouter utilisateur
const addnewuser = async (req, res) => {
    console.log(req.body);
    const data = await usermodel.userSchema(req.body);
    const datasave = await data.save();
    console.log(datasave);
    res.send({ message: "Chargement avec succès" });
};
//recevoir tout les utilisateurs
const getalluser = async (req, res) => {
    const data = await usermodel.userSchema.find({}).populate({
        path: 'classe',
        select: 'NOM_CLASSE'
    })
    res.json(data);
};

const getuserbyId = async (req, res) => {
    try {
        const ID = req.params.ID;

        // Use Mongoose's findOne method to retrieve the user by ID
        const user = await usermodel.userSchema.findOne({ _id: ID });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the user data in the response
        res.status(200).json(user);
    } catch (err) {
        // Handle any errors that may occur during the process
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateuser = async (req, res) => {
    try {
        const ID = req.params.ID;
        const updateData = req.body;

        // Use Mongoose's findOneAndUpdate method to update the user by ID
        const updatedUser = await usermodel.userSchema.findOneAndUpdate({ _id: ID }, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the updated user data in the response
        res.status(200).json(updatedUser);
    } catch (err) {
        // Handle any errors that may occur during the process
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteuser = async (req, res) => {
    try {
        const ID = req.params.ID;
        console.log("ID");
        // Utilisez Mongoose's findOneAndDelete pour supprimer l'utilisateur par ID
        const deletedUser = await usermodel.userSchema.findOneAndDelete({ _id: ID });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Envoyez la réponse indiquant que l'utilisateur a été supprimé
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        // Gérez les erreurs qui peuvent survenir pendant le processus
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const rechercheuser = async (req, res) => {
    try {
        const searchQuery = req.query.query;

        const users = await usermodel.userSchema.find({
            $or: [
                { NOM_UTILISATEUR: { $regex: searchQuery, $options: 'i' } },
                { PRENOM_UTILISATEUR: { $regex: searchQuery, $options: 'i' } },
            ],
        });

        // Ne renvoyez pas d'erreur 404 si aucun utilisateur n'est trouvé
        res.status(200).json(users);
    } catch (err) {
        // Gérez les erreurs qui peuvent survenir pendant le processus
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

// Fonction de connexion d'utilisateur
const loginUser = async (req, res) => {
    try {
        console.log(req.body)
        const { CONTACT, MOT_DE_PASS } = req.body;

        // Vérifier si l'utilisateur existe dans la base de données
        const user = await usermodel.userSchema.findOne({ CONTACT });

        if (!user) {
            return res.status(401).json({ message: "CONTACT d'utilisateur incorrect" });
        }

        // Vérifier si le mot de passe correspond
        if (user.MOT_DE_PASS !== MOT_DE_PASS) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Vérifier si l'utilisateur est actif
        if (!user.ACTIVE) {
            return res.status(403).json({ message: "Compte non activé" });
        }

        // Générer un jeton JWT (JSON Web Token) pour l'authentification
        const token = jwt.sign({ userId: user._id }, "votre_clé_secrète", { expiresIn: "1h" });

        // Répondre avec le jeton
        res.status(200).json({ user });
    } catch (err) {
        // Gérer les erreurs qui peuvent survenir pendant le processus
        res.status(500).json({ message: "Erreur du serveur" });
    }
};



module.exports = {
    addnewuser, getalluser, getuserbyId, updateuser, deleteuser, rechercheuser, loginUser,
};
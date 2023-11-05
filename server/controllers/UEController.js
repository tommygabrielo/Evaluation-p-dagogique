const UEmodel = require("../models/UEModel");
const ClasseModel = require('../models/ClasseModel');

//ajouter utilisateur
const addnewUE = async (req, res) => {
    console.log(req.body);
    const data = await UEmodel.UESchema(req.body);
    const datasave = await data.save();
    console.log(datasave);
    res.send({ message: "Chargement avec succès" });
};
//recevoir tout les utilisateurs
const getallUE = async (req, res) => {
    const data = await UEmodel.UESchema.find({}).populate({
        path: 'classe',
        select: 'NOM_CLASSE parcours', // Sélectionnez les champs de classe que vous souhaitez
        populate: {
            path: 'parcours',
            select: 'NOM_PARCOURS' // Sélectionnez les champs de parcours que vous souhaitez
        }
    });
    res.status(200).json(data);
};

const getUEbyId = async (req, res) => {
    try {
        const ID = req.params.ID;

        // Use Mongoose's findOne method to retrieve the user by ID
        const user = await UEmodel.UESchema.findOne({ _id: ID }).populate('classe', 'NOM_CLASSE NOM_PARCOURS');

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

const updateUE = async (req, res) => {
    try {
        const ID = req.params.ID;
        const updateData = req.body;

        // Use Mongoose's findOneAndUpdate method to update the user by ID
        const updatedUser = await UEmodel.UESchema.findOneAndUpdate({ _id: ID }, updateData, { new: true });

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

const deleteUE = async (req, res) => {
    try {
        const ID = req.params.ID;
        console.log("ID");
        // Utilisez Mongoose's findOneAndDelete pour supprimer l'utilisateur par ID
        const deletedUser = await UEmodel.UESchema.findOneAndDelete({ _id: ID });

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

const rechercheUE = async (req, res) => {
    try {
        const searchQuery = req.query.query;

        const users = await UEmodel.UESchema.find({
            $or: [
                { NOM_UE: { $regex: searchQuery, $options: 'i' } },
            ],
        }).populate('classe', 'NOM_CLASSE NOM_PARCOURS');

        // Ne renvoyez pas d'erreur 404 si aucun utilisateur n'est trouvé
        res.status(200).json(users);
    } catch (err) {
        // Gérez les erreurs qui peuvent survenir pendant le processus
        console.error(err);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

//chargement de UE par classe
const chargerUEparclasse = async (req, res) => {
    try {
        const classeId = req.params.classeId; // Récupérez l'ID de la classe depuis les paramètres de la requête
        console.log(classeId);

        // Utilisez Mongoose's find pour récupérer toutes les unités d'enseignement liées à la classe spécifique
        const ues = await UEmodel.UESchema.find({ classe: classeId });

        if (!ues) {
            return res.status(404).json({ message: 'Aucune unité d\'enseignement trouvée pour cette classe' });
        }

        // Envoyez les données des unités d'enseignement dans la réponse
        res.status(200).json(ues);
    } catch (err) {
        // Gérez toutes les erreurs possibles
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}




module.exports = {
    addnewUE, getallUE, getUEbyId, updateUE, deleteUE, rechercheUE, chargerUEparclasse,
};
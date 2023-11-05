const profmodel = require("../models/ProfModel");

//ajouter utilisateur
const addnewprof = async (req, res) => {
    console.log(req.body);
    const data = await profmodel.profSchema(req.body);
    const datasave = await data.save();
    console.log(datasave);
    res.send({ message: "Chargement avec succès" });
};
//recevoir tout les utilisateurs
const getallprof = async (req, res) => {
    const data = await profmodel.profSchema.find({})
    res.send(JSON.stringify(data))
};

const getprofbyId = async (req, res) => {
    try {
        const ID = req.params.ID;

        // Use Mongoose's findOne method to retrieve the user by ID
        const user = await profmodel.profSchema.findOne({ _id: ID });

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

const updateprof = async (req, res) => {
    try {
        const ID = req.params.ID;
        const updateData = req.body;
        console.log(ID, updateData);
        // Use Mongoose's findOneAndUpdate method to update the user by ID
        const updatedUser = await profmodel.profSchema.findOneAndUpdate({ _id: ID }, updateData, { new: true });

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

const deleteprof = async (req, res) => {
    try {
        const ID = req.params.ID;
        console.log("ID");
        // Utilisez Mongoose's findOneAndDelete pour supprimer l'utilisateur par ID
        const deletedUser = await profmodel.profSchema.findOneAndDelete({ _id: ID });

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

const rechercheprof = async (req, res) => {
    try {
        const searchQuery = req.query.query;

        const users = await profmodel.profSchema.find({
            $or: [
                { NOM_PROFESSEUR: { $regex: searchQuery, $options: 'i' } },
                { PRENOM_PROFESSEUR: { $regex: searchQuery, $options: 'i' } },
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




module.exports = {
    addnewprof, getallprof, getprofbyId, updateprof, deleteprof, rechercheprof,
};
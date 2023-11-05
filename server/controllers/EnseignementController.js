const enseignementmodel = require("../models/EnseignementModel");

//ajouter parcours
const addnewparcours = async (req, res) => {
    console.log(req.body);
    const data = await enseignementmodel.ParcoursSchema(req.body);
    const datasave = await data.save();
    console.log(datasave);
    res.send({ message: "Chargement avec succès" });
};

//recevoir tout les parcours
const getallparcours = async (req, res) => {
    const data = await enseignementmodel.ParcoursSchema.find({});
    res.send(JSON.stringify(data))
};

const getparcoursbyId = async (req, res) => {
    try {
        const ID = req.params.ID;

        // Use Mongoose's findOne method to retrieve the user by ID
        const user = await enseignementmodel.ParcoursSchema.findOne({ _id: ID });

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

const updateparcours = async (req, res) => {
    try {
        const ID = req.params.ID;
        const updateData = req.body;

        // Use Mongoose's findOneAndUpdate method to update the user by ID
        const updatedUser = await enseignementmodel.ParcoursSchema.findOneAndUpdate({ _id: ID }, updateData, { new: true });

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

const deleteparcours = async (req, res) => {
    try {
        const ID = req.params.ID;
        console.log("ID");
        // Utilisez Mongoose's findOneAndDelete pour supprimer l'utilisateur par ID
        const deletedUser = await enseignementmodel.ParcoursSchema.findOneAndDelete({ _id: ID });

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

const rechercheparcours = async (req, res) => {
    try {
        const searchQuery = req.query.query;

        const users = await enseignementmodel.ParcoursSchema.find({
            $or: [
                { NOM_PARCOURS: { $regex: searchQuery, $options: 'i' } },
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
    addnewparcours, getallparcours, getparcoursbyId, updateparcours, deleteparcours, rechercheparcours,
};
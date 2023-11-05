const mongoose = require("mongoose");
const { ElementSchema } = require("./ElementModel");
const { ContenuSchema } = require("./ContenuModel");

const FicheSchema = mongoose.model('fiche', new mongoose.Schema({
    element: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ElementSchema, // Référence au modèle de la collection "classe"
    },
    contenu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ContenuSchema, // Référence au modèle de la collection "classe"
    },
    date: {
        type: Date, // Vous pouvez utiliser le type Date pour les heures de début
        required: true, // Spécifiez si c'est requis selon vos besoins
    },
    HeureDebut: {
        type: Date, // Vous pouvez utiliser le type Date pour les heures de début
        required: true, // Spécifiez si c'est requis selon vos besoins
    },
    HeureFin: {
        type: Date, // Vous pouvez utiliser le type Date pour les heures de fin
        required: true, // Spécifiez si c'est requis selon vos besoins
    }
}));


// Exportation des models
module.exports =
{
    FicheSchema
};
const mongoose = require("mongoose");
const { classeSchema } = require("./ClasseModel");


const UESchema = mongoose.model('uniteEnseignement', new mongoose.Schema({
  NOM_UE: String,
 classe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: classeSchema, // Référence au modèle de la collection "classe"
 }
}));


// Exportation des models
module.exports =
{
  UESchema
};
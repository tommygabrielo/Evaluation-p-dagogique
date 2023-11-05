const mongoose = require("mongoose");
const { ParcoursSchema } = require("./EnseignementModel");

const classeSchema = mongoose.model('classe', new mongoose.Schema({
  NOM_CLASSE: String,
  ANNEE_UNIVERSITAIRE: String,
  parcours: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ParcoursSchema, // Référence au modèle de la collection "classe"
 }
}));



// Exportation des models
module.exports =
{
  classeSchema
};
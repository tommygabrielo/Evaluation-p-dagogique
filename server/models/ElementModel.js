const mongoose = require("mongoose");
const { profSchema } = require("./ProfModel");
const { UESchema } = require("./UEModel");


const ElementSchema = mongoose.model('element', new mongoose.Schema({
  NOM_ELEMENT: String,
  HEURE: String,
 UE: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UESchema, // Référence au modèle de la collection "classe"
 },
 PROFESSEUR: {
    type: mongoose.Schema.Types.ObjectId,
    ref: profSchema,
 }
}));


// Exportation des models
module.exports =
{
  ElementSchema
};
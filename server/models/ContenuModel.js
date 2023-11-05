const mongoose = require("mongoose");
const { ElementSchema } = require("./ElementModel");


const ContenuSchema = mongoose.model('contenu', new mongoose.Schema({
  NOM_CONTENU: String,
  FINI: Boolean,
  ELEMENT: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ElementSchema, // Référence au modèle de la collection "classe"
  },
}));


// Exportation des models
module.exports =
{
  ContenuSchema
};
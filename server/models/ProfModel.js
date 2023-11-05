const mongoose = require("mongoose");


const profSchema = mongoose.model('professeur', new mongoose.Schema({
  NOM_PROFESSEUR: String,
  PRENOM_PROFESSEUR: String,
  TITRE: String,
}));

// Exportation des models
module.exports =
{
  profSchema
};
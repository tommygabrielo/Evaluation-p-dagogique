const mongoose = require("mongoose");


const ParcoursSchema = mongoose.model('parcours', new mongoose.Schema({
  NOM_PARCOURS: String,
}));



// Exportation des models
module.exports =
{
  ParcoursSchema
};
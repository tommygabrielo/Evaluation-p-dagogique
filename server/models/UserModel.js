const mongoose = require("mongoose");
const { classeSchema } = require("./ClasseModel");

const userSchema = mongoose.model('users', new mongoose.Schema({
  NOM_UTILISATEUR: String,
  PRENOM_UTILISATEUR: String,
  CONTACT: String,
  MOT_DE_PASS: String,
  ADMIN: String,
  ACTIVE: Boolean,
  classe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: classeSchema, // Référence au modèle de la collection "classe"
    //required: false,
  }
}));



// Exportation des models
module.exports =
{
  userSchema
};
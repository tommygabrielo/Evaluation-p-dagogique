const FicheModel = require("../models/FicheModel");
const ElementModel = require('../models/ElementModel');
const ContenuModel = require('../models/ContenuModel')
const ProfesseurModel = require('../models/ProfModel');
const ClasseModel = require('../models/ClasseModel');


//chargement de UE par classe
const chargerUEparclasse = async (req, res) => {
  try {
    const classeId = req.params.ID; // Récupérez l'ID de la classe depuis les paramètres de la requête
    console.log(classeId);

    // Utilisez le modèle ElementModel pour rechercher les éléments (UE) liés à une classe spécifique
    const elements = await ElementModel.ElementSchema.find({})
      .populate({
        path: 'UE',
        match: { $and: [{ classe: classeId }] }, // Filtrer les UE par classe
      });
    const elementsFiltres = elements.filter(element => element.UE);

    if (!elements || elements.length === 0) {
      return res.status(404).json({ message: 'Aucun élément trouvé pour cette classe' });
    }

    res.status(200).json(elementsFiltres);
  } catch (err) {
    // Gérez toutes les erreurs possibles
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

//chargement de Contenu par element
const getContenuParElement = async (req, res) => {
  try {
    const ElementId = req.params.ElementId; // Récupérez l'ID de la classe depuis les paramètres de la requête
    console.log(ElementId);

    // Utilisez Mongoose's find pour récupérer toutes les unités d'enseignement liées à la classe spécifique
    const ues = await ContenuModel.ContenuSchema.find({ ELEMENT: ElementId });

    if (!ues) {
      return res.status(404).json({ message: 'Aucune unité d\'enseignement trouvée pour cette classe' });
    }

    // Envoyez les données des unités d'enseignement dans la réponse
    res.status(200).json(ues);
  } catch (err) {
    // Gérez toutes les erreurs possibles
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

//ajouter Fiche
const addnewFiche = async (req, res) => {
  console.log(req.body.contenu);
  const data = await FicheModel.FicheSchema(req.body);
  
  const datasave = await data.save();

  // Mettez à jour la valeur de l'attribut FINI dans la collection contenu en true
  await ContenuModel.ContenuSchema.updateOne({ _id: req.body.contenu }, { FINI: true });

  res.send({ message: "Chargement avec succès" });
};


//recevoir Fiche
const getallFiche = async (req, res) => {
  const classeID = req.params.ID
  
  const fiches = await FicheModel.FicheSchema
    .find()
    .populate({
      path: 'element',
      model: 'element', // Le modèle de la collection Element
      select: 'NOM_ELEMENT UE PROFESSEUR',
      populate: {
        path: 'PROFESSEUR',
        select: 'PRENOM_PROFESSEUR'
      },
      populate: {
        path: 'UE',
        select: 'NOM_UE classe',
        populate: {
          path: 'classe',
          select: '_id'
        }
      }
    })
    .populate({
      path: 'contenu',
      model: 'contenu', // Le modèle de la collection Contenu
      select: 'NOM_CONTENU',
    })
    .exec();

  if (!fiches) {
    return res.status(404).json({ message: 'Aucune fiche trouvée.' });
  }

  // Filtrer les fiches en fonction de la classeID
  const fichesFiltrees = fiches.filter((fiche) => {
    // Assurez-vous que la propriété "UE" est définie
    if (fiche.element && fiche.element.UE) {
      // Vérifiez si l'ID de la classe correspond à classeID
      return fiche.element.UE.classe._id.toString() === classeID;
    }
    return false;
  });

  // Triez les fiches par date la plus récente
  fichesFiltrees.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Récupérez les noms des professeurs
  const professeursIds = fichesFiltrees.map(fiche => fiche.element.PROFESSEUR);
  const professeurs = await ProfesseurModel.profSchema.find({ _id: { $in: professeursIds } }, 'NOM_PROFESSEUR PRENOM_PROFESSEUR');

  // Créez une réponse JSON propre
  const response = fichesFiltrees.map(fiche => {
    const professeur = professeurs.find(p => p._id.equals(fiche.element.PROFESSEUR));
    return {
        _id: fiche._id,
        NOM_ELEMENT: fiche.element.NOM_ELEMENT,
        NOM_CONTENU: fiche.contenu.NOM_CONTENU,
        date: fiche.date,
        HeureDebut: fiche.HeureDebut,
        HeureFin: fiche.HeureFin,
        NOM_PROFESSEUR: professeur.NOM_PROFESSEUR,
        PRENOM_PROFESSEUR: professeur.PRENOM_PROFESSEUR
    };
});

res.status(200).json(response);

};

const filtreFiche = async (req, res) => {
  const classeID = req.params.ID;
  const filterDate = req.query.date; // Récupérez la date depuis la requête

  try {
    let fiches = await FicheModel.FicheSchema
      .find()
      .populate({
        path: 'element',
        model: 'element', // Le modèle de la collection Element
        select: 'NOM_ELEMENT UE PROFESSEUR',
        populate: {
          path: 'PROFESSEUR',
          select: 'PRENOM_PROFESSEUR'
        },
        populate: {
          path: 'UE',
          select: 'NOM_UE classe',
          populate: {
            path: 'classe',
            select: '_id'
          }
        }
      })
      .populate({
        path: 'contenu',
        model: 'contenu', // Le modèle de la collection Contenu
        select: 'NOM_CONTENU',
      })
      .exec();

    if (!fiches) {
      return res.status(404).json({ message: 'Aucune fiche trouvée.' });
    }

    // Filtrer les fiches en fonction de la classeID
    fiches = fiches.filter((fiche) => {
      if (fiche.element && fiche.element.UE) {
        return fiche.element.UE.classe._id.toString() === classeID;
      }
      return false;
    });


   // Filtrer les fiches en fonction de la date "2023-10-26T00:00:00.000Z"
fiches = fiches.filter((fiche) => {
  return fiche.date.toISOString() === filterDate;
});

    fiches.sort((a, b) => new Date(b.date) - new Date(a.date));

    const professeursIds = fiches.map(fiche => fiche.element.PROFESSEUR);
    const professeurs = await ProfesseurModel.profSchema.find({ _id: { $in: professeursIds } }, 'NOM_PROFESSEUR PRENOM_PROFESSEUR');

    const response = fiches.map(fiche => {
      const professeur = professeurs.find(p => p._id.equals(fiche.element.PROFESSEUR));
      return {
          _id: fiche._id,
          NOM_ELEMENT: fiche.element.NOM_ELEMENT,
          NOM_CONTENU: fiche.contenu.NOM_CONTENU,
          date: fiche.date,
          HeureDebut: fiche.HeureDebut,
          HeureFin: fiche.HeureFin,
          NOM_PROFESSEUR: professeur.NOM_PROFESSEUR,
          PRENOM_PROFESSEUR: professeur.PRENOM_PROFESSEUR
      };
    });

    res.status(200).json(response);
  } catch (err) {
    // Gérez les erreurs qui peuvent survenir pendant le processus
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};


module.exports = {
  chargerUEparclasse, getContenuParElement, addnewFiche, getallFiche, filtreFiche,
};
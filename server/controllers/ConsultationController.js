const EnseignementModel = require('../models/EnseignementModel');
const ClasseModel = require('../models/ClasseModel');
const ContenuModel = require('../models/ContenuModel');
const ElementModel = require('../models/ElementModel');
const FicheModel = require('../models/FicheModel');
const ProfModel = require('../models/ProfModel');
const UEModel = require('../models/UEModel');

//chargement de Contenu par element
const loadElementparUE = async (req, res) => {

    const ueid = req.params.UEId; // Récupérez l'ID de la classe depuis les paramètres de la requête
    console.log(ueid);

    // Utilisez Mongoose's find pour récupérer toutes les unités d'enseignement liées à la classe spécifique
    const ues = await ElementModel.ElementSchema.find({ UE: ueid });

    if (!ues) {
        return res.status(404).json({ message: 'Aucune unité d\'enseignement trouvée pour cette classe' });
    }

    // Envoyez les données des unités d'enseignement dans la réponse
    res.status(200).json(ues);

}


//recevoir Fiche
const consultation = async (req, res) => {
    const { CLASSE, UE, ELEMENT } = req.body
    console.log(CLASSE, UE, ELEMENT);
    try {
       
        // Recherchez la classe par son nom (ou un autre critère)
        const classe = await ClasseModel.classeSchema.findOne({ _id: CLASSE });
        if (!classe) {
            return res.status(404).json({ message: 'Classe non trouvée' });
        }

        const parcours = await EnseignementModel.ParcoursSchema.findOne({ _id: classe.parcours });
        if (!parcours) {
            return res.status(404).json({ message: 'parcours non trouvée' });
        }


        // Recherchez l'unité d'enseignement (UE) par son nom (ou un autre critère)
        const ue = await UEModel.UESchema.findOne({ _id: UE });
        if (!ue) {
            return res.status(404).json({ message: 'UE non trouvée' });
        }

        // Recherchez l'élément par son nom (ou un autre critère)
        const element = await ElementModel.ElementSchema.findOne({ _id: ELEMENT });
        if (!element) {
            return res.status(404).json({ message: 'Élément non trouvé' });
        }

         // Recherchez le professeur associé à l'élément
         const professeur = await ProfModel.profSchema.findOne({ _id: element.PROFESSEUR });

        // Maintenant que vous avez trouvé la classe, l'UE et l'élément,
        // vous pouvez rechercher les contenus associés
        const contenus = await ContenuModel.ContenuSchema.find({ ELEMENT: element._id });
        contenus.sort((a, b) => (a.FINI === b.FINI ? 0 : a.FINI ? -1 : 1));
        if (!contenus || contenus.length === 0) {
            return res.status(404).json({ message: 'Aucun contenu trouvé pour cet élément' });
        }

        // Compter le nombre de contenus finis
        const countContenusFini = await ContenuModel.ContenuSchema.countDocuments({
            ELEMENT: element._id,
            FINI: true
        });

        // Compter le nombre de contenus non finis
        const countContenusNonFini = await ContenuModel.ContenuSchema.countDocuments({
            ELEMENT: element._id,
            FINI: false
        });

        const fiches = await FicheModel.FicheSchema.find({ element: element._id })
        .select('HeureDebut HeureFin'); // Sélectionnez seulement les champs HeureDebut et HeureFin

    if (!fiches || fiches.length === 0) {
        return res.status(404).json({ message: 'Aucune fiche trouvée pour cet élément' });
    }

    // Calculer la durée totale des contenus associés en heures et minutes
    let dureeTotaleHeures = 0;
    let dureeTotaleMinutes = 0;

    for (const fiche of fiches) {
        const heureDebut = fiche.HeureDebut.getTime(); // Convertir en millisecondes
        const heureFin = fiche.HeureFin.getTime(); // Convertir en millisecondes

        // Calculer la différence en millisecondes
        const difference = heureFin - heureDebut;

        // Ajouter la différence à la durée totale
        dureeTotaleHeures += Math.floor(difference / (1000 * 60 * 60)); // Heures
        dureeTotaleMinutes += Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)); // Minutes
    }

    // Gérer le report des minutes en heures si nécessaire
    dureeTotaleHeures += Math.floor(dureeTotaleMinutes / 60);
    dureeTotaleMinutes = dureeTotaleMinutes % 60;
      

        const result = {
            Parcours: parcours.NOM_PARCOURS,
            Classe: classe.NOM_CLASSE,
            UE: ue.NOM_UE,
            ELEMENT: element.NOM_ELEMENT,
            Professeur: `${professeur.NOM_PROFESSEUR} ${professeur.PRENOM_PROFESSEUR}`,
            CountContenusFini: countContenusFini,
            CountContenusNonFini: countContenusNonFini,
            DureeH: `${dureeTotaleHeures}`,
            DureeM: ` ${dureeTotaleMinutes}`,
            DureeTotale: element.HEURE,
            Contenus: contenus
        };

        // Envoyez les données des contenus dans la réponse
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la recherche des données' });
    }



};

module.exports = {
    loadElementparUE, consultation,
};
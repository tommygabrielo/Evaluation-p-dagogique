const express = require('express');
const usercontroller=require("../controllers/UserController");
const enseignementcontroller=require("../controllers/EnseignementController");
const classecontroller=require("../controllers/ClasseController");
const profcontroller=require("../controllers/ProfController");
const UEcontroller=require("../controllers/UEController");
const Elementcontroller=require("../controllers/ElementController");
const Contenucontroller=require("../controllers/ContenuController");
const Fichecontroller=require("../controllers/FicheController");
const Consultationcontroller=require("../controllers/ConsultationController");

const router = express.Router();

router.get("/", (req, res, next) => {
    res.json({ message: "kaiza" });
});

// Login
router.post("/login",usercontroller.loginUser);

//utilisateur
router.get("/alluser",usercontroller.getalluser);
router.post("/adduser",usercontroller.addnewuser);
router.post("/deleteuser/:ID",usercontroller.deleteuser);
router.get("/selectuser/:ID",usercontroller.getuserbyId);
router.put("/updateuser/:ID",usercontroller.updateuser);
router.get("/rechercheUser",usercontroller.rechercheuser);

//Enseignement
router.get("/allparcours",enseignementcontroller.getallparcours);
router.post("/addparcours",enseignementcontroller.addnewparcours);
router.get("/selectparcours/:ID",enseignementcontroller.getparcoursbyId);
router.put("/updateparcours/:ID",enseignementcontroller.updateparcours);
router.post("/deleteparcours/:ID",enseignementcontroller.deleteparcours);
router.get("/rechercheParcours",enseignementcontroller.rechercheparcours);

//Classe
router.post("/addclasse",classecontroller.addnewclasse);
router.get("/allclasse",classecontroller.getallclasse);
router.get("/selectclasse/:ID",classecontroller.getclassebyId);
router.post("/deleteclasse/:ID",classecontroller.deleteclasse);
router.get("/rechercheClasse",classecontroller.rechercheclasse);

//Professeur
router.get("/allprof",profcontroller.getallprof);
router.post("/addprof",profcontroller.addnewprof);
router.get("/selectprof/:ID",profcontroller.getprofbyId);
router.put("/updateprof/:ID",profcontroller.updateprof);
router.post("/deleteprof/:ID",profcontroller.deleteprof);
router.get("/rechercheProf",profcontroller.rechercheprof);

//Unite d'enseignement
router.get("/allUE",UEcontroller.getallUE);
router.post("/addUE",UEcontroller.addnewUE);
router.get("/selectUE/:ID",UEcontroller.getUEbyId);
router.put("/updateUE/:ID",UEcontroller.updateUE);
router.post("/deleteUE/:ID",UEcontroller.deleteUE);
router.get("/rechercheUE",UEcontroller.rechercheUE);

//Element
router.get("/unitesEnseignement/:classeId",UEcontroller.chargerUEparclasse);
router.get("/allElement",Elementcontroller.getallElement);
router.post("/addElement",Elementcontroller.addnewElement);
router.get("/selectElement/:ID",Elementcontroller.getElementbyId);
// router.put("/updateUE/:ID",UEcontroller.updateUE);
// router.post("/deleteUE/:ID",UEcontroller.deleteUE);
// router.get("/rechercheUE",UEcontroller.rechercheUE);

//Contenu
// router.get("/allContenu",UEcontroller.getallUE);
router.post("/addContenu",Contenucontroller.addnewContenu);
router.get("/selectContenu/:ID",Contenucontroller.getContenubyId);
// router.put("/updateUE/:ID",UEcontroller.updateUE);
// router.post("/deleteUE/:ID",UEcontroller.deleteUE);
// router.get("/rechercheUE",UEcontroller.rechercheUE);

//fiche
router.get("/selectElementParClasse/:ID",Fichecontroller.chargerUEparclasse);
router.get("/getContenuParElement/:ElementId",Fichecontroller.getContenuParElement)
router.post("/addFiche",Fichecontroller.addnewFiche);
router.get("/allFiche/:ID",Fichecontroller.getallFiche);
router.get("/filtreFiche/:ID",Fichecontroller.filtreFiche);

//consultation
router.get("/loadElementparUE/:UEId",Consultationcontroller.loadElementparUE)
router.post("/consultation",Consultationcontroller.consultation)
module.exports = router;

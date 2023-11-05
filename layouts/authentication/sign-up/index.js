// react-router-dom components
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/auth.png";
import BasicLayout from "../components/BasicLayout";

function Cover() {
  useEffect(() => {
    loadClasse();
  }, []);

  const [classe, setSlasse] = useState([]);

  const loadClasse = async () => {
    const response = await axios.get("http://localhost:5000/allclasse");
    setSlasse(response.data);
  };

  const options = [
    { value: "Etudiant", label: "Etudiant" },
    { value: "Administrateur", label: "Administrateur" },
  ];

  const [NOM_UTILISATEUR, setNOM_UTILISATEUR] = useState("");
  const [PRENOM_UTILISATEUR, setPRENOM_UTILISATEUR] = useState("");
  const [MOT_DE_PASS, setMOT_DE_PASS] = useState("");
  const [CONTACT, setCONTACT] = useState("");
  let [ACTIVE, setACTIVE] = useState("");
  const [ADMIN, setADMIN] = useState("");

  const [showClasseSelect, setShowClasseSelect] = useState(false);
  const classeOptions = classe.map((classeItem) => ({
    value: classeItem._id,
    label: classeItem.NOM_CLASSE + ' ' + classeItem.parcours.NOM_PARCOURS,
  }));

  const [selectedClasse, setSelectedClasse] = useState("");
  const handleChangeClasse = (selectedOption) => {
    setSelectedClasse(selectedOption);
  };

  useEffect(() => {
    if (ADMIN === "Etudiant") {
      setShowClasseSelect(true);
    } else {
      setShowClasseSelect(false);
    }
  }, [ADMIN]);

  const addUtilisateur = (event) => {
    event.preventDefault();
    if (
      NOM_UTILISATEUR === "" ||
      PRENOM_UTILISATEUR === "" ||
      CONTACT === "" ||
      MOT_DE_PASS === "" ||
      ADMIN === ""
    ) {
      alert("Tous les champs sont obligatoires");
    } else if (MOT_DE_PASS.length < 6) {
      alert("Le mot de passe doit avoir au moins 6 caractères");
    } else {
      if (!ACTIVE) {
        ACTIVE = false;
      }
      const message = `NOM_UTILISATEUR: ${NOM_UTILISATEUR}\nPRENOM_UTILISATEUR: ${PRENOM_UTILISATEUR}\nCONTACT: ${CONTACT}\nMOT_DE_PASS: ${MOT_DE_PASS}\nADMIN: ${ADMIN}\nACTIVE: ${ACTIVE}n\Classe: ${selectedClasse.value}`;
      alert(message);
      axios
        .post("http://localhost:5000/adduser", {
          NOM_UTILISATEUR: NOM_UTILISATEUR,
          PRENOM_UTILISATEUR: PRENOM_UTILISATEUR,
          MOT_DE_PASS: MOT_DE_PASS,
          CONTACT: CONTACT,
          ADMIN: ADMIN,
          ACTIVE: ACTIVE,
          classe: selectedClasse.value,
        })
        .then(() => {
          setNOM_UTILISATEUR("");
          setPRENOM_UTILISATEUR("");
          setMOT_DE_PASS("");
          setCONTACT("");
          setADMIN("");
          setACTIVE("");
        });
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={0}>
            Inscription
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="text" label="Nom" variant="standard" fullWidth value={NOM_UTILISATEUR}
                          onChange={(event) => {
                            setNOM_UTILISATEUR(event.target.value);
                          }} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="Prénom" variant="standard" fullWidth  value={PRENOM_UTILISATEUR}
                          onChange={(event) => {
                            setPRENOM_UTILISATEUR(event.target.value);
                          }} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="Contact" variant="standard" fullWidth  value={CONTACT}
                          onChange={(event) => {
                            setCONTACT(event.target.value);
                          }} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Mot de passe" variant="standard" fullWidth    value={MOT_DE_PASS}
                          onChange={(event) => {
                            setMOT_DE_PASS(event.target.value);
                          }}/>
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="h6" fontWeight="light" sx={{ marginBottom: "10px" }}>
                Type d'utilisateur
              </MDTypography>
              <Select
                options={options}
                placeholder="Sélectionnez une option"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontSize: "15px",
                  }),
                  placeholder: (provided, state) => ({
                    ...provided,
                    fontSize: "15px",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    fontSize: "14px",
                  }),
                }}
                onChange={(selectedOption) => setADMIN(selectedOption.value)}

              />
            </MDBox>
            {showClasseSelect && (
              <MDBox mb={2}>
                <Select
                  // Définissez les options pour la classe de l'étudiant
                  value={selectedClasse}
                  options={classeOptions}
                  placeholder="Sélectionnez une classe"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      fontSize: "15px",
                    }),
                    placeholder: (provided, state) => ({
                      ...provided,
                      fontSize: "15px",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      fontSize: "14px",
                    }),
                  }}

                  onChange={handleChangeClasse}
                />
              </MDBox>
            )}


            <MDBox mt={4} mb={1}>
              <MDButton onClick={addUtilisateur} variant="gradient" color="info" fullWidth>
                S'inscrire
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Déja avoir un compte{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Se connecter
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Cover;

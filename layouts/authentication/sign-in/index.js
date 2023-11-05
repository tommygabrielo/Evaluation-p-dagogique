
import { useState } from "react";
import Axios from "axios";
// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/auth.png";

function Basic() {
  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Erreur"
      content="Champ Contact ou Mot de passe vide"
      dateTime=""
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const [rememberMe, setRememberMe] = useState(false);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  let history = useNavigate();
  const [user, setUser] = useState(null)
  const [body, setBody] = useState({ CONTACT: "", MOT_DE_PASS: "" });
  const inputChange = ({ target }) => {
    const { name, value } = target;
    setBody({
      ...body,
      [name]: value,
    });
  };

  const connexion = () => {
    if (body.CONTACT === "" || body.MOT_DE_PASS === "") {
      openErrorSB();
      // toast.warn("champ vide");
    } else {
      Axios.post(`http://localhost:5000/login`, body)
        .then(function (response) {
          if (response.status === 200) {
            const userData = response.data.user;
            if (userData) {
              console.log(`Bienvenue, ${userData.NOM_UTILISATEUR} ${userData.ADMIN}!`);
              // Passer le nom et l'ID de l'utilisateur dans l'URL lors de la navigation
              localStorage.setItem("nom", userData.PRENOM_UTILISATEUR);
              localStorage.setItem("id", userData._id);
              // Vérifier si "classe" existe dans userData
              if (userData.classe) {
                localStorage.setItem("classe", userData.classe);
              } else {
                // Stocker un tableau vide si "classe" est introuvable
                localStorage.setItem("classe", "");
              }
              localStorage.setItem("type", userData.ADMIN);
              // if (userData.ADMIN === "Administrateur") {
              //   history(`/Consultation`);
              // } else {
                history(`/utilisateurs`)
             // }

            }
            // window.location.reload(false);
          }
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.status === 401) {
              window.alert("Identifiants incorrects");
            } else if (error.response.status === 403) {
              window.alert("Compte non activé");
            } else {
              window.alert("Erreur inattendue lors de la connexion");
            }
          } else {
            window.alert("Une erreur s'est produite lors de la connexion");
          }
        });
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        {renderErrorSB}
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={0}>
            Authentification
          </MDTypography>
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                name="CONTACT"
                type="text"
                label="Contact"
                fullWidth
                value={body.CONTACT}
                onChange={inputChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                name="MOT_DE_PASS"
                type="password"
                label="Mot·de·passe"
                fullWidth
                value={body.MOT_DE_PASS}
                onChange={inputChange}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Se souvenir
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={connexion}>
                Se connecter
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  S&apos;inscrire
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;

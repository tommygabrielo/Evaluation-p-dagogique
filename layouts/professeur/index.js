import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAvatar from "components/MDAvatar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import team2 from "assets/images/team-2.jpg";
import MDBadge from "components/MDBadge";
import AlertFunctions from "../../alert"
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

function Professeur() {
  useEffect(() => {
    loadProfesseur();
  }, []);

  //Afichage données
  const [userData, setUserData] = useState([]);

  const loadProfesseur = async () => {
    const response = await axios.get("http://localhost:5000/allprof");
    setUserData(response.data);
  };

  //Ajout

  const [staticModal, setStaticModal] = useState(false);
  const toggleShow = () => setStaticModal(!staticModal);


  const [NOM_PROFESSEUR, setNOM_PROFESSEUR] = useState("");
  const [PRENOM_PROFESSEUR, setPRENOM_PROFESSEUR] = useState("");
  const [TITRE, setTITRE] = useState("");
 
  const addProfesseur = (event) => {
    event.preventDefault();
    if (
      NOM_PROFESSEUR === "" ||
      PRENOM_PROFESSEUR === "" ||
      TITRE === ""
    ) {
      alert("Tous les champs sont obligatoires");
    } else {
      const message = `NOM: ${NOM_PROFESSEUR}\nPRENOM: ${PRENOM_PROFESSEUR}\nTITRE: ${TITRE}`;
      alert(message);
      axios
        .post("http://localhost:5000/addprof", {
          NOM_PROFESSEUR: NOM_PROFESSEUR,
          PRENOM_PROFESSEUR: PRENOM_PROFESSEUR,
          TITRE: TITRE,
        })
        .then(() => {
          setNOM_PROFESSEUR("");
          setPRENOM_PROFESSEUR("");
          setTITRE("");
          toggleShow();
          loadProfesseur();
          AlertFunctions.Alert();
        });
    }
  };

  //Get by Id 
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const toggleEditModal = () => {
    setEditModalOpen(!isEditModalOpen);
  };

  const [editUserData, setEditUserData] = useState(null);

  const fetchUserData = (_id) => {
    axios
      .get(`http://localhost:5000/selectprof/${_id}`)
      .then((response) => {
        const userData = response.data;
        console.log("Fetched user data:", userData);

        if (userData && userData.NOM_PROFESSEUR) {
          setEditUserData(userData);
          toggleEditModal();
        } else {
          console.error("Fetched data is missing NOM_UTILISATEUR or is invalid.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  const handleSaveUserData = () => { };
  //Suppression
  const deleteProf = async (ID) => {
    if (window.confirm("Souhaitez-vous vraiment le supprimer ?")) {
      await axios.post(`http://localhost:5000/deleteprof/${ID}`).then(function (response) {
        loadProfesseur();
      });
    }
  };

 
  //table affichage
  const columns = [
    { Header: "Nom", accessor: "Nom" },
    { Header: "Titre", accessor: "Titre" },
    { Header: "Action", accessor: "Action" },
  ];

  const Author = ({ image, name, prenom }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {prenom}
        </MDTypography>
        <MDTypography variant="caption">{name}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const rows = userData.map((user) => ({
    Nom: <Author name={user.NOM_PROFESSEUR} prenom={user.PRENOM_PROFESSEUR} />,
    Titre: user.TITRE,
    Action: (
      <div>
        {user.NOM_PROFESSEUR && (
          <Icon size="lg" style={{ cursor: "pointer" }} onClick={() => fetchUserData(user._id)}>
            edit
          </Icon>
        )}
        <Icon size="lg" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => deleteProf(user._id)}>
          delete
        </Icon>
      </div>
    ),
  }));

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  //update

  const [staticModalUpdate, setStaticModalUpdate] = useState(false);
  const toggleShowUpdate = () => {
    setStaticModalUpdate(!staticModalUpdate);
    setUser(null);
  };
  const [user, setUser] = useState(null);

  const EditUtilisateur = ({ isOpen, user, onSave, onClose }) => {
    const [editedUser, setEditedUser] = useState(user);

    const handleOnChange = (e) => {
      const { name, value } = e.target;
      setEditedUser((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    useEffect(() => {
      console.log("Edited User Data:", editedUser);
      console.log("NOM_PROFESSEUR", editedUser.NOM_PROFESSEUR);
    }, [editedUser]);

    const toggleClose = () => {
      onClose();
    };

    const handleUpdateProf = async () => {
      try {
        const response = await axios.put(`http://localhost:5000/updateprof/${editedUser._id}`, editedUser);

        if (response.status === 200) {
          onSave(response.data);
          onClose();
          loadProfesseur();
        } else {
          console.error("Error updating user");
        }
      } catch (error) {
        console.error("Network or server error:", error);
      }
    };

    return (
      <MDBModal staticBackdrop tabIndex="-1" show={isOpen} setShow={setEditModalOpen}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <Card>
              <MDBModalHeader>
                <MDTypography variant="h6" fontWeight="medium">
                  Modification des informations
                </MDTypography>
              </MDBModalHeader>
              <MDBModalBody>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDBox mb={2}>
                      <MDInput
                        name="NOM_PROFESSEUR"
                        type="text"
                        label="Nom"
                        fullWidth
                        value={editedUser.NOM_PROFESSEUR}
                        onChange={handleOnChange}
                      />
                    </MDBox>
                    <MDBox mb={2}>
                      <MDInput
                        name="PRENOM_PROFESSEUR"
                        type="text"
                        label="Prénom"
                        fullWidth
                        value={editedUser.PRENOM_PROFESSEUR}
                        onChange={handleOnChange}
                      />
                    </MDBox>
                    <MDBox mb={2}>
                      <MDInput
                        name="TITRE"
                        type="text"
                        label="Titre"
                        fullWidth
                        value={editedUser.TITRE}
                        onChange={handleOnChange}
                      />
                    </MDBox>                                            
                  </MDBox>
                </MDBox>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={toggleClose}>
                  FERMER
                </MDBBtn>
                <MDBBtn onClick={handleUpdateProf}>Modifier</MDBBtn>
              </MDBModalFooter>
            </Card>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    );
  };

  //recherche
  const rechercheprof = async (e) => {
    let value = e.target.value;

    if (value && !value.includes(".") && !value.includes("'")) {
      const encodedValue = encodeURIComponent(value);
      await axios.get(`http://localhost:5000/rechercheProf?query=${encodedValue}`).then(function (response) {
        if (response.status === 200) {
          setUserData(response.data);
        } else if (response.status === 404) {
          // Gérer le cas où aucun résultat n'a été trouvé
          // Par exemple, afficher un message à l'utilisateur
          setUserData([]);
        }
      });

    }
    else {
      loadProfesseur();
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* modal update */}
          {isEditModalOpen && editUserData && editUserData.NOM_PROFESSEUR && (
            <EditUtilisateur
              isOpen={isEditModalOpen}
              onSave={handleSaveUserData}
              user={editUserData}
              onClose={toggleEditModal}
            />
          )}
          {/* //Modal ajout */}
          <MDBModal staticBackdrop tabIndex="-1" show={staticModal} setShow={setStaticModal}>
            <MDBModalDialog centered>
              <MDBModalContent>
                <Card>
                  <MDBModalHeader>
                    <MDTypography variant="h6" fontWeight="medium">
                      Ajouter utilisateur
                    </MDTypography>
                  </MDBModalHeader>
                  <MDBModalBody>
                    <MDBox component="form" role="form">
                      <MDBox mb={2}>
                        <MDInput
                          name="NOM_PROFESSEUR"
                          type="text"
                          label="Nom"
                          fullWidth
                          value={NOM_PROFESSEUR}
                          onChange={(event) => {
                            setNOM_PROFESSEUR(event.target.value);
                          }}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <MDInput
                          id="PRENOM_PROFESSEUR"
                          name="PRENOM_PROFESSEUR"
                          type="text"
                          label="Prénom"
                          fullWidth
                          value={PRENOM_PROFESSEUR}
                          onChange={(event) => {
                            setPRENOM_PROFESSEUR(event.target.value);
                          }}
                        />
                      </MDBox>    
                      <MDBox mb={2}>
                        <MDInput
                          id="TITRE"
                          name="TITRE"
                          type="text"
                          label="Titre"
                          fullWidth
                          value={TITRE}
                          onChange={(event) => {
                            setTITRE(event.target.value);
                          }}
                        />
                      </MDBox>                                                                              
                    </MDBox>
                  </MDBModalBody>
                  <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={toggleShow}>
                      FERMER
                    </MDBBtn>
                    <MDBBtn onClick={addProfesseur}>ENREGISTRER</MDBBtn>
                  </MDBModalFooter>
                </Card>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>

          <Grid item xs={12}>
            <Card>
              <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  Liste des enseignants
                </MDTypography>

                <MDInput label="Recherche" onChange={rechercheprof} sx={{ marginLeft: "10px" }} />

                <MDButton variant="gradient" color="dark" onClick={toggleShow} sx={{ marginLeft: "10px" }}>
                  <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                  &nbsp;nouveau enseignant
                </MDButton>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Professeur;

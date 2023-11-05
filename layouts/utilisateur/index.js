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

import AlertFunctions from "../../alert"

function Tables() {
  useEffect(() => {
    loadUtilisateur();
    loadClasse();
  }, []);

  //Afichage données
  const [userData, setUserData] = useState([]);

  const loadUtilisateur = async () => {
    const response = await axios.get("http://localhost:5000/alluser");
    setUserData(response.data);
  };

  const [classe, setSlasse] = useState([]);

  const loadClasse = async () => {
    const response = await axios.get("http://localhost:5000/allclasse");
    setSlasse(response.data);
  };

  //Ajout

  const [staticModal, setStaticModal] = useState(false);
  const toggleShow = () => setStaticModal(!staticModal);

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
    label: classeItem.NOM_CLASSE + ' ' + classeItem.parcours.NOM_PARCOURS + ' ' + classeItem.ANNEE_UNIVERSITAIRE,
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
   AlertFunctions.Error();
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
      // alert(message);
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
          loadUtilisateur();
          toggleShow();
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
      .get(`http://localhost:5000/selectuser/${_id}`)
      .then((response) => {
        const userData = response.data;
        console.log("Fetched user data:", userData);

        if (userData && userData.NOM_UTILISATEUR) {
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
  const deleteUser = async (ID) => {
    if (window.confirm("Souhaitez-vous vraiment le supprimer ?")) {
      await axios.post(`http://localhost:5000/deleteuser/${ID}`).then(function (response) {
        loadUtilisateur();
      });
    }
  };

  const handleSwitchChange = (event, setStateFunction) => {
    setStateFunction(event.target.checked);
  };

  //table affichage
  const columns = [
    { Header: "Nom d'utilisateur", accessor: "author" },
    { Header: "Contact", accessor: "CONTACT" },
    { Header: "Mot de passe", accessor: "MOT_DE_PASS" },
    { Header: "Admin", accessor: "ADMIN" },
    { Header: "Status", accessor: "ACTIVE" },
    { Header: "Action", accessor: "Action" },
  ];

  const Author = ({ image, name, prenom }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {prenom}
        </MDTypography>
        <MDTypography variant="caption">{name}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const rows = userData.map((user) => ({
    author: <Author image={team2} name={user.NOM_UTILISATEUR} prenom={user.PRENOM_UTILISATEUR} />,
    CONTACT: user.CONTACT,
    MOT_DE_PASS: user.MOT_DE_PASS,
    ADMIN: `${user.ADMIN}`,
    ACTIVE: (
      <MDBox ml={-1}>
        {user.ACTIVE ? (
          <MDBadge badgeContent="actif" color="success" variant="gradient" size="sm" />
        ) : (
          <MDBadge badgeContent="inactif" color="dark" variant="gradient" size="sm" />
        )}
      </MDBox>
    ),
    Action: (
      <div>
        {user.NOM_UTILISATEUR && (
          <Icon size="lg" style={{ cursor: "pointer" }} onClick={() => fetchUserData(user._id)}>
            edit
          </Icon>
        )}
        <Icon size="lg" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => deleteUser(user._id)}>
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
  const [valmod, setValmod] = useState(null);

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
      console.log("NOM_UTILISATEUR", editedUser.NOM_UTILISATEUR);
    }, [editedUser]);

    const options = [
      { value: "Etudiant", label: "Etudiant" },
      { value: "Administrateur", label: "Administrateur" },
    ];

    const toggleClose = () => {
      onClose();
    };

    const handleUpdateUser = async () => {
      try {
        const response = await axios.put(`http://localhost:5000/updateuser/${editedUser._id}`, editedUser);

        if (response.status === 200) {
          onSave(response.data);
          onClose();
          loadUtilisateur();
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
                  Modifier l'utilisateur
                </MDTypography>
              </MDBModalHeader>
              <MDBModalBody>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDBox mb={2}>
                      <MDInput
                        name="NOM_UTILISATEUR"
                        type="text"
                        label="Nom"
                        fullWidth
                        value={editedUser.NOM_UTILISATEUR}
                        onChange={handleOnChange}
                      />
                    </MDBox>
                    <MDBox mb={2}>
                      <MDInput
                        name="PRENOM_UTILISATEUR"
                        type="text"
                        label="Prénom"
                        fullWidth
                        value={editedUser.PRENOM_UTILISATEUR}
                        onChange={handleOnChange}
                      />
                    </MDBox>
                    <MDBox mb={2}>
                      <MDInput
                        name="CONTACT"
                        type="text"
                        label="Contact"
                        fullWidth
                        value={editedUser.CONTACT}
                        onChange={handleOnChange}
                      />
                    </MDBox>
                    <MDBox mb={2}>
                      <MDInput
                        name="MOT_DE_PASS"
                        type="text"
                        label="Mot de passe"
                        fullWidth
                        value={editedUser.MOT_DE_PASS}
                        onChange={handleOnChange}
                      />
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
                        value={options.find((option) => option.value === editedUser.ADMIN)}
                        onChange={(selectedOption) => {
                          setEditedUser({
                            ...editedUser,
                            ADMIN: selectedOption.value,
                          });
                        }}
                      />
                    </MDBox>
                    <MDBox mb={2} sx={{ display: "flex", justifyContent: "center" }}>
                      <MDTypography variant="h6" fontWeight="light" sx={{ marginRight: "10px" }}>
                        Activer
                      </MDTypography>
                      <Switch
                        checked={editedUser.ACTIVE}
                        sx={{ marginLeft: "5px" }}
                        onChange={(event) => {
                          setEditedUser({
                            ...editedUser,
                            ACTIVE: event.target.checked,
                          });
                        }}
                      />
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={toggleClose}>
                  FERMER
                </MDBBtn>
                <MDBBtn onClick={handleUpdateUser}>Modifier</MDBBtn>
              </MDBModalFooter>
            </Card>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    );
  };

  //recherche
  const rechercheuser = async (e) => {
    let value = e.target.value;

    if (value && !value.includes(".") && !value.includes("'")) {
      const encodedValue = encodeURIComponent(value);
      await axios.get(`http://localhost:5000/rechercheUser?query=${encodedValue}`).then(function (response) {
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
      loadUtilisateur();
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* modal update */}
          {isEditModalOpen && editUserData && editUserData.NOM_UTILISATEUR && (
            <EditUtilisateur
              isOpen={isEditModalOpen}
              user={editUserData}
              onSave={handleSaveUserData}
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
                          name="NOM_UTILISATEUR"
                          type="text"
                          label="Nom"
                          fullWidth
                          value={NOM_UTILISATEUR}
                          onChange={(event) => {
                            setNOM_UTILISATEUR(event.target.value);
                          }}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <MDInput
                          id="PRENOM"
                          name="PRENOM"
                          type="text"
                          label="Prénom"
                          fullWidth
                          value={PRENOM_UTILISATEUR}
                          onChange={(event) => {
                            setPRENOM_UTILISATEUR(event.target.value);
                          }}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <MDInput
                          id="CONTACT"
                          name="CONTACT"
                          type="text"
                          label="Contact"
                          fullWidth
                          value={CONTACT}
                          onChange={(event) => {
                            setCONTACT(event.target.value);
                          }}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <MDInput
                          id="MOT_DE_PASSE"
                          name="MOT_DE_PASSE"
                          type="text"
                          label="Mot de passe"
                          fullWidth
                          value={MOT_DE_PASS}
                          onChange={(event) => {
                            setMOT_DE_PASS(event.target.value);
                          }}
                        />
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

                      <MDBox mb={2} sx={{ display: "flex", justifyContent: "center" }}>
                        <MDTypography variant="h6" fontWeight="light" sx={{ marginRight: "10px" }}>
                          Activer
                        </MDTypography>
                        <Switch
                          sx={{ marginLeft: "5px" }}
                          value={ACTIVE}
                          onChange={(event) => handleSwitchChange(event, setACTIVE)}
                        />
                      </MDBox>
                    </MDBox>
                  </MDBModalBody>
                  <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={toggleShow}>
                      FERMER
                    </MDBBtn>
                    <MDBBtn onClick={addUtilisateur}>ENREGISTRER</MDBBtn>
                  </MDBModalFooter>
                </Card>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>

          <Grid item xs={12}>
            <Card>
              <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  Liste des utilisateurs
                </MDTypography>

                <MDInput label="Recherche" onChange={rechercheuser} sx={{ marginLeft: "10px" }} />

                <MDButton variant="gradient" color="dark" onClick={toggleShow} sx={{ marginLeft: "10px" }}>
                  <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                  &nbsp;nouveau utilisateur
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

export default Tables;

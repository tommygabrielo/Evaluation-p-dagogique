import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaBeer, FaTrash, FaEye } from 'react-icons/fa';
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

function Element() {

  useEffect(() => {
    loadClasse();
    loadProf();
    loadElement();
  }, []);

  //Afichage données

  const [classe, setSlasse] = useState([]);

  const loadClasse = async () => {
    const response = await axios.get("http://localhost:5000/allclasse");
    setSlasse(response.data);
  };

  const [prof, setProf] = useState([]);

  const loadProf = async () => {
    const response = await axios.get("http://localhost:5000/allprof");
    setProf(response.data);
  };


  const [userData, setUserData] = useState([]);

  const loadElement = async () => {
    const response = await axios.get("http://localhost:5000/allElement");
    setUserData(response.data);
  };

  //Ajout

  const [staticModal, setStaticModal] = useState(false);
  const toggleShow = () => setStaticModal(!staticModal);
  //champ NOM element
  const [NOM_ELEMENT, setNOM_ELEMENT] = useState("");
  const [HEURE, setHEURE] = useState("");
  //champ classe
  const option_classe = classe.map((classeItem) => ({
    value: classeItem._id,
    label: classeItem.NOM_CLASSE + ' ' + classeItem.parcours.NOM_PARCOURS,
  }));
  const [selectedClasse, setSelectedClasse] = useState("");
  const handleChange = (selectedOption) => {
    setSelectedClasse(selectedOption);
  };
  useEffect(() => {
    if (selectedClasse) {
      // Assurez-vous que selectedClasse a une valeur
      loadUE();
    }
  }, [selectedClasse]);


  //champ UE
  const [UE, setUE] = useState([]);
  const [selectedUE, setSelectedUE] = useState("");
  const loadUE = async () => {
    if (selectedClasse) {
      const classeId = selectedClasse.value;
      console.log(classeId);
      const response = await axios.get(`http://localhost:5000/unitesEnseignement/${classeId}`);
      setUE(response.data);
    }
  };
  const option_ue = UE.map((ueItem) => ({
    value: ueItem._id, // Assurez-vous que `_id` ou un autre identifiant unique est disponible dans les données de l'unité d'enseignement
    label: ueItem.NOM_UE,
  }));
  //Champ prof
  const option_prof = prof.map((professeur) => ({
    value: professeur._id,
    label: `${professeur.NOM_PROFESSEUR} ${professeur.PRENOM_PROFESSEUR}`,
  }));

  const [selectedProf, setSelectedProf] = useState("");


  const addUE = (event) => {
    event.preventDefault();
    toggleShow();
    if (
      NOM_ELEMENT === "" || !selectedClasse.value === "" || !selectedUE.value === "" || !selectedProf.value === ""
    ) {
      alert("Tous les champs sont obligatoires");
    } else {

      const message = `NOM_ELEMENT: ${NOM_ELEMENT}\nClasse: ${selectedClasse.value}\nUE: ${selectedUE.value}\nProf: ${selectedProf.value}`;
      // alert(message);
      axios
        .post("http://localhost:5000/addElement", {
          NOM_ELEMENT: NOM_ELEMENT,
          HEURE: HEURE,
          UE: selectedUE.value,
          PROFESSEUR: selectedProf.value
        })
        .then(() => {
          console.log("La promesse Axios a été résolue avec succès");
          setNOM_ELEMENT("");
          setSelectedClasse("");
          setSelectedProf("");
          setSelectedUE("");
          loadElement();
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
      .get(`http://localhost:5000/selectUE/${_id}`)
      .then((response) => {
        const userData = response.data;
        console.log("Fetched user data:", userData);

        if (userData && userData.NOM_UE) {
          setEditUserData(userData);
          setSelectedClasse(userData.classe); // Initialisez selectedClasse avec la classe actuelle de l'utilisateur
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
  const deleteUE = async (ID) => {
    if (window.confirm("Souhaitez-vous vraiment le supprimer ?")) {
      await axios.post(`http://localhost:5000/deleteUE/${ID}`).then(function (response) {
        loadUE();
      });
    }
  };

  const handleSwitchChange = (event, setStateFunction) => {
    setStateFunction(event.target.checked);
  };

  //voir contenu
  let history = useNavigate();
  const handleViewDetails = (id) => {
    history(`/Contenu/${id}`);
  };

  //table affichage
  const columns = [
    { Header: "Nom UE", accessor: "nomUE" },
    { Header: "Nom Element", accessor: "element" },
    { Header: "ET", accessor: "ET" },
    { Header: "Enseignant", accessor: "enseignant" },
    { Header: "Action", accessor: "Action" },
  ];

  const rows = userData.map((user) => ({
    // author: <Author image={team2} name={user.NOM_UTILISATEUR} prenom={user.PRENOM_UTILISATEUR} />,
    nomUE: user.UE.NOM_UE,
    element: user.NOM_ELEMENT,
    ET: user.HEURE,
    enseignant: `${user.PROFESSEUR.NOM_PROFESSEUR} ${user.PROFESSEUR.PRENOM_PROFESSEUR} `,
    Action: (
      <div>
        {user.NOM_ELEMENT && (
          <Icon size="lg" style={{ cursor: "pointer" }} onClick={() => fetchUserData(user._id)}>
            edit
          </Icon>
        )}
       
        <FaEye style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => handleViewDetails(user._id)} />

        <FaTrash style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => deleteUE(user._id)} />
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
      console.log("NOM_UE", editedUser.NOM_UE);
    }, [editedUser]);


    const toggleClose = () => {
      onClose();
    };

    const handleUpdateUser = async () => {
      try {
        const response = await axios.put(`http://localhost:5000/updateUE/${editedUser._id}`, editedUser);

        if (response.status === 200) {
          onSave(response.data);
          onClose();
          loadUE();
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
                  Modifier l'unité d'enseignement
                </MDTypography>
              </MDBModalHeader>
              <MDBModalBody>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDBox mb={2}>
                      <MDInput
                        name="NOM_UE"
                        type="text"
                        label="Nom"
                        fullWidth
                        value={editedUser.NOM_UE}
                        onChange={handleOnChange}
                      />
                    </MDBox>


                    <MDBox mb={2}>
                      <MDTypography variant="h6" fontWeight="light" sx={{ marginBottom: "10px" }}>
                        Type d'utilisateur
                      </MDTypography>
                      <Select
                        options={option_classe}
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
                        value={option_classe.find((option) => option.value === editedUser.classe._id)}
                        onChange={(selectedOption) => {
                          setEditedUser({
                            ...editedUser,
                            classe: selectedOption.value,
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
  const rechercheUE = async (e) => {
    let value = e.target.value;

    if (value && !value.includes(".") && !value.includes("'")) {
      const encodedValue = encodeURIComponent(value);
      await axios.get(`http://localhost:5000/rechercheUE?query=${encodedValue}`).then(function (response) {
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
      loadUE();
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* modal update */}
          {isEditModalOpen && editUserData && editUserData.NOM_UE && (
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
                      Nouveau élément
                    </MDTypography>
                  </MDBModalHeader>
                  <MDBModalBody>
                    <MDBox component="form" role="form">

                      <MDBox mb={2}>
                        <MDInput
                          name="NOM_Element"
                          type="text"
                          label="Nom"
                          fullWidth
                          value={NOM_ELEMENT}
                          onChange={(event) => {
                            setNOM_ELEMENT(event.target.value);
                          }}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <MDInput
                          name="HEURE"
                          type="text"
                          label="Enseignement théorique"
                          fullWidth
                          value={HEURE}
                          onChange={(event) => {
                            setHEURE(event.target.value);
                          }}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <MDTypography variant="h6" fontWeight="light" sx={{ marginBottom: "10px" }}>
                          Niveau
                        </MDTypography>
                        <Select
                          value={selectedClasse}
                          options={option_classe}
                          placeholder="Sélectionnez le niveau"
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
                          onChange={handleChange}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <MDTypography variant="h6" fontWeight="light" sx={{ marginBottom: "10px" }}>
                          Unité d'enseignement
                        </MDTypography>
                        <Select
                          value={selectedUE}
                          options={option_ue}
                          placeholder="Sélectionnez lunité d'enseignement"
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
                          onChange={(selectedOption) => {
                            setSelectedUE(selectedOption);
                          }}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <MDTypography variant="h6" fontWeight="light" sx={{ marginBottom: "10px" }}>
                          Enseignant
                        </MDTypography>
                        <Select
                          value={selectedProf}
                          options={option_prof}
                          placeholder="Sélectionnez l'enseignant"
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
                          onChange={(selectedOption) => {
                            setSelectedProf(selectedOption);
                          }}
                        />
                      </MDBox>

                    </MDBox>
                  </MDBModalBody>
                  <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={toggleShow}>
                      FERMER
                    </MDBBtn>
                    <MDBBtn onClick={addUE}>ENREGISTRER</MDBBtn>
                  </MDBModalFooter>
                </Card>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>

          <Grid item xs={12}>
            <Card>
              <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  Elément constitutifs
                </MDTypography>

                <MDInput label="Recherche" onChange={rechercheUE} sx={{ marginLeft: "10px" }} />

                <MDButton variant="gradient" color="dark" onClick={toggleShow} sx={{ marginLeft: "10px" }}>
                  <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                  &nbsp;nouveau
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

export default Element;

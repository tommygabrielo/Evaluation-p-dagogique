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

function Contenu() {
  useEffect(() => {
    //loadElement();
    loadContenu();
    console.log(id);
  }, []);
  const {id} = useParams();
  
  //Afichage données
  const [userData, setUserData] = useState([]);

  const loadElement = async () => {
    const response = await axios.get(`http://localhost:5000/selectElement/${id}`);
    setUserData(response.data);
  };

  const [contenu, setContenu] = useState([]);

  const loadContenu= async () => {
    const response = await axios.get(`http://localhost:5000/selectContenu/${id}`);
    setContenu(response.data);
    console.log(response.data);
  };
 
  //Ajout

  const [staticModal, setStaticModal] = useState(false);
  const toggleShow = () => setStaticModal(!staticModal);

  const [NOM_CONTENU, setNOM_CONTENU] = useState("");


  const addContenu = (event) => {
    event.preventDefault();
    if (
      NOM_CONTENU === ""
    ) {
      alert("Tous les champs sont obligatoires");
    } else {

      const message = `CONTENU: ${NOM_CONTENU}\nELEMENT :${id}`;
      alert(message);
      axios
        .post("http://localhost:5000/addContenu", {
          NOM_CONTENU: NOM_CONTENU,
          ELEMENT: id,    
          FINI: false, 
        })
        .then(() => {
          setNOM_CONTENU("");       
          loadContenu();
          toggleShow();
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
        loadElement();
      });
    }
  };

  const handleSwitchChange = (event, setStateFunction) => {
    setStateFunction(event.target.checked);
  };

  //table affichage
  const columns = [
    { Header: "Nom Contenu", accessor: "nom" },
    { Header: "Action", accessor: "Action" },
  ];

  const rows = contenu.map((user) => ({
    // author: <Author image={team2} name={user.NOM_UTILISATEUR} prenom={user.PRENOM_UTILISATEUR} />,
    nom: user.NOM_CONTENU,   
    Action: (
      <div>
        {user.NOM_UE && (
          <Icon size="lg" style={{ cursor: "pointer" }} onClick={() => fetchUserData(user._id)}>
            edit
          </Icon>
        )}
        <Icon size="lg" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => deleteUE(user._id)}>
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
          loadElement();
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
                  Modification du contenu
                </MDTypography>
              </MDBModalHeader>
              <MDBModalBody>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDBox mb={2}>
                      <MDInput
                        name="NOM_CONTENU"
                        type="text"
                        label="Nom"
                        fullWidth
                        value={editedUser.NOM_CONTENU}
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
      loadElement();
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
                      Nouveau Unité d'enseignement
                    </MDTypography>
                  </MDBModalHeader>
                  <MDBModalBody>
                    <MDBox component="form" role="form">               
                      <MDBox mb={2}>
                        <MDInput
                          name="NOM_CONTENU"
                          type="text"
                          label="Nom"
                          fullWidth
                          value={NOM_CONTENU}
                          onChange={(event) => {
                            setNOM_CONTENU(event.target.value);
                          }}
                        />
                      </MDBox>


                    </MDBox>
                  </MDBModalBody>
                  <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={toggleShow}>
                      FERMER
                    </MDBBtn>
                    <MDBBtn onClick={addContenu}>ENREGISTRER</MDBBtn>
                  </MDBModalFooter>
                </Card>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>

          <Grid item xs={12}>
            <Card>
              <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  Contenu
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

export default Contenu;

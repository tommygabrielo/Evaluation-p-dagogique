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

import Classe from "./Classe";
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

function Tables() {
  useEffect(() => {
    loadParcours();
  }, []);

  //Afichage données
  const [userData, setUserData] = useState([]);

  const loadParcours = async () => {
    const response = await axios.get("http://localhost:5000/allparcours");
    setUserData(response.data);
  };

  //Ajout
  const [NOM_PARCOURS, setNOM_PARCOURS] = useState("");
 
  const addParcours = (event) => {
    event.preventDefault();
    if (NOM_PARCOURS === "") {
      alert("Completez le nom du parcours");
    } else {
      axios.post("http://localhost:5000/addparcours", {
        NOM_PARCOURS: NOM_PARCOURS,
      })
        .then(() => {
          setNOM_PARCOURS("");
          loadParcours();
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
      .get(`http://localhost:5000/selectparcours/${_id}`)
      .then((response) => {
        const userData = response.data;
        console.log("Fetched user data:", userData);

        if (userData && userData.NOM_PARCOURS) {
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
  const deleteParcours = async (ID) => {
    if (window.confirm("Souhaitez-vous vraiment le supprimer ?")) {
      await axios.post(`http://localhost:5000/deleteparcours/${ID}`).then(function (response) {
        loadParcours();
      });
    }
  };


  //table affichage
  const columns = [
    { Header: "Nom du parcours", accessor: "nom_parcours" },
    { Header: "Action", accessor: "Action" },
  ];

  const rows = userData.map((user) => ({
    nom_parcours: user.NOM_PARCOURS,
    Action: (
      <div>
        {user.NOM_PARCOURS && (
          <Icon size="lg" style={{ cursor: "pointer" }} onClick={() => fetchUserData(user._id)}>
            edit
          </Icon>
        )}
        <Icon size="lg" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => deleteParcours(user._id)}>
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

    const toggleClose = () => {
      onClose();
    };

    const handleUpdateParcours = async () => {
      try {
        const response = await axios.put(`http://localhost:5000/updateparcours/${editedUser._id}`, editedUser);

        if (response.status === 200) {
          onSave(response.data);
          onClose();
          loadParcours();
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
                  Modifier le parcours
                </MDTypography>
              </MDBModalHeader>
              <MDBModalBody>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDBox mb={2}>
                      <MDInput
                        name="NOM_PARCOURS"
                        type="text"
                        label="Nom"
                        fullWidth
                        value={editedUser.NOM_PARCOURS}
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
                <MDBBtn onClick={handleUpdateParcours}>Modifier</MDBBtn>
              </MDBModalFooter>
            </Card>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    );
  };

  //recherche
  const rechercheparcours = async (e) => {
    let value = e.target.value;

    if (value && !value.includes(".") && !value.includes("'")) {
      const encodedValue = encodeURIComponent(value);
      await axios.get(`http://localhost:5000/rechercheParcours?query=${encodedValue}`).then(function (response) {
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
      loadParcours();
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* modal update */}
          {isEditModalOpen && editUserData && editUserData.NOM_PARCOURS && (
            <EditUtilisateur
              isOpen={isEditModalOpen}
              user={editUserData}
              onSave={handleSaveUserData}
              onClose={toggleEditModal}
            />
          )}

          <Grid item xs={12}>
            <Card>
              <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  Parcours
                </MDTypography>

                <MDInput label="Recherche" onChange={rechercheparcours} sx={{ marginLeft: "10px" }} />
                <MDInput label="Nouveau parcours" value={NOM_PARCOURS} onChange={(event) => { setNOM_PARCOURS(event.target.value) }} sx={{ marginLeft: "10px" }} />

                <MDButton variant="gradient" color="dark" onClick={addParcours} sx={{ marginLeft: "10px" }}>
                  <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                  &nbsp;Ajouter
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
            <hr></hr>
          <Classe />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;

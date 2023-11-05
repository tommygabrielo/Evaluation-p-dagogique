import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

import DataTable from "examples/Tables/DataTable";

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

function Classe() {
    useEffect(() => {
        loadParcours();
        loadClasse();
    }, []);

    //Afichage données
    const [parcours, setParcours] = useState([]);
    const loadParcours = async () => {
        const response = await axios.get("http://localhost:5000/allparcours");
        setParcours(response.data);
    };
    const [classe, setClasse] = useState([]);
    const loadClasse = async () => {
        const response = await axios.get("http://localhost:5000/allclasse");
        setClasse(response.data);
    }


    //Ajout
    const [staticModal, setStaticModal] = useState(false);
    const toggleShow = () => setStaticModal(!staticModal);

    const [NOM_CLASSE, setNOM_CLASSE] = useState("");
    const [ANNEE_UNIVERSITAIRE, setANNEE_UNIVERSITAIRE] = useState("");
    const options = [
        { value: "2022 - 2023", label: "2022 - 2023" },
        { value: "2023 - 2024", label: "2023 - 2024" },
        { value: "2024 - 2025", label: "2024 - 2025" },
    ];

    const option_parcours = parcours.map((parcoursItem) => ({
        value: parcoursItem._id,
        label: parcoursItem.NOM_PARCOURS,
    }));

    const [selectedParcours, setSelectedParcours] = useState("");
    const handleChange = (selectedOption) => {
        setSelectedParcours(selectedOption);
    };

    const addClasse = (event) => {
        event.preventDefault();
        if (NOM_CLASSE === "" || ANNEE_UNIVERSITAIRE === "" || !selectedParcours.value === "") {
            alert("Completez les champs");
        } else {
            // alert(`Classe ${NOM_CLASSE} n\ Annee ${ANNEE_UNIVERSITAIRE} n\ parcours ${selectedParcours.value}`);
            axios.post("http://localhost:5000/addclasse", {
                NOM_CLASSE: NOM_CLASSE,
                ANNEE_UNIVERSITAIRE: ANNEE_UNIVERSITAIRE,
                parcours: selectedParcours.value,
            })
                .then(() => {
                    setNOM_CLASSE("");
                    setANNEE_UNIVERSITAIRE(""); // Réinitialisez ANNEE_UNIVERSITAIRE
                    setSelectedParcours(""); //
                    toggleShow();
                    loadClasse();
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
            .get(`http://localhost:5000/selectclasse/${_id}`)
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

    //Suppression
    const deleteClasse = async (ID) => {
        if (window.confirm("Souhaitez-vous vraiment le supprimer ?")) {
            await axios.post(`http://localhost:5000/deleteclasse/${ID}`).then(function (response) {
                loadClasse();
            });
        }
    };

    //table affichage
    const columns = [
        { Header: "Niveau", accessor: "niveau" },
        { Header: "Parcours", accessor: "Parcours" },
        { Header: "Annee", accessor: "Annee" },    
        { Header: "Action", accessor: "Action" },
    ];

    const rows = classe.map((tt) => ({
        niveau: tt.NOM_CLASSE,
        Parcours: tt.parcours.NOM_PARCOURS,
        Annee: tt.ANNEE_UNIVERSITAIRE,
        Action: (
            <div>
                {tt.NOM_PARCOURS && (
                    <Icon size="lg" style={{ cursor: "pointer" }} onClick={() => fetchUserData(tt._id)}>
                        edit
                    </Icon>
                )}
                <Icon size="lg" style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => deleteClasse(tt._id)}>
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
                                    Modifier la classe
                                </MDTypography>
                            </MDBModalHeader>
                            <MDBModalBody>
                                <MDBox component="form" role="form">
                                    <MDBox mb={2}>
                                        <MDBox mb={2}>
                                            <MDInput
                                                name="NOM_CLASSE"
                                                type="text"
                                                label="Nom"
                                                fullWidth
                                                value={editedUser.NOM_CLASSE}
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
    const rechercheclasse = async (e) => {
        let value = e.target.value;

        if (value && !value.includes(".") && !value.includes("'")) {
            const encodedValue = encodeURIComponent(value);
            await axios.get(`http://localhost:5000/rechercheClasse?query=${encodedValue}`).then(function (response) {
                if (response.status === 200) {
                    setClasse(response.data);
                } else if (response.status === 404) {
                    // Gérer le cas où aucun résultat n'a été trouvé
                    // Par exemple, afficher un message à l'utilisateur
                    setClasse([]);
                }
            });

        }
        else {
            loadClasse();
        }
    }

    return (

        <Card>
            {/* //Modal ajout */}
            <MDBModal staticBackdrop tabIndex="-1" show={staticModal} setShow={setStaticModal}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <Card>
                            <MDBModalHeader>
                                <MDTypography variant="h6" fontWeight="medium">
                                    Ajouter Classe
                                </MDTypography>
                            </MDBModalHeader>
                            <MDBModalBody>
                                <MDBox component="form" role="form">
                                    <MDBox mb={2}>
                                        <MDInput
                                            name="NOM_CLASSE"
                                            type="text"
                                            label="Nom Classe"
                                            fullWidth
                                            value={NOM_CLASSE}
                                            onChange={(event) => {
                                                setNOM_CLASSE(event.target.value);
                                            }}
                                        />
                                    </MDBox>

                                    <MDBox mb={2}>
                                        <MDTypography variant="h6" fontWeight="light" sx={{ marginBottom: "10px" }}>
                                            Parcours
                                        </MDTypography>
                                        <Select
                                            value={selectedParcours}
                                            options={option_parcours}
                                            placeholder="Sélectionnez le parcours"
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
                                            Année universitaire
                                        </MDTypography>
                                        <Select
                                            options={options}
                                            placeholder="Sélectionnez l'année"
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
                                            onChange={(selectedOption) => setANNEE_UNIVERSITAIRE(selectedOption.value)}
                                        />
                                    </MDBox>

                                </MDBox>
                            </MDBModalBody>
                            <MDBModalFooter>
                                <MDBBtn color="secondary" onClick={toggleShow}>
                                    FERMER
                                </MDBBtn>
                                <MDBBtn onClick={addClasse}>ENREGISTRER</MDBBtn>
                            </MDBModalFooter>
                        </Card>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                    Classe
                </MDTypography>

                <MDInput label="Recherche" onChange={rechercheclasse} sx={{ marginLeft: "10px" }} />

                <MDButton variant="gradient" color="dark" onClick={toggleShow} sx={{ marginLeft: "10px" }}>
                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                    &nbsp;Nouvelle classe
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

    );
}

export default Classe;

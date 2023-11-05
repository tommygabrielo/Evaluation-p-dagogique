import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Transaction from "layouts/billing/components/Transaction";
import MDProgress from "components/MDProgress";


// Material Dashboard 2 React context
import { useMaterialUIController } from "context";


function UE() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    useEffect(() => {
        loadClasse();
        //loadFiche();
    }, []);

    const classeDelegue = localStorage.getItem("classe");

    //Afichage données
    const [classe, setSlasse] = useState([]);
    const loadClasse = async () => {
        const response = await axios.get("http://localhost:5000/allclasse");
        setSlasse(response.data);
    };

    // const [fiche, setFiche] = useState([]);
    // const loadFiche = async () => {
    //     const response = await axios.get(`http://localhost:5000/allFiche/${classeDelegue}`);
    //     setFiche(response.data);
    // };

    //hijery
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
            // console.log(classeId);
            const response = await axios.get(`http://localhost:5000/unitesEnseignement/${classeId}`);
            setUE(response.data);
        }
    };
    const option_ue = UE.map((ueItem) => ({
        value: ueItem._id, // Assurez-vous que `_id` ou un autre identifiant unique est disponible dans les données de l'unité d'enseignement
        label: ueItem.NOM_UE,
    }));
    useEffect(() => {
        if (selectedUE) {
            // Assurez-vous que selectedClasse a une valeur
            loadElement();
        }
    }, [selectedUE]);

    //champ Element
    const [element, setElement] = useState([]);
    const UEId = selectedUE.value
    const loadElement = async () => {
        console.log(UEId);
        const response = await axios.get(`http://localhost:5000/loadElementparUE/${UEId}`);
        // console.log(response.data);
        setElement(response.data);
    };

    const option_element = element.map((classeItem) => ({
        value: classeItem._id,
        label: classeItem.NOM_ELEMENT,
    }));
    const [selectedElement, setSelectedElement] = useState("");
    const handleChange2 = (selectedOption) => {
        setSelectedElement(selectedOption);
    };

    const [data, setData] = useState({})
    // Champ Contenu
    const [contenu, setContenu] = useState([]);
    const hijery = (event) => {
        event.preventDefault();
        if (
            !selectedClasse.value === "" || !selectedUE.value === "" || !selectedElement.value === ""
        ) {
            alert("Tous les champs sont obligatoires");
        } else {

            const message = `CLASSE: ${selectedClasse.value}\nUE: ${selectedUE.value}\nelement: ${selectedElement.value}`;
            // alert(message);
            axios
                .post("http://localhost:5000/consultation", {
                    CLASSE: selectedClasse.value,
                    UE: selectedUE.value,
                    ELEMENT: selectedElement.value,
                })
                .then((response) => {
                    setData(response.data);
                    setContenu(response.data.Contenus)

                    setSelectedClasse("");
                    setSelectedElement("");
                    setSelectedUE("");
                });
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} sx={{ marginTop: "-30px" }}>
                        <Card id="delete-account">
                            <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                                <MDTypography variant="h6" fontWeight="medium">
                                    Evaluation pédagogique
                                </MDTypography>
                                <MDButton variant="gradient" color="dark" sx={{ marginLeft: "10px" }} onClick={hijery}>
                                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                                    &nbsp;Voir
                                </MDButton>
                            </MDBox>
                            <MDBox p={2}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
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
                                    </Grid>
                                    <Grid item xs={12} md={4}>
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
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <MDBox mb={2}>
                                            <MDTypography variant="h6" fontWeight="light" sx={{ marginBottom: "10px" }}>
                                                Element
                                            </MDTypography>
                                            <Select
                                                value={selectedElement}
                                                options={option_element}
                                                placeholder="Sélectionnez l'élement"
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
                                                onChange={handleChange2}
                                            />
                                        </MDBox>
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Card>
                    </Grid>
                    <Grid container spacing={2} item xs={12} sx={{ marginTop: "-50px" }}>
                        <Grid item xs={12} md={6} lg={6}>
                            <Card>
                                <MDBox display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px" pt={3} px={2}>
                                    {data && (
                                        <div>
                                            <MDBox display="flex" alignItems="flex-start">
                                                <MDTypography variant="h6" fontWeight="regular"> Niveau:</MDTypography>
                                                <MDTypography variant="h6" fontWeight="medium" marginLeft="10px" textTransform="capitalize"> {data.Classe} {data.Parcours} </MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" alignItems="flex-start">
                                                <MDTypography variant="h6" fontWeight="regular"> UE:</MDTypography>
                                                <MDTypography variant="h6" fontWeight="medium" marginLeft="10px" textTransform="capitalize">{data.UE} </MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" alignItems="flex-start">
                                                <MDTypography variant="h6" fontWeight="regular"> Element:</MDTypography>
                                                <MDTypography variant="h6" fontWeight="medium" marginLeft="10px" textTransform="capitalize">{data.ELEMENT} </MDTypography>
                                            </MDBox>
                                            <MDBox display="flex" alignItems="flex-start">
                                                <MDTypography variant="h6" fontWeight="regular"> Enseignant:</MDTypography>
                                                <MDTypography variant="h6" fontWeight="medium" marginLeft="10px" textTransform="capitalize">{data.Professeur} </MDTypography>
                                            </MDBox>

                                        </div>
                                    )}
                                </MDBox>
                            </Card>
                        </Grid>
                      
                        <Grid item xs={12} md={6} lg={6}>
                            <Card>
                                <MDBox justifyContent="space-between" alignItems="center" marginBottom="20px" pt={3} px={2}>
                                    <MDBox display="flex" alignItems="flex-start">
                                        <MDTypography variant="h6" fontWeight="medium" marginTop={-1}>
                                            Taux de complétion
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox display="flex" alignItems="flex-start" xs={12}>
                                        <MDTypography variant="h6" fontWeight="regular"  lg={4} marginTop={1}>
                                            Contenu : {data.CountContenusFini} / {data.CountContenusFini + data.CountContenusNonFini}
                                        </MDTypography>
                                        <MDBox width="15rem" textAlign="center" marginLeft={5} marginTop={-1}>
                                            <MDProgress value={((data.CountContenusFini * 100) / (data.CountContenusFini + data.CountContenusNonFini)).toFixed(2)} color="info" variant="gradient" label={true} />
                                        </MDBox>
                                    </MDBox>
                                    <MDBox display="flex" alignItems="flex-start">
                                        <MDTypography variant="h6" fontWeight="regular" marginTop={2.5}>
                                            Heure : {data.DureeH}h {data.DureeM}Min / {data.DureeTotale}
                                        </MDTypography>
                                        <MDBox width="15rem" textAlign="center" marginLeft={5}>
                                            <MDProgress value={((data.DureeH*100) / (data.DureeTotale)).toFixed(2)} color="info" variant="gradient" label={true} />
                                        </MDBox>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: "-30px" }}>
                        <Card sx={{ height: "100%" }}>
                            <MDBox pt={3} pb={2} px={2}>
                                <MDBox mb={2}>
                                    <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                                        Contenus
                                    </MDTypography>
                                </MDBox>

                                <MDBox
                                    component="ul"
                                    display="flex"
                                    flexDirection="column"
                                    p={0}
                                    m={0}
                                    sx={{ listStyle: "none" }}
                                    alignItems="center"
                                >
                                    {contenu && (
                                        <div>
                                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                {contenu.map((contenuItem, index) => (
                                                    <li key={index}>
                                                        <Transaction
                                                            color={contenuItem.FINI ? 'success' : 'error'}
                                                            icon={contenuItem.FINI ? 'done' : 'block'} // Choisissez l'icône souhaitée pour FINI et NON FINI
                                                            name={contenuItem.NOM_CONTENU}
                                                            description={contenuItem.FINI ? 'Fini' : 'Non fini'}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout >
    );
}

export default UE;

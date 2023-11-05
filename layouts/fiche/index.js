import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDAvatar from "components/MDAvatar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function UE() {
  useEffect(() => {
    loadElement();
    loadFiche();
  }, []);

  const classeDelegue = localStorage.getItem("classe");

  //Afichage données
  const [element, setElement] = useState([]);

  const loadElement = async () => {
    const response = await axios.get(`http://localhost:5000/selectElementParClasse/${classeDelegue}`);
    console.log(response.data);
    setElement(response.data);
  };

  const [fiche, setFiche] = useState([]);

  const loadFiche = async () => {
    const response = await axios.get(`http://localhost:5000/allFiche/${classeDelegue}`);
    setFiche(response.data);
  };


  const actualiser = () => {
    loadFiche();
  }

  //Ajout

  //champ Element
  const option_element = element.map((classeItem) => ({
    value: classeItem._id,
    label: classeItem.NOM_ELEMENT,
  }));
  const [selectedElement, setSelectedElement] = useState("");
  const handleChange = (selectedOption) => {
    setSelectedElement(selectedOption);
  };
  useEffect(() => {
    if (selectedElement) {
      // Assurez-vous que selectedClasse a une valeur
      console.log(selectedElement.value);
      loadContenu();
    }
  }, [selectedElement]);

  //champ contenu
  const [Contenu, setContenu] = useState([]);
  const [selectedContenu, setSelectedContenu] = useState("");
  const loadContenu = async () => {
    if (selectedElement) {
      const ElementId = selectedElement.value;
      console.log(ElementId);
      const response = await axios.get(`http://localhost:5000/getContenuParElement/${ElementId}`);
      setContenu(response.data);
    }
  };

  const option_contenu = Contenu.map((ueItem) => ({
    value: ueItem._id, // Assurez-vous que `_id` ou un autre identifiant unique est disponible dans les données de l'unité d'enseignement
    label: ueItem.NOM_CONTENU,
  }));

  //champ date
  const [date, setDate] = useState("");
  const [HeureDebut, setHeureDebut] = useState("");
  const [HeureFin, setHeureFin] = useState("");

  const addFiche = (event) => {
    event.preventDefault();
    if (
      !selectedElement.value === "" || !selectedContenu.value === "" || date === "" || HeureDebut === "" || HeureFin === ""
    ) {
      alert("Tous les champs sont obligatoires");
    } else {

      // Formatez la date et les heures au format ISO 8601
      const isoDate = new Date(date).toISOString();
      const isoHeureDebut = new Date(`1970-01-01T${HeureDebut}`).toISOString();
      const isoHeureFin = new Date(`1970-01-01T${HeureFin}`).toISOString();

      const message = `ELEMENT: ${selectedElement.value}\nContenu: ${selectedContenu.value}\nDate: ${isoDate}\nDébut: ${isoHeureDebut}\nFin: ${isoHeureFin}`;
      alert(message);

      axios
        .post("http://localhost:5000/addFiche", {
          element: selectedElement.value,
          contenu: selectedContenu.value,
          date: isoDate,
          HeureDebut: isoHeureDebut,
          HeureFin: isoHeureFin,
        })
        .then(() => {
          setSelectedContenu("");
          setSelectedElement("");
          setDate("");
          setHeureDebut("");
          setHeureFin("");
          loadFiche();
        });
    }
  };

  //table affichage
  const columns = [
    { Header: "Date", accessor: "date" },
    { Header: "Heure debut", accessor: "debut" },
    { Header: "Heure fin", accessor: "fin" },
    { Header: "Element", accessor: "element" },
    { Header: "Contenu", accessor: "contenu" },
    { Header: "Enseignant", accessor: "enseignant" },
    // { Header: "Action", accessor: "Action" },
  ];

  const rows = fiche.map((user) => ({
    // author: <Author image={team2} name={user.NOM_UTILISATEUR} prenom={user.PRENOM_UTILISATEUR} />,
    date: formatDate(user.date), // Formatage de la date
    debut: formatTime(user.HeureDebut), // Formatage de l'heure de début
    fin: formatTime(user.HeureFin), // Formatage de l'heure de fin
    element: user.NOM_ELEMENT,
    contenu: user.NOM_CONTENU,
    enseignant: `${user.NOM_PROFESSEUR} ${user.PRENOM_PROFESSEUR}`
  })
  );
  function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  }

  function formatTime(time) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(time).toLocaleTimeString('fr-FR', options);
  }



  //recherche
  const filtreFiche = async (e) => {
    let value = e.target.value;
    const isoDate = new Date(value).toISOString();
    console.log(isoDate);
    if (value) {
      await axios.get(`http://localhost:5000/filtreFiche/${classeDelegue}?date=${isoDate}`).then(function (response) {
        if (response.status === 200) {
          setFiche(response.data);
          console.log(response.data);
        } else if (response.status === 404) {
          // Gérer le cas où aucun résultat n'a été trouvé
          // Par exemple, afficher un message à l'utilisateur
          setFiche([]);
        }
      });

    }
    else {
      loadFiche();
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} sx={{ marginTop: "-20px" }}>
            <Card>
              <Grid container spacing={3} sx={{ margin: "5px" }}>
                <Grid item xs={12} md={3} lg={3}>
                  <MDBox mb={1.5}>
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
                      onChange={handleChange}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <MDBox mb={1.5}>
                    <MDTypography variant="h6" fontWeight="light" sx={{ marginBottom: "10px" }}>
                      Contenu
                    </MDTypography>
                    <Select
                      value={selectedContenu}
                      options={option_contenu}
                      placeholder="Sélectionnez le contenu"
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
                      onChange={(selectedContenu) => {
                        setSelectedContenu(selectedContenu);
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={3} lg={2}>
                  <MDBox mb={1.5}>
                    <MDTypography variant="h6" fontWeight="light" sx={{ marginBottom: "5px" }}>
                      Date
                    </MDTypography>
                    <MDInput name="Date" type="date" value={date} onChange={(event) => {
                      setDate(event.target.value);
                    }} />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={3} lg={1}>
                  <MDBox mb={1.5}>
                    <MDTypography variant="h6" fontWeight="light" sx={{ marginBottom: "5px" }}>
                      Début
                    </MDTypography>
                    <MDInput name="HeureDebut" type="time" value={HeureDebut} onChange={(event) => {
                      setHeureDebut(event.target.value);
                    }} />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={3} lg={1}>
                  <MDBox mb={1.5}>
                    <MDTypography variant="h6" fontWeight="light" sx={{ marginBottom: "5px" }}>
                      Fin
                    </MDTypography>
                    <MDInput name="HeureFin" type="time" value={HeureFin} onChange={(event) => {
                      setHeureFin(event.target.value);
                    }} />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={3} lg={2}>
                  <MDBox mb={1.5}>
                    <MDButton variant="gradient" color="primary" sx={{ marginTop: "30px" }} onClick={addFiche} >
                      <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                    </MDButton>
                  </MDBox>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" fontWeight="medium">
                  Scéance effectuée
                </MDTypography>

                <MDInput type="date" onChange={filtreFiche} sx={{ marginLeft: "10px" }} />
                <MDButton onClick={actualiser} variant="gradient" color="light">  <Icon sx={{ fontWeight: "bold" }}>refresh</Icon></MDButton>

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

export default UE;

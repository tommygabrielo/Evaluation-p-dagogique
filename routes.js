// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Ulitisateur from "layouts/utilisateur";
import Enseignement from "layouts/enseignement";
import Professeur from "layouts/professeur";
import UE from "layouts/UE";
import Contenu from "layouts/contenu";
import Element from "layouts/element";
import Fiche from "layouts/fiche";
import Consultation from "layouts/consultation";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";


const routes = [
  {
    type: "collapse",
    name: "Consultation",
    key: "consultation",
    icon: <Icon fontSize="small">search</Icon>,
    route: "/consultation",
    component: <Consultation />,
  },
  // {
  //   type: "collapse",
  //   name: "Fiche",
  //   key: "fiche",
  //   icon: <Icon fontSize="small">description</Icon>,
  //   route: "/fiche",
  //   component: <Fiche />,
  // },

  // {
  //   type: "collapse",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   icon: <Icon fontSize="small">dashboard</Icon>,
  //   route: "/dashboard",
  //   component: <Dashboard />,
  // },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  {
    type: "collapse",
    name: "Enseignement",
    key: "enseignement",
    icon: <Icon fontSize="small">school</Icon>,
    route: "/enseignement",
    component: <Enseignement />,
  },
  {
    type: "collapse",
    name: "Utilisateurs",
    key: "utilisateurs",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/utilisateurs",
    component: <Ulitisateur />,
  },
  {
    type: "collapse",
    name: "Unité d'enseignement",
    key: "UE",
    icon: <Icon fontSize="small">class</Icon>,
    route: "/Unite_Enseignement",
    component: <UE />,
  },
  {
    type: "collapse",
    name: "Element",
    key: "Element",
    icon: <Icon fontSize="small">class</Icon>,
    route: "/Element",
    component: <Element />,
  },
  {
  
    key: "Contenu",
    icon: <Icon fontSize="small">class</Icon>,
    route: "/Contenu/:id",
    component: <Contenu />,
  },
  {
    type: "collapse",
    name: "Professeur",
    key: "professeur",
    icon: <Icon fontSize="small">face</Icon>,
    route: "/professeur",
    component: <Professeur />,
  },
 
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
  {
    type: "collapse",
    key: "sign-in",
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    key: "sign-up",
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;

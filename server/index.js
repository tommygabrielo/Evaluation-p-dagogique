const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const rout = require("./routes/router");
const {connectToDatabase} = require ('./config/db');

// Configuration des middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Utilisation du routeur
app.use(rout);

// Appel de la fonction de connexion à la base de données
connectToDatabase();

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});

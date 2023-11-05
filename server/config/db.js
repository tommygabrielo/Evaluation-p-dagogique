const mongoose = require('mongoose');

// Configuration de la connexion à la base de données
const dbConfig = {
  url: 'mongodb://localhost:27017/evaluation', // URL de votre base de données MongoDB
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

// Fonction pour se connecter à la base de données
const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbConfig.url, dbConfig.options);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

module.exports = {
  connectToDatabase,
};

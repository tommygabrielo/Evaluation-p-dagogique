import Swal from 'sweetalert2';

const AlertFunctions = {
    Champ_obligatoire: function() { 
        Swal.fire({
            title: 'Erreur',
            text:'Tous les champs sont obligatoires',
            icon: 'error',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });      
    },
    Connexion_reussi: function() { 
        Swal.fire({
            title: 'Connexion réussi',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });      
    },
    Alert: function() { 
        Swal.fire({
            title: 'Ajout réussi',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });      
    },
    Error: function() { 
        Swal.fire({
            title: 'Erreur',
            icon: 'error',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });      
    }
}

export default AlertFunctions;

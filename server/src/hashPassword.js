const bcrypt = require('bcrypt');

const plainPassword = 'test'; // Ditt lösenord
const saltRounds = 10; // Antalet salt-rundor (standard är 10)

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashat lösenord:', hash);
    }
});

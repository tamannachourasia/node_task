// createUser.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// const newUser = {
//     firstName: 'John',
//     lastName: 'Doe',
//     mobileNo: '1234567890', // Valid mobile number
//     email: 'john.doe@example.com', // Valid email address
//     address: {
//         street: '123 Main Street',
//         city: 'Anytown',
//         state: 'SomeState',
//         country: 'SomeCountry'
//     },
//     loginId: 'john12', // Valid login ID
//     password: 'Password@123' // Valid password
// };

// axios.post('http://localhost:3000/server/create', newUser) 
//     .then(response => {
//         console.log('User created:', response.data);
//     })
//     .catch(error => {
//         console.error('Error creating user:', error.response.data);
//     });

module.exports=router;
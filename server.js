const express = require('express').Router();
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs/promises')

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());

// Connect to database
// const db = mysql.createConnection(
//     {
//         // MySQL localhost Create a variable before usage and put .env in .gitignore
//         host: 'localhost',
//         // MySQL username Create a variable before usage and put .env in .gitignore
//         user: 'root',
//         // MySQL password Create a variable before usage and put .env in .gitignore
//         password: '',
//         database: 'employee_tracker_db'
//     },
//     console.log(`Connected to employee_tracker_db.`)
// );
//route to routes here

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);

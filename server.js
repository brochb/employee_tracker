const express = require('express').Router();
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs/promises')

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);

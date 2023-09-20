const express = require('express').Router();
const path = require('path');
const fs = require('fs/promises')

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//route to routes here

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);

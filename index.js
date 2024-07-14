require('dotenv').config()
const path = require('path');
const express = require('express')
// const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./routes')

// Middleware to parse JSON bodies
// app.use(bodyParser.json());

app.use(cors())
app.use(express.json())
app.use('/', routes)

app.use(express.static(path.resolve(__dirname, './client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

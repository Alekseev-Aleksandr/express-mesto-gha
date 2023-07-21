const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { errors } = require('celebrate')

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(router);
app.use('*', (req, res) => { res.status(404).send({ message: '404 page not found' }) })

app.use(errors())

app.use((err, req, res, next) => {
  console.log('ZASHLI V OSHIBKU');

  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message })
  } else {
    res.status(500).send({ message: err.message || "Server error" })
  }
  next()
})

app.listen(3000, () => { console.log('listen 300 port'); });

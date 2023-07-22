const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(router);
app.use('*', (req, res, next) => {
  try {
    throw new NotFoundError('404 page not found');
  } catch (err) {
    next(err);
  }
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message || 'Server error' });
  }
  next();
});

app.listen(3000, () => { console.log('listen 300 port'); });

const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const BadRequest = require('../errors/BadRequest');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  if (!authorization) throw new Unauthorized('Please log in');
  const token = authorization.replace('Bearer ', '');
  try {
    payload = jwt.verify(token, 'unique-secret-key');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') next(new BadRequest('Invalid token'));
    throw new Unauthorized('Please log in');
  }
  req.user = payload;
  next();
};

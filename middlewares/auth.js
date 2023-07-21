const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(413).send('please log in')
  }
  const token = authorization.replace('Bearer ', '')

  let payload;
  try {
    payload = jwt.verify(token, 'unique-secret-key')
  }
  catch (err) {
    if (err.name === 'JsonWebTokenError') return res.status(400).send('invalid token')
    return res.status(403).send('please log in')
  }
  req.user = payload
  console.log("ZALOGINEN");
  next()
}

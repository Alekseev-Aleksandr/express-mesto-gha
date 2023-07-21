const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).send({message:'please log in'})
  }
  const token = authorization.replace('Bearer ', '')

  let payload;
  try {
    payload = jwt.verify(token, 'unique-secret-key')
  }
  catch (err) {
    if (err.name === 'JsonWebTokenError') return res.status(400).send('invalid token')
    return res.status(401).send({message:'please log in'})
  }
  req.user = payload
  next()
}

const User = require('../models/user')

const getAllUser = ('/users', (req, res) => {

  User.find({})
    .then(users => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Server error' }))
})


const getUserById = ('/users/:userId', (req, res) => {

  User.findById(req.params.id)
    .orFail(() => new Error('Not found by id'))
    .then((user) => res.status(200).send(user))

    .catch((err) => {
      if (err.message === 'Not found by id') {
        res.status(404).send({ message: 'User not found with id' })

      } else {
        res.status(500).send({ message: 'Server error' })
      }
    })
})


const createNewUser = ('/users', (req, res) => {

  User.create(req.body)
    .then(user => res.status(200).send(user))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'incorrect data' })
      }
      res.status(500).send({ message: 'Server error' })
    })
})


const updateProfile = ('/users/me', (req, res) => {
  if (!req.body.name) res.status(400).send({ message: 'incorrect data' })

  User.findByIdAndUpdate(req.user._id, { name: req.body.name })
    .orFail(() => new Error('Not found by id'))
    .then(user => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'Not found by id') {
        res.status(404).send({ message: 'User not found with id' })

      } else {
        res.status(500).send({ message: 'Server error' })
      }
    })
})


const updateAvatar = ('/users/me/avatar', (req, res) => {
  if (!req.body.avatar) res.status(400).send({ message: 'incorrect data' })

  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .orFail(() => new Error('Not found by id'))
    .then(user => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'Not found by id') {
        res.status(404).send({ message: 'User not found with id' })

      } else {
        res.status(500).send({ message: 'Server error' })
      }
    })
})

module.exports = { getAllUser, getUserById, createNewUser, updateProfile, updateAvatar }
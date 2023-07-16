const User = require('../models/user')

const getAllUser = ('/users', (req, res) => {

  User.find({})
    .then(users => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Server error' }))
})


const getUserById = ('/users/:userId', (req, res) => {
  console.log(typeof req.params.userId);
  User.findById(req.params.userId)
    .orFail(() => new Error('Not found user by id'))
    .then((user) => res.status(200).send(user))

    .catch((err) => {
      if (err.message === 'Not found user by id') {
        return (res.status(404).send({ message: 'User not found with id' }))

      } else {
        return (res.status(400).send({ message: 'Data entered incorrectly' }))
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
  if (req.body.name.length < 2 ||
    req.body.name.length > 30 ||
    req.body.about.length < 2 ||
    req.body.about.length > 30) {

    res.status(400).send({ message: 'incorrect data' })
  }
  else {
    User.findByIdAndUpdate(req.user._id,
      {
        name: req.body.name,
        about: req.body.about
      },
      { new: true })

      .orFail(() => new Error('Not found by id'))
      .then(user => res.status(200).send({ data: user }))
      .catch((err) => {

        if (err.message === 'Not found by id') {
          res.status(404).send({ message: 'User not found with id' })

        } else {
          res.status(500).send({ message: 'Server error' })
        }
      })
  }
})


const updateAvatar = ('/users/me/avatar', (req, res) => {
  if (!req.body.avatar) {
    res.status(400).send({ message: 'incorrect data' })
  }
  else {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
      .orFail(() => new Error('Not found by id'))
      .then(user => res.status(200).send({ data: user }))
      .catch((err) => {
        if (err.message === 'Not found by id') {
          res.status(404).send({ message: 'User not found with id' })

        } else {
          res.status(500).send({ message: 'Server error' })
        }
      })
  }
})

module.exports = { getAllUser, getUserById, createNewUser, updateProfile, updateAvatar }
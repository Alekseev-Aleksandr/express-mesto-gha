const jwt = require('jsonwebtoken')
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const validator = require('validator')

let error;

const getAllUser = ((req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Server error' }));
});

const getUserById = ((req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError('Not found user by id'))
    .then((user) => res.status(200).send(user))
    .catch(next);
});

const createNewUser = ((req, res, next) => {
  if (!validator.isEmail(req.body.email)) throw new BadRequest("Invalid Email")
  User.createHashByPassword(req.body.password)
    .then((hash) => {
      req.body.password = hash;
      User.create(req.body)
        .then((user) => {
          res.status(201).send({
            "name": user.name,
            "about": user.about,
            "avatar": user.avatar,
            "email": user.email
          })
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(409).send({ message: 'a user with email this already exists' })
          }
        })
    })
});

const updateProfile = ((req, res, next) => {
  User.findByIdAndUpdate(req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    { new: true },
  )
    .orFail(() => new Error('Not found by id'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'Not found by id') {
        res.status(404).send({ message: 'User not found with id' });
      } else {
        res.status(500).send({ message: 'Server error' });
      }
    });
});

const updateAvatar = ((req, res, next) => {
  if (!req.body.avatar) {
    throw new BadRequest('Incorrect data')
  } else {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
      .orFail(() => {
        throw new NotFoundError('Not found user by id')
      })
      .then((user) => res.status(200).send({ data: user }))
      .catch(next)
  }
});

const login = (req, res, next) => {
  const { email, password } = req.body

  User.findUserByCredentials(email, password, next)
    .then((user => {
      const token = jwt.sign({ _id: user.id }, 'unique-secret-key', { expiresIn: "7d" })
      res.status(200).send(({ message: 'All right', token: token }))
    }))
    .catch(next)
}

const getMyInfo = (req, res, next) => {

  User.findById(req.user._id)

    .then((myInfo) => {
      if (!myInfo) {
        throw new NotFoundError('User with id not found')
      }
      res.status(200).send({ myInfo });
    })
    .catch(next)
}

module.exports = {
  getAllUser,
  getUserById,
  createNewUser,
  updateProfile,
  updateAvatar,
  login,
  getMyInfo,
};
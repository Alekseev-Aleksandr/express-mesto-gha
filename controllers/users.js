const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

const Conflict = require('../errors/Conflict');

const getAllUser = ((req, res) => {
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
  User.createHashByPassword(req.body.password)
    .then((hash) => {
      req.body.password = hash;
      User.create(req.body)
        .then((user) => {
          res.status(201).send(
            {
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              email: user.email,
            },
          );
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new Conflict('a user with email this already exists'));
          }
          return next(err);
        });
    }).catch(next);
});

const updateProfile = ((req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    { new: true },
  )
    .orFail(() => {
      next(new NotFoundError('User not found with id'));
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
});

const updateAvatar = ((req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Not found user by id');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
}
);

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password, next)
    .then((user) => {
      const newToken = jwt.sign({ _id: user.id }, 'unique-secret-key', { expiresIn: '7d' });
      res.status(200).send(({ message: 'All right', token: newToken }));
    })
    .catch(next);
};

const getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((myInfo) => {
      if (!myInfo) {
        throw new NotFoundError('User with id not found');
      }
      res.status(200).send({ myInfo });
    })
    .catch(next);
};

module.exports = {
  getAllUser,
  getUserById,
  createNewUser,
  updateProfile,
  updateAvatar,
  login,
  getMyInfo,
};

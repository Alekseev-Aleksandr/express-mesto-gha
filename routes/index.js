const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const auth = require('../middlewares/auth');

const regExp = /^(https?):\/\/[^ "]+$/;
const {
  createNewUser,
  login,
} = require('../controllers/users');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().min(8).required(),
      avatar: Joi.string().pattern(regExp),
    }),
  }),
  createNewUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login,
);

router.use(auth);

router.use(userRoutes);
router.use(cardRoutes);

module.exports = router;

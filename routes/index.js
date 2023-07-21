const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate')
const regExp = /^(https?):\/\/[^ "]+$/;
console.log(regExp.test("http://wya.ru"));
const validator = require('validator')

const {
  createNewUser,
  login,
} = require('../controllers/users');

router.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      email: Joi.string().email({minDomainSegments: 2}).required(),
      password: Joi.string().min(8).required(),
      avatar: Joi.string().pattern(regExp),
    })
      .unknown(true)
  }),
  createNewUser)

router.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().min(2).max(30).required(),
      password: Joi.string().min(8),
    })
      .unknown(true)
  }),
  login)

router.use(auth)

router.use(userRoutes);
router.use(cardRoutes);

module.exports = router;

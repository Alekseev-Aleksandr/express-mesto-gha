const router = require('express').Router();
const regExp = /^(https?):\/\/[^ "]+$/;
const { celebrate, Joi } = require('celebrate')
const {
  getAllUser,
  getUserById,
  updateProfile,
  updateAvatar,
  getMyInfo,

} = require('../controllers/users');


router.get('/users', getAllUser);

router.get('/users/me', getMyInfo)

router.get('/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).required()
    }).unknown(true)
  }),
  getUserById);

router.patch('/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30)
    })
      .unknown(true)
  }),
  updateProfile);

// console.log(regExp.test("https://ya.ru/av2.bm"))

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regExp).required()
  }).unknown(true)
}),
  updateAvatar);

//router.post('/users', createNewUser);

module.exports = router;

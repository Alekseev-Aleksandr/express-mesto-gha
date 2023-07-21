const router = require('express').Router();
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
    headers: Joi.object().keys({
      userId: Joi.string().alphanum().length(24)
    })
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

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string()
  })
}),
  updateAvatar);

//router.post('/users', createNewUser);

module.exports = router;

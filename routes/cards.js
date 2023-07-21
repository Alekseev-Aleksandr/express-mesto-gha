const { celebrate, Joi } = require('celebrate')
const router = require('express').Router();
const {
  getAllCards,
  createNewCard,
  deleteCardById,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards.js');

router.get('/cards', getAllCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().min(2).max(30).required(),
    owner: Joi.string(),
    likes: Joi.string(),
  })
    .unknown(true)
}),
  createNewCard);

router.delete('/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).required()
    }).unknown(true)
  }),
  deleteCardById);

router.put('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).required()
    }).unknown(true)
  }),
  addLikeCard);

router.delete('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).required()
    }).unknown(true)
  }),
  deleteLikeCard);

module.exports = router;

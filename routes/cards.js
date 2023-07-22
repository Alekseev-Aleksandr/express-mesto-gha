const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getAllCards,
  createNewCard,
  deleteCardById,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const regExp = /^(https?):\/\/[^ "]+$/;

router.get('/cards', getAllCards);

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().pattern(regExp).required(),
    }),
  }),
  createNewCard,
);

router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCardById,
);

router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  addLikeCard,
);

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteLikeCard,
);

module.exports = router;

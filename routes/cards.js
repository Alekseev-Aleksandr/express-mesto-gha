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
    owner: Joi.string().required,
    likes: Joi.string().required,
  })
    .unknown(true)
}), createNewCard);

router.delete('/cards/:cardId', deleteCardById);

router.put('/cards/:cardId/likes', addLikeCard);

router.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = router;

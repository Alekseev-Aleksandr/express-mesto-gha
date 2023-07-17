const router = require('express').Router();
const {
  getAllCards,
  createNewCard,
  deleteCardById,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);

router.post('/cards', createNewCard);

router.delete('/cards/:cardId', deleteCardById);

router.put('/cards/:cardId/likes', addLikeCard);

router.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = router;

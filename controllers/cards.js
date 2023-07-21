const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

const getAllCards = ('/cards', (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
});

const createNewCard = ('/cards', (req, res, next) => {
  Card.create({
    ...req.body, owner: req.user._id
  })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Incorect id')
      }
    })
    .catch(next);
});

const deleteCardById = ('/cards/:cardId', (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Not found card by id')
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then((res).status(201).send({ message: "car was deleted" }))
      } else {
        throw new Forbidden('No rights to delete')
      }
    })
    .catch(next);
})

const addLikeCard = ('/cards/:cardId/likes', (req, res, next) => {
  if (!Card.findById(req.params.cardId)) {
    throw new NotFoundError('Not found card by id')
  }
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Not found card by id')
    })
    .then((card) => res.status(200).send(card))
    .catch(next)
});

const deleteLikeCard = ('/cards/:cardId/likes', (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Not found card by id');
    })
    .then((card) => res.status(200).send(card))
    .catch(next)
});

module.exports = {
  getAllCards,
  createNewCard,
  deleteCardById,
  addLikeCard,
  deleteLikeCard,
};

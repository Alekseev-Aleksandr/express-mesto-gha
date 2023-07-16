const Card = require('../models/card')

const getAllCards = ('/cards', (req, res) => {

  Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Server error' }))
})


const createNewCard = ('/cards', (req, res) => {

  Card.create({
    ...req.body, owner: req.user._id
  })
    .then(user => res.status(200).send(user))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'incorrect data' })
      }
      res.status(500).send({ message: 'Server error' })
    })
})


const deleteCardById = ('/cards/:cardId', (req, res) => {
    if(req.params.cardId.length != 24){};
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => new Error('Not found card by id'))

    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'Not found card by id') {
        res.status(400).send({ message: 'Card not found with id' })

      } else {
        res.status(500).send({ message: 'Server error' })
      }
    })
})


const addLikeCard = ('/cards/:cardId/likes', (req, res) => {
  if (!Card.includes(req.params.cardId)) res.status(404).send({ message: 'Card not found with id' })

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((uni) => res.status(200).send(uni))
    .catch(err => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'incorrect data' })
      }
      res.status(500).send({ message: 'Server error' })
    })
})


const deleteLikeCard = ('/cards/:cardId/likes', (req, res) => {

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((uni) => res.status(200).send(uni))
    .catch(err => res.status(500).send(err))
})

module.exports = { getAllCards, createNewCard, deleteCardById, addLikeCard, deleteLikeCard }
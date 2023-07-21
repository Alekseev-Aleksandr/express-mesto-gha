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
  console.log('sda');
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
        console.log("DONE KARLEONE");
        Card.deleteOne(card)
          .then((res).status(201).send({ message: "car was deleted" }))
      } else {
        console.log('fasf');
        throw new Forbidden('No rights to delete')
      }
    })
     .catch((err) => {

       if (err.name === 'CastError') {
        console.log(err);
       }})
    //     throw new BadRequest('Incorect id')
    //   }
    // })
    // .catch(next);
})
// Card.findByIdAndDelete(req.params.cardId)

//   .orFail(() => new Error('Not found card by id'))
//   .then((card) => {
//     console.log(req.params.cardId);
//     res.status(200).send(card);
//   })

//   .catch((err) => {
//     if (err.message === 'Not found card by id') {
//       res.status(404).send({ message: 'Not found card by id' });
//     } else if (err.name === 'CastError') {
//       res.status(400).send({ message: 'incorrect id' });
//     } else res.status(500).send({ message: 'Server error' });
//   });
// });

const addLikeCard = ('/cards/:cardId/likes', (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Not found card by id')
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('incorrect id');
      }
    })
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
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('incorrect id');
      }
    })
    .catch(next)
});

module.exports = {
  getAllCards,
  createNewCard,
  deleteCardById,
  addLikeCard,
  deleteLikeCard,
};

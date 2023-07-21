const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const BadRequest = require('../errors/BadRequest')

function validLink(avatar){
  const reg = /https?:\/\/w+.+#?/;
  return reg.test(avatar)
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate:{} [validLink, 'Input link']
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});
userSchema.statics.findUserByCredentials = function (email, password, next) {

  return this.findOne({ email })
  .select('+password')
    .then((user) => {
      console.log(user);
      if (!user) {
        throw new BadRequest('Invalid password or login')
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BadRequest('Invalid password or login')
          }

          return (user)
        })
        .catch(next)

    })
}
userSchema.statics.createHashByPassword = function (id) {
  return bcrypt.hash(id, 10)
}
module.exports = mongoose.model('user', userSchema);

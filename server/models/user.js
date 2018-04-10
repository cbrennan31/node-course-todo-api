const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 1,
    trim: true,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        validator: validator.isEmail
      },
      message: '{VALUE} is not a valid email!'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.pre('save', function (next) {
  let user = this
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

UserSchema.methods.toJSON = function () {
  let user = this
  return _.pick(user, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
  let user = this
  let access = 'auth'
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString()

  user.tokens = user.tokens.concat({
    access,
    token
  })

  return user.save().then(() => {
    return token
  })
}

UserSchema.methods.removeToken = function (token) {
  let user = this

  return user.update({
    $pull: {
      tokens: {token}
    }
  });

  // const index = user.tokens.findIndex((t) => t.token === token)
  // user.tokens.splice(index, 1)
  //
  // return user.save()
}


UserSchema.statics.findByToken = function (token) {
  let User = this;
  var decoded

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (e) {
    return Promise.reject()
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this

  return User.findOne({
    email: email
  }).then((user) => {
    if (!user) {
      return Promise.reject()
    }

    return new Promise ((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res === true) {
          resolve(user)
        } else {
          reject()
        }
      })
    })
    // this ensures that the resolved promise doesn't return until the callback finishes
    // executing
  })
}

let User = mongoose.model('User', UserSchema)

module.exports = { User };

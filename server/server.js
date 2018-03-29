const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

let { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')
const { authenticate } = require('./middleware/authenticate')

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos', (req, res) => {
  let todos = Todo.find().then((todos) => {
    res.send({todos})
  }, (e) => {
      res.status(400).send(e)
  })
})

app.get('/todos/:id', (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  // if object id is invalid

  let todo = Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    // if object id is valid, but that id is not in the database
    res.send({todo})
  }, (e) => {
    res.status(400).send(e)
  })
})

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  // if object id is invalid

  let todo = Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    // if object id is valid, but that id is not in the database
    res.send({todo})
  }, (e) => {
    res.status(400).send(e)
  })
})

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id
  let body = _.pick(req.body, ['text', 'completed'])
  // comparable strong params

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if (body.completed === true) {
    body.completedAt = new Date().getTime()
  } else {
    body.completedAt = null
  }

  let todo = Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    // if object id is valid, but that id is not in the database
    res.send({todo})
  }, (e) => {
    res.status(400).send(e)
  })
  // if object id is invalid
})

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])
  let user = new User(body)
  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user.toJSON())
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.listen(3000, () => {
  console.log('Started on port 3000')
})

module.exports = {app};

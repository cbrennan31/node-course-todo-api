let express = require('express')
let bodyParser = require('body-parser')
let {ObjectID} = require('mongodb')

let { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

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

  let todo = Todo.findById(req.params.id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    // if object id is valid, but that id is not in the database
    res.send({todo})
  }, (e) => {
    res.status(400).send(e)
  })
})

app.listen(3000, () => {
  console.log('Started on port 3000')
})

module.exports = {app};

const {ObjectID} = require('mongodb')

const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todo')
const {User} = require('../server/models/user')

let id = '5a94e483ae8aab22c879173a'

// let id = '5aa2ccfb82567ab9162fc9af3'
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// })
//
// // analogous to 'where' in active record
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo)
// })

// analogous to 'findby' in active record

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found')
//   }
//   console.log('Todo by id', todo)
// }).catch((e) => console.log(e))

User.findById(id).then((user) => {
  if (!user) {
    return console.log('User not found')
  }
  console.log('User by id', user)
}).catch((e) => console.log(e))
// analogous to 'find' in active record

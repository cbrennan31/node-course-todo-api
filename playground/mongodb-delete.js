const { MongoClient, ObjectID } = require('Mongodb');

// object destructuring: this assigns the value of the MongoClient property to
// the MongoClient variable. Same with ObjectID.

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connecting to MongoDB server')

  // db.collection('Todos').deleteMany({text: 'Eat lunch'})
  // .then((result) => {
  //   console.log(result)
  // })

  db.collection('Users').findOneAndDelete({_id: new ObjectID('5a85ef85b1aa92082f5c6aeb')})
  .then((result) => {
    console.log(result.value)
  })

  // deleteMany
  // deleteOne
  // findOneAndDelete

  // db.close()
})

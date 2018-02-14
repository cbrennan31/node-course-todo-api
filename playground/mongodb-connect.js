const { MongoClient, ObjectID } = require('Mongodb');

// object destructuring: this assigns the value of the MongoClient property to
// the MongoClient variable. Same with ObjectID.

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connecting to MongoDB server')

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err)
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })

  db.collection('Users').insertOne({
    name: 'Casey',
    age: 28,
    location: 'Boston'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err)
    }

    console.log(JSON.stringify(result.ops, undefined, 2))
  })



  db.close()
})

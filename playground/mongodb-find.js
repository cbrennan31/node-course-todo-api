const { MongoClient, ObjectID } = require('Mongodb');

// object destructuring: this assigns the value of the MongoClient property to
// the MongoClient variable. Same with ObjectID.

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connecting to MongoDB server')

  db.collection('Users').find({
    name: "Mike"
  }).toArray()
  .then((docs) => {
    console.log('Users')
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch todos', err)
  })

  // db.close()
})

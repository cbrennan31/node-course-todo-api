const { MongoClient, ObjectID } = require('Mongodb');

// object destructuring: this assigns the value of the MongoClient property to
// the MongoClient variable. Same with ObjectID.

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server')
  }
  console.log('Connecting to MongoDB server')

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a83b32c71b16c16056f0203')
  }, {
    $inc: {
      age: 1
    },
    $set: {
      name: 'Chazz'
    }
  }, {
    returnOriginal: false
  })
  .then(result => {
    console.log(result)
  })

  // db.close()
})

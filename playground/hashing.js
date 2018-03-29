const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')

let data = {
  id: 10
}

let token = jwt.sign(data, '123abc')
console.log(token)
// creates token based on the userID and secret that was passed in
// the secret is important so that another random user can't use the same encoding algorithm
// to recreate the token and represent the same user
let decoded = jwt.verify(token, '123abc')
console.log('decoded', decoded)
// the verify method takes the token and the original randomly generated secret and
// compares it to the original data
// if the token (which includes the secret) matches the original token, the user
// is successfully authenticated


let message = 'I am user number 3'
let hash = SHA256(message).toString()

console.log(`Message: ${message}`)
console.log(`Hash: ${hash}`)

let data = {
  id: 4
}

let token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString()

let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

if (resultHash === token.hash) {
  console.log('Data was not changed')
} else {
  console.log('Data was changed. Do not trust!')
}

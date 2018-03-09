const request = require('supertest')
const expect = require('expect')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [{
  text: 'First todo',
}, {
  text: 'Second todo'
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos)
  }).then(() => done())
})

describe('GET /todos', () => {
  it('should retrieve all todos', (done)  =>  {

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos[0].text).toBe('First todo')
        expect(res.body.todos[1].text).toBe('Second todo')
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'This is a new todo'

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({text}).then((todos) => {
          expect(todos[0].text).toBe(text)
          expect(todos.length).toBe(1)
          done()
        }).catch((e) => done(e))
      })
  })

  it('should not create a new todo if there is bad data', (done) => {

    request(app)
      .post('/todos')
      .send({text: ''})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2)
          done()
        }).catch((e) => done(e))
      })
  })
})

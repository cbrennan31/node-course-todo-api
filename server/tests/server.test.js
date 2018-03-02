const request = require('supertest')
const expect = require('expect')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

beforeEach((done) => {
  Todo.remove({}).then(() => done())
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

        Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0)
          done()
        }).catch((e) => done(e))
      })
  })
})

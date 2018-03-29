const _ = require('lodash')
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

describe('GET /todos/:id', () => {
  it('should retrieve a single todo by its id', (done) => {
    Todo.findOne({text: 'First todo'}).then((todo) => {
      let id = todo.id
      request(app)
        .get(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe('First todo')
        })
        .end(done)
    })
  })

  it('should return a response status of 404 if the record is not found', (done) => {
    request(app)
      .get('/todos/6aa6c04524ac284097ec7758')
      .expect(404)
      .end(done)
  })

  it('should return a response status of 404 if the ObjectId is not valid', (done) => {
    request(app)
      .get('/todos/6aa6c04524ac284097ec7758e')
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should delete a single todo by its id', (done) => {
    Todo.findOne({text: 'First todo'}).then((todo) => {
      let id = todo.id
      request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe('First todo')
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          Todo.findById(id).then((todo) => {
            expect(todo).toBe(null)
            done()
          }).catch((e) => done(e))
        })
    })
  })

  it('should return a response status of 404 if the record is not found', (done) => {
    request(app)
      .get('/todos/6aa6c04524ac284097ec7758')
      .expect(404)
      .end(done)
  })

  it('should return a response status of 404 if the ObjectId is not valid', (done) => {
    request(app)
      .get('/todos/6aa6c04524ac284097ec7758e')
      .expect(404)
      .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should update a single todo by its id', (done) => {
    Todo.findOne({text: 'First todo'}).then((todo) => {
      let id = todo.id
      request(app)
        .patch(`/todos/${id}`)
        .send({text: 'First todo updated', completed: true})
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe('First todo updated')
          expect(res.body.todo.completed).toBe(true)
          expect(res.body.todo.completedAt).toNotBe(null)
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }

          Todo.findById(id).then((todo) => {
            expect(res.body.todo.text).toBe('First todo updated')
            expect(res.body.todo.completed).toBe(true)
            expect(res.body.todo.completedAt).toNotBe(null)
            done()
          }).catch((e) => done(e))
        })
    })
  })

  it('should return a response status of 404 if the record is not found', (done) => {
    request(app)
      .get('/todos/6aa6c04524ac284097ec7758')
      .expect(404)
      .end(done)
  })

  it('should return a response status of 404 if the ObjectId is not valid', (done) => {
    request(app)
      .get('/todos/6aa6c04524ac284097ec7758e')
      .expect(404)
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

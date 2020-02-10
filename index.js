const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('build'))

app.use(express.json())
app.use(cors())

morgan.token('person', (req) => { return JSON.stringify(req.body) })

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.person(req)
    ].join(' ')
}, {
    skip: (req, res) => {
        return req.method !== 'POST'
    }
}

))



let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1,
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2,
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3,
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4,
    },
    {
        name: "Mallikas",
        number: "12345678",
        id: 5,
    }
]





app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(`<p> Phonebook has info for ${persons.length} people </p> <p> ${Date()} </p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    /* const id = Number(request.params.id)
     const person = persons.find(person => person.id === id)
 
     if (person) {
         response.json(person)
     } else {
         response.status(404).end()
     }*/

    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))


    /* Person.findById(request.params.id).then(person => {
         response.json(person.toJSON())
       })
       .catch(error => {
         console.log(error);
         response.status(404).end()
       })*/

})

app.delete('/api/persons/:id', (request, response, next) => {
    /*const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()*/

    /* const id = Number(request.params.id)
     persons = persons.filter(person => person.id !== id)
 
     response.status(204).end()*/

    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})



app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    /*const person = {
        name: body.name,
        number: body.number,
       // id: Math.floor(Math.random() * 1000000)
    }*/

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })


    //persons = persons.concat(person)

    //response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
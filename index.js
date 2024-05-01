require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/person')


let contacts = []

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
app.use(morgan('tiny'))

app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })
})

app.get('/api/info', (request, response) => {
    /*const result = [
        `<p>Phonebook has info for ${contacts.length} people</p><br/>`,
        `<p>${new Date()}</p>`
    ]*/
    Contact.find({}).then(contacts => {
        const res = `<p>Phonebook has info for ${contacts.length} people</p><br/><p>${new Date()}</p>`
        response.send(res)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Contact.findById(request.params.id).then(contact => {
        response.json(contact)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Contact.findByIdAndDelete(request.params.id)
    .then(contact => {
        response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const contact = new Contact({
        name: body.name,
        number: body.number,
    })

    contact.save()
        .then(savedContact => {
            response.json(savedContact)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
    const {name, number} = request.body

    Contact.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators: true, context: 'query'})
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
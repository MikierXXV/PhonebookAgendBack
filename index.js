const express = require('express')
const app = express()

let contacts = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
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
    response.json(contacts)
})

app.get('/api/info', (request, response) => {
    /*const result = [
        `<p>Phonebook has info for ${contacts.length} people</p><br/>`,
        `<p>${new Date()}</p>`
    ]*/
    const res = `<p>Phonebook has info for ${contacts.length} people</p><br/><p>${new Date()}</p>`
    response.send(res)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = contacts.length > 0
        ? Math.max(...contacts.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    
    const found = contacts.find(contact => contact.name === body.name)
    if (found) {
        return response.status(400).json({
            error: 'The name already exists in the agenda'
        })
    }
    const contact = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    contacts = contacts.concat(contact)
    response.json(contact)
})


app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
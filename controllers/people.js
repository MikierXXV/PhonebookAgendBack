const peopleRouter = require('express').Router()
const Contact = require('../models/person')

peopleRouter.get('/persons', (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })
})

peopleRouter.get('/info', (request, response) => {
    /*const result = [
        `<p>Phonebook has info for ${contacts.length} people</p><br/>`,
        `<p>${new Date()}</p>`
    ]*/
    Contact.find({}).then(contacts => {
        const res = `<p>Phonebook has info for ${contacts.length} people</p><br/><p>${new Date()}</p>`
        response.send(res)
    })
})

peopleRouter.get('/persons/:id', (request, response) => {
    Contact.findById(request.params.id).then(contact => {
        response.json(contact)
    })
})

peopleRouter.delete('/persons/:id', (request, response) => {
    Contact.findByIdAndDelete(request.params.id)
    .then(contact => {
        response.status(204).end()
    })
    .catch(error => next(error))
})


peopleRouter.post('/persons', (request, response, next) => {
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

peopleRouter.put('/persons/:id', (request, response) => {
    const {name, number} = request.body

    Contact.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators: true, context: 'query'})
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
})

module.exports = peopleRouter

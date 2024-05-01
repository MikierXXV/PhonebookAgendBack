const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://miguelgutierrezcn:${password}@cluster0.qxxwpep.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

  mongoose.set('strictQuery',false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})


const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
})

if (process.argv.length < 2 || process.argv.length > 5) {
    console.log('Please provide the arguments in the following format: node mongo.js <password> <name> <number>')
    process.exit(1)
}

if (process.argv.length === 3) {
    Contact.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(contact => {
            console.log(contact.name, contact.number)
        })
        mongoose.connection.close()
    })
    return
}

contact.save().then(result => {
    console.log('contact saved!')
    console.log(result)
    mongoose.connection.close()
})

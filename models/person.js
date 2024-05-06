const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{5,}$/.test(v) && v.replace(/-/g, '').length >= 8;
      },
      message: props => `${props.value} is not a valid phone number! Please use the format: 123-45678`
    }
  },
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)
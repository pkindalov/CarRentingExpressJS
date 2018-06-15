const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let carSchema = new mongoose.Schema({
  model: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  image: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  pricePerDay: {type: Number, required: REQUIRED_VALIDATION_MESSAGE},
  rentedDays: {type: Number, default: 0},
  startRentingDate: {type: Date},
  note: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  isCarRented: {type: Boolean, required: REQUIRED_VALIDATION_MESSAGE},
  dateOfPublication: {type: Date, default: new Date()},
  addedBy: [{type: ObjectId, ref: 'User'}]
})

let Car = mongoose.model('Car', carSchema)

module.exports = Car

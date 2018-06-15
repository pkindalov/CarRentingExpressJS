const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let rentHistory = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'},
  carModel: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  rentStartedDate: {type: Date},
  daysOfRent: {type: Number, required: REQUIRED_VALIDATION_MESSAGE},
  totalSumPaidInDollars: {type: Number, required: REQUIRED_VALIDATION_MESSAGE},
  pricePerDayInDollars: {type: Number, required: REQUIRED_VALIDATION_MESSAGE}
})

let RentHistory = mongoose.model('RentHistory', rentHistory)

module.exports = RentHistory

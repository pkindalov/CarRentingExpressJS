const Car = require('../data/Car')
const User = require('../data/User')

module.exports = {
  addCarGet: (req, res) => {
    res.render('cars/addCar')
  },

  addCarPost: (req, res) => {
    let reqBody = req.body
    let userId = req.user.id

    let carModel = reqBody.model
    let carImage = reqBody.image
    let carPricePerDay = reqBody.pricePerDay
    let carRentedDays = 0
    let carNote = reqBody.note
    let isThisCarRented = false
    let carDateOfPublication = new Date()
    let carAddedBy = userId

    Car
        .create({
          model: carModel,
          image: carImage,
          pricePerDay: carPricePerDay,
          rentedDays: carRentedDays,
          note: carNote,
          isCarRented: isThisCarRented,
          dateOfPublication: carDateOfPublication,
          addedBy: carAddedBy
        }).then(car => {
          User
            .findById(carAddedBy)
            .then(user => {
              user.addedCars.push(car._id)
              user.save()
            })
        })
    res.redirect('/')
  },

  searchCarByModel: (req, res) => {
    let model = req.query.car
    // let pageSize = 2
    let page = parseInt(req.query.page) || 1

    Car
      .find({'model': model, 'isCarRented': false})
      // .skip((page - 1) * pageSize)
      // .limit(pageSize)
      .then(cars => {
        // console.log(cars)
        for (let car of cars) {
          if (car.note.length > 15) {
            car.shortDescription = (car.note.substring(0, 15)) + '...'
          }
        }

        res.render('cars/searchResults', {
          cars: cars,
          noResults: cars.length === 0,
          searchedCar: model,
          hasPrevPage: page > 1,
          hasNextPage: cars.length > 0,
          prevPage: page - 1,
          nextPage: page + 1
        })
      })
  },

  searchMoreResults: (req, res) => {
    let model = req.query.car
    let pageSize = 2
    let page = parseInt(req.query.page) || 1

    Car
      .find({'model': model, 'isCarRented': false})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(cars => {
        // console.log(cars)
        for (let car of cars) {
          if (car.note.length > 15) {
            car.shortDescription = (car.note.substring(0, 15)) + '...'
          }
        }

        res.render('cars/searchResults', {
          cars: cars,
          noResults: cars.length === 0,
          searchedCar: model,
          hasPrevPage: page > 1,
          hasNextPage: cars.length > 0,
          prevPage: page - 1,
          nextPage: page + 1
        })
      })
  },

  getCarByIdGET: (req, res) => {
    let carId = req.query.car

    Car
      .findById(carId)
      .then(car => {
        // console.log(car)
        res.render('cars/carDetails', {
          car: car
        })
      })
  },

  deleteCarByIdGET: (req, res) => {
    let carId = req.query.id

    Car
      .findByIdAndRemove(carId)
      .then(deletedCar => {
        User
            .find({})
            .then(users => {
              for (let user of users) {
                let carPos = user.addedCars.indexOf(deletedCar._id)
                user.addedCars.splice(carPos)
                user.rentedCars.splice(carPos)
                user.save()
              }
            })
      })
    res.redirect('/')
  },

  rentCarGET: (req, res) => {
    let carId = req.params.id

    Car
      .findById(carId)
      .then(carForRent => {
        res.render('cars/rentCar', {
          car: carForRent
        })
      })
  },

  rentCarPOST: (req, res) => {
    let carId = req.params.id
    let reqBody = req.body
    let carRentedDays = reqBody.daysOfRent
    let user = req.user.id

    Car
        .findById(carId)
        .then(car => {
          car.isCarRented = true
          car.rentedDays = parseInt(carRentedDays)
          car.save()

          User
            .findById(user)
            .then(user => {
              // console.log(user)
              user.rentedCars.push(car._id)
              user.save()
            })
        })
    res.redirect('/')
  }
}

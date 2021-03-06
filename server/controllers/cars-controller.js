const Car = require('../data/Car')
const User = require('../data/User')
const RentHistory = require('../data/RentHistory')

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
          addedBy: carAddedBy,
          likes: []
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
    let pageSize = 2
    let page = parseInt(req.query.page) || 1

    Car
      .find({$text: {$search: model}, 'isCarRented': false})
      // .find({'model': model, 'isCarRented': false})
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
    let rightToVote = true
    let currentUser

    try {
      if (req.user.id) {
        currentUser = req.user.id
      }
    } catch (ex) {

    }

    Car
      .findById(carId)
      // .populate('likes')
      .then(car => {
        // console.log(car)
        if (currentUser) {
          // console.log(car.likes)
          let likeOrNot = car.likes.indexOf(currentUser) > -1
          if (likeOrNot) {
            rightToVote = false
          }
        }

        res.render('cars/carDetails', {
          car: car,
          noLikes: car.likes.length === 0,
          likesCount: car.likes.length,
          rightToVote: rightToVote
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

                if (user.likes.indexOf(deletedCar._id) > -1) {
                  let carIdPosLikes = user.likes.indexOf(deletedCar._id)
                  user.likes.splice(carIdPosLikes)
                }
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
          car.startRentingDate = new Date()
          car.rentedBy = user
          car.save()

          User
            .findById(user)
            .then(user => {
              // console.log(user)
              user.rentedCars.push(car._id)
              user.save()

              RentHistory
                .create({
                  user: user,
                  carModel: car.model,
                  rentStartedDate: car.startRentingDate,
                  daysOfRent: car.rentedDays,
                  totalSumPaidInDollars: car.rentedDays * car.pricePerDay,
                  pricePerDayInDollars: car.pricePerDay,
                  carImage: car.image
                })
            })
        })
    res.redirect('/')
  },

  listAllCars: (req, res) => {
    let pageSize = 10
    let page = parseInt(req.query.page) || 1

    Car
      .find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(cars => {
        res.render('cars/listAllCars', {
          cars: cars,
          hasPrevPage: page > 1,
          hasNextPage: cars.length > 0,
          prevPage: page - 1,
          nextPage: page + 1
        })
      })
  },

  editCarByIdGET: (req, res) => {
    let carId = req.query.id

    Car
        .findById(carId)
        .then(car => {
          res.render('cars/editCar', {
            car: car
          })
        })
  },

  editCarByIdPOST: (req, res) => {
    let carId = req.query.id
    let reqBody = req.body
    let editedModel = reqBody.model
    let editedImage = reqBody.image
    let editedPricePerDay = reqBody.pricePerDay
    let editedNote = reqBody.note

    Car
      .findById(carId)
      .then(car => {
        car.model = editedModel
        car.image = editedImage
        car.pricePerDay = editedPricePerDay
        car.note = editedNote
        car.save()
      })

    res.redirect('/')
  },

  stopRentingCarByIdGET: (req, res) => {
    let carId = req.query.car
    let user = req.user.id

    Car
      .findById(carId)
      .then(car => {
        car.isCarRented = false
        car.save()

        User
          .findById(car.rentedBy)
          .then(user => {
            let pos = user.rentedCars.indexOf(car._id)
            user.rentedCars.splice(pos)
            user.save()
          })

          // Car
          //   .findById(carId)
          //   .then(car => {
          //     car.
          //   })

        res.redirect('/listAllCars')
      })
  },

  dislikeCarGET: (req, res) => {
    let carId = req.query.car
    let userId = req.user.id

    Car
      .findById(carId)
      .then(car => {
        if (car.likes.indexOf(userId) === -1) {
          return 'No such user in car likes'
        }

        let pos = car.likes.indexOf(userId)
        car.likes.splice(pos)
        car.save()

        User
          .findById(userId)
          .then(user => {
            if (user.likes.indexOf(car._id) === -1) {
              return 'No such car in user likes'
            }

            let carPos = user.likes.indexOf(car._id)
            user.likes.splice(carPos)
            user.save()

            res.redirect('/')
          })
      })
  }
}

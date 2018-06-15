const Car = require('../data/Car')
const helpers = require('../utilities/helpers')

module.exports = {
  index: (req, res) => {
    let pageSize = 10
    let page = parseInt(req.query.page) || 1

    Car
      .find({'isCarRented': true})
      .then(allCars => {
        for (let car of allCars) {
          let startRentDay = helpers.extractDayNumber(car.startRentingDate)
          let endRentDay = startRentDay + car.rentedDays
          let month = helpers.extractMonthNumber(car.startRentingDate)
          let monthNow = helpers.extractMonthNumber(new Date())

          // if (startRentDay + endRentDay > 31) {
          //   endRentDay = (startRentDay + endRentDay) - 31
          //   month++
          //   car.isCarRented = false
          //   car.save()
          //   return
          // }

          if (month < monthNow) {
            car.isCarRented = false
            car.save()
            return
          }

          let monthStr = '' + month
          if (month < 10) {
            monthStr = '0' + month
          }

          let year = helpers.extractYearNumber(car.startRentingDate)

          let endingRentDate = '' + year + '-' + monthStr + '-' + endRentDay

          let today = helpers.extractDateWithoutTime(new Date())
          // let debug = ''

          if (endingRentDate === today) {
            car.isCarRented = false
            car.save()
            return
          }
        }
      })

    Car
      .find({'isCarRented': false})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(cars => {
        res.render('home/index', {
          cars: cars,
          hasPrevPage: page > 1,
          hasNextPage: cars.length > 0,
          nextPage: page + 1,
          prevPage: page - 1
        })
      })
  },

  about: (req, res) => {
    res.render('home/about')
  }
}

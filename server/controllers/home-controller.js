const Car = require('../data/Car')

module.exports = {
  index: (req, res) => {
    let pageSize = 10
    let page = parseInt(req.query.page) || 1

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

const encryption = require('../utilities/encryption')
const User = require('../data/User')
const Car = require('../data/Car')
const RentHistory = require('../data/RentHistory')
// const Thread = require('mongoose').model('Thread')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },

  registerPost: (req, res) => {
    let reqUser = req.body

    // add validations
    // (if reqUser.username.length < 3)...

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },

  loginPost: (req, res) => {
    let reqUser = req.body
    User
      .findOne({ username: reqUser.username }).then(user => {
        if (!user) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        req.logIn(user, (err, user) => {
          if (err) {
            res.locals.globalError = err
            res.render('users/login')
          }

          res.redirect('/')
        })
      })
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },

  getUserProfile: (req, res) => {
    // let userName = req.params.username
    let page = parseInt(req.query.page) || 1
    let pageSize = 10

    let id = req.user.id

    RentHistory
      .find({'user': id})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(histories => {
        // console.log(histories)
        res.render('users/profile', {
          history: histories,
          noResults: histories.length === 0,
          hasPrevPage: page > 1,
          hasNextPage: histories.length > 0,
          prevPage: page - 1,
          nextPage: page + 1
        })
      })
  },

  userRentHistoryGET: (req, res) => {
    let user = req.query.user
    if (user) {
      let users = []
      let page = parseInt(req.query.page) || 1
      let pageSize = 2

      let currentUser = req.user.id
      User
        .find({'_id': {$ne: currentUser}})
        .then(usersResult => {
          for (let i = 0; i < usersResult.length; i++) {
            users[i] = usersResult[i]
          }
        })

      RentHistory
        .find({'user': user})
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .then(results => {
          res.render('users/rentHistory', {
            user: user,
            users: users,
            rentHistory: results,
            hasPrevPage: page > 1,
            hasNextPage: results.length > 0,
            prevPage: page - 1,
            nextPage: page + 1
          })
        })
    } else {
      let currentUser = req.user.id
      User
        .find({'_id': {$ne: currentUser}})
        .then(users => {
          res.render('users/rentHistory', {
            users: users
          })
        })
    }
  },

  likeCarAdvert: (req, res) => {
    let currentUser = req.user.id
    let carId = req.query.car

    Car
      .findById(carId)
      .then(car => {
        let posOfCar = car.likes.indexOf(currentUser)
        if (car.likes.indexOf(currentUser) < 0) {
          car.likes.push(currentUser)
          car.save()
        }

        User
          .findById(currentUser)
          .then(user => {
            if (user.likes.indexOf(car._id) < 0) {
              // user.likes[user.likes.length - 1] = car._id
              user.likes.push(car._id)
              user.save()
            }
          })

        res.redirect('/')

        // res.redirect(`/carDetails?car=${{carId}}`)
        // res.redirect(`/carDetails?car=${{carId}}`)
      })
  },

  usersLikedCarPost: (req, res) => {
    let carId = req.query.car
    let page = parseInt(req.query.page) || 1
    let pageSize = 1

    Car
      .findById(carId)
      .populate('likes')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(car => {
        res.render('users/likedCarPosts', {
          car: car,
          users: car.likes,
          hasPrevPage: page > 1,
          hasNextPage: car.likes.length > 0,
          prevPage: page - 1,
          nextPage: page + 1
        })
      })
  },

  showUserLikes: (req, res) => {
    let userId = req.query.id

    User
      .findById(userId)
      .populate('likes')
      .then(user => {
        // console.log(user)
        res.render('users/userLikes', {
          user: user
        })
      })
  }

}

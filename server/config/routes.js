const controllers = require('../controllers')
const auth = require('../config/auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', auth.isAuthenticated, controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)

  app.get('/addCar', auth.isInRole('Admin'), controllers.cars.addCarGet)
  app.post('/addCar', auth.isInRole('Admin'), controllers.cars.addCarPost)
  app.get('/search', controllers.cars.searchCarByModel)
  app.get('/searchMoreResults', controllers.cars.searchMoreResults)
  app.get('/carDetails', controllers.cars.getCarByIdGET)
  app.get('/deleteCar', auth.isInRole('Admin'), controllers.cars.deleteCarByIdGET)
  app.get('/cars/rent/:id', auth.isAuthenticated, controllers.cars.rentCarGET)
  app.post('/cars/rent/:id', auth.isAuthenticated, controllers.cars.rentCarPOST)
  app.get('/listAllCars', auth.isInRole('Admin'), controllers.cars.listAllCars)
  app.get('/editCar', auth.isInRole('Admin'), controllers.cars.editCarByIdGET)
  app.post('/editCar', auth.isInRole('Admin'), controllers.cars.editCarByIdPOST)
  app.get('/users/me', auth.isAuthenticated, controllers.users.getUserProfile)
  app.get('/stopRenting', auth.isInRole('Admin'), controllers.cars.stopRentingCarByIdGET)
  app.get('/rentHistory', auth.isInRole('Admin'), controllers.users.userRentHistoryGET)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not found')
    res.end()
  })
}

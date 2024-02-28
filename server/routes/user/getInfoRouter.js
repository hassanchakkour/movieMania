const {
  getInfoUser
 } = require('../../controllers/user/getInfoUserController.js')

const router = require('express').Router

const userInfoRouter = router()


userInfoRouter.get('/info', getInfoUser)


// moviesRouter.post('/', getMoviesByGenre)

module.exports = userInfoRouter

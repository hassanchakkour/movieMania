const {
    upComing,
    getUpcomingMoviesByGenre
 } = require('../../controllers/user/getNewsController')

const router = require('express').Router

const upcomingMovies = router()

upcomingMovies.get('/', upComing)

// upcomingMovies.post('/', getUpcoingMoviesByGenre)

module.exports = upcomingMovies
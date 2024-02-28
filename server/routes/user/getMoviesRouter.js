const {
    
    getAllMovies,
    getMoviesByGenre,
    likeMovieById,
    subscribeToMovieById,
    getMovieById,
    getAllSubscribedMovies,

 } = require('../../controllers/user/getMoviesController.js')

const router = require('express').Router

const moviesRouter = router()

moviesRouter.get('/', getAllMovies)

moviesRouter.get('/subscribed', getAllSubscribedMovies)

moviesRouter.post('/', getMovieById)

moviesRouter.post('/like', likeMovieById )

moviesRouter.post('/subscribe', subscribeToMovieById)

moviesRouter.post('/', getMoviesByGenre)

module.exports = moviesRouter
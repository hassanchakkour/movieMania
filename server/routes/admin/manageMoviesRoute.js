const {
    getMovie,
    getMovies,
    addMovie,
    updateMovie,
    deleteMovie,
    findMovie
} = require('../../controllers/admin/manageMoviesController.js')
const Router = require('express').Router;
 
// initialize express router
const moviesRouter = Router();

// GET request for one movie (specified by its ID)
moviesRouter.get('/:id', getMovie);

// GET request for a list of all movies
moviesRouter.get('/', getMovies);


moviesRouter.post('/search', findMovie)

// POST request to add a movie
moviesRouter.post('/add', addMovie);

// PUT request to update a movie 
moviesRouter.put('/:id/update', updateMovie);

// DELETE request to delete a movie
moviesRouter.post('/delete', deleteMovie);

module.exports = moviesRouter;
const {
    addLikedMovie,
    removeLikedMovie,
    getAllMoviesFromDB,
    getUserLikedMoviesFromDB,
    getUserInfo
} = require('../../controllers/user/getLikedMoviesController.js')

const Router = require('express').Router;
const likedMoviesRouter = Router();


likedMoviesRouter.put('/:userId/:movieId/addLike',addLikedMovie);


likedMoviesRouter.put('/:userId/:movieId/removeLike',removeLikedMovie)


likedMoviesRouter.get('/session/movies',getAllMoviesFromDB)


likedMoviesRouter.get('/likedMovies',getUserLikedMoviesFromDB)

likedMoviesRouter.get('/info', getUserInfo)


module.exports = likedMoviesRouter;
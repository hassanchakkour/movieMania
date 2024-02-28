const {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
} = require('../../controllers/admin/manageUsersController.js')

const Router = require('express').Router;
 
// initialize express router
const usersRouter = Router();

// GET request for a list of all users 
usersRouter.get('/', getUsers);

// GET request for one user (specified by its ID)
usersRouter.get('/:id', getUser);

// POST request to add a user
usersRouter.post('/add', addUser);

// PUT request to update a user
usersRouter.put('/:id/update', updateUser);

// DELETE request to delete a user
usersRouter.delete('/:id/delete', deleteUser);

module.exports = usersRouter;
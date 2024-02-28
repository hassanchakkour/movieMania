const router = require('express').Router
const loginRouter = router()
const {
    loginFunc
} = require('../controllers/loginController.js')

loginRouter.post('/', loginFunc)

module.exports = loginRouter


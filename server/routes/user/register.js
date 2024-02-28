const router = require('express').Router
const path = require('path')
const registerRouter = router()
const multer = require('multer')
 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../../../img')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
  })
  
const upload = multer({storage: storage})

const {
    getUserInfo,
    payments,
    makePayment
} = require('../../controllers/user/registerController.js')

registerRouter.post('/',  upload.single('image'), getUserInfo)

registerRouter.get('/payments', payments)

registerRouter.post('/payments', makePayment)

module.exports = registerRouter


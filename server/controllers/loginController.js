const extentions = require('../helper/extensions.js')
const userSchema = require('../models/userSchema')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const extensions = require('../helper/extensions.js')
const { v4: uuidv4 } = require('uuid')


dotenv.config({path:'../../.env'})

const {
    adminUserName,
    adminPassword,
    jwtSecret
} = process.env


const loginFunc = async (req, res, next) => {
    
    const user = {
        email: req.body.email,
        password: extentions.hashString(req.body.password)
    }

    if(user.email == adminUserName && user.password == extentions.hashString(adminPassword)){

        jwt.sign({user: user, role: 'admin'}, jwtSecret, (err, token) => {
            // session.currentUserInfo = user
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
            res.json('admin')
            // res.status(201).json(token)
        })
       
    }else{

    let results = await userSchema.find({
        email: user.email,
        password: user.password
    },{
        _id:1,
        likedMovies: 1
    })
    

    
    if(results.length == 1){
        
    //TODO rework the login with cookies and sessions, Save User info

        let subscribedMovies 

        await extensions.getThisMonthEnrolledMovies(user.email).then( async (data) => {
            subscribedMovies = data
        })


        jwt.sign({user: user, role: 'user'}, jwtSecret, async  (err, token) => {

            let uniqueId = uuidv4()

            await res.cookie('uuid', `${uniqueId}`, { httpOnly: true})

            req.session[uniqueId] =  {
                _id: results[0]._id,
                email: user.email,
                subscribedMovies: subscribedMovies,
                likedMovies: results[0].likedMovies
            }
            
            res.cookie('jwt', token, { httpOnly: true})
            res.json(true)
            // res.status(201).json(token)
        })
       

    }else{
        return res.json(false)
        // res.status(404).send("User Not Found Please try again later")
    }  
}}

module.exports = {
    loginFunc
}
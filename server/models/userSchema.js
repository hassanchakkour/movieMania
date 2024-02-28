const validate = require('./../helper/modulesHelper.js')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
       required: true
    },
    age: {
        type: Number,
    //   required: true
    },
    gender: {
        type: String,
    //     enum: ["male", "female"]
    //    required: true
    },
    password: {
        type: String,
    //    required: true
    },
    registrationDate: {
        type: Date,
        default: new Date().toISOString().split('T')[0]
    },
    email: {
        type: String,
     //  required: true
    },
    bundlesId: {
        type: [String],
    },
    likedMovies: {
        type: [String]
    },
    enrolledMovies: {
        type: [String]
    },
    imageId: {
        type: String
    }
})


userSchema.pre('save', async function(next) {
    let firstName = this.firstName
    let lastName = this.lastName
    let password = this.password
    let age = this.age
    let email = this.email
    
    validate.validateName(firstName).then( (response) => {
        response == false && next(new Error("Error: First Name Don't Match Validation rules"))
    })

    validate.validateName(lastName).then( (response) => {
        response == false && next(new Error("Error: Last Name Don't Match Validation rules"))
    })

    // validate.validatePassword(password).then( (response) => {
    //     response == false && next(new Error("Error: Password Don't Match Validation rules"))
    // })

    // validate.validateAge(age).then( (response) => {
    //     response == false && next(new Error("Error: Age Don't match Validation rules"))
    // })

    validate.validateEmail(email).then( (response) => {
        response == false && next(new Error("Error: Email Don't match Validation rules"))
    })

    console.log("user created")
    next()
})


module.exports = mongoose.model('User',userSchema)
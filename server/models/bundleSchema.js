const mongoose = require('mongoose')

const bundeleSchema = new mongoose.Schema({

    title: { 
        type: String,
        required: true,
        trim: true
    },
    movieLimit: { 
        type: Number, 
        required: true,
        trim: true    
    },
    price: { 
        type: Number, 
        required: true, 
        trim: true
    }
})

module.exports = mongoose.model('bundle', bundeleSchema)
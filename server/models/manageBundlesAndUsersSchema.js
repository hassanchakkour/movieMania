const mongoose = require('mongoose')
const modulesHelper = require('../helper/modulesHelper.js')
const extensions = require('../helper/extensions.js')

const manageBundlesAndUsersSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    bundleId: {
        type: String,
        required: true
    },
    startBundleDate:{
        type: String,
        default: new Date().toISOString().split('T')[0]
    },
    endBundleDate:{
        type: String,
        default: modulesHelper.getNextMonthDate()
    },
    numberOfMoviesLeft:{
        type: Number
    },
    enrolledMoviesId:{
        type: [String]
    }
})

module.exports = mongoose.model('manageBundlesAndUsers', manageBundlesAndUsersSchema)
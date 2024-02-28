const extensions = require('../../helper/extensions.js')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const session = require('express-session')
const userSchema = require('../../models/userSchema.js')
const manageBundleUserSchema = require('../../models/manageBundleUserSchema.js')
const userInfoRouter = require('../../routes/user/getInfoRouter.js')
dotenv.config({path: __dirname + '/../../../.env'})
const helperFunction = require('../../helper/modulesHelper')

const {
    dbPort,
    dbHost,
    dbName,
    serverPort,
    sessionSecret,
    jwtSecret
} = process.env

 async function getInfoForUserById(){
         try{
            const results = await userSchema.find(
                {
                     _id: session.currentUserInfo[0]._id
                },{
                    firstName: 1,
                     lastName:1,
                      age: 1,
                      gender:1,
                      password:1,
                      registrationDate:1,
                      email:1,
                      bundlesId:1,
                      likedMovie:1,
                      enrolledMovies:1
                    })
                    return results
            }
         catch(error){
                     console.log(error.message)
                     }
            }

const getInfoUser = async (req , res) => {

    try {
        const userInfo = session.currentUserInfo
        const userId = userInfo._id
        const bundlesId = userInfo.bundlesId
        // let MBAU = session.currentManageBundleAndUser
        let MBAU = [{EndBundleDate:'25/6/2022'}]
        let availableBundle = []
        
        for(let i = 0 ; i < MBAU.length ; i++) {
            let getCurrentDate = helperFunction.getCurrentDate();
            let getBundleDate = MBAU[i].EndBundleDate;
            console.log(getCurrentDate)
            console.log(getBundleDate)
            
            if(helperFunction.firstDateIsGreater (getBundleDate,getCurrentDate))
                {
                    availableBundle.push(MBAU[i])
                }
            }

            let userInformation 
            await getInfoForUserById().then((results) =>{
                userInformation = results
            }) 

            let returnObject = {
                bundles: availableBundle,
                userInfo: userInformation
            }
        
          res.send(returnObject)
        }
    catch(error){
        console.log(error.message)
    }
}

module.exports = {getInfoUser}









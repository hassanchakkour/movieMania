const session = require('express-session')
const userSchema = require('../models/userSchema.js')
const bundleSchema = require('../models/bundleSchema.js')
const manageBundlesAndUsers = require('../models/manageBundlesAndUsersSchema.js')
const axios = require('axios')
const dotenv = require('dotenv')
const crypto = require('crypto');
const modulesHelper = require('./modulesHelper.js')
const manageBundlesAndUsersSchema = require('../models/manageBundlesAndUsersSchema.js')
const movieSchema = require('../models/movieSchema.js')
const hashType = 'sha1'
const encodeAs = 'hex'

dotenv.config({path: __dirname + '/../../.env'})

const {
    backdropPath,
    movieApi,
    apiKey,
    accountEmail,
    emailPassword
} = process.env


// <-------- String -------->


function hashString(str){
    try{
        const hash = crypto.createHash(hashType).update(str).digest(encodeAs);
        return hash
    }
    catch(err){
        console.log(err.message)
    }
}


// <-------- Session -------->


function sessionHaveMovies(){
    try{
        const results = session.currentUserMovies
        return results != undefined
    }
    catch(err){
        console.log(err.message)
        return false
    }
}

    function sessionHaveUpcomingMovies(){
        try{
            const results = session.currentUserUpcomingMovies
            return results != undefined
        }
        catch(err){
            console.log(err.message)
            return false
        }
    }



// <-------- API -------->


async function getAllMoviesId(){
    let moviesId = []


    for(let i = 0 ; i < 5 ;i++){
        const getAllMovies = {
            method: 'GET',

            // https://api.themoviedb.org/3/discover/movie?api_key=<<api_key>>

            url: `${movieApi}discover/movie?api_key=${apiKey}&page=${i+1}`,
                headers: {
                    'X-RapidAPI-Key': 'b430c9dc9cmsh98401db1637b694p116976jsnfaeb2c0dc52d',
                    'X-RapidAPI-Host': 'movies-app1.p.rapidapi.com' 
                } ,
              //  port:8080
         }
        await axios.request(getAllMovies).then(function (response){
            let data = response.data['results']
    
            for(let i = 0 ; i < data.length ; i++){
                moviesId.push(data[i]['id'])
            }
        })    
    }
    return moviesId
}

// <------ News API ------>

// async function getAllUpcomingMoviesId(){
//     let upcomingMoviesId = []


//     for(let i = 0 ; i < 5 ;i++){
//         const getAllUpcomingMovies = {
//             method: 'GET',

//             // https://api.themoviedb.org/3/discover/movie?api_key=<<api_key>>

//             url: `${movieApi}movie/upcoming?api_key=${apiKey}&language=en-US&page=1`,
//                 headers: {
//                     'X-RapidAPI-Key': 'b430c9dc9cmsh98401db1637b694p116976jsnfaeb2c0dc52d',
//                     'X-RapidAPI-Host': 'movies-app1.p.rapidapi.com' 
//                 }   
//          }
//         await axios.request(getAllUpcomingMovies).then(function (response){
//             let data = response.data['results']
            
//             for(let i = 0 ; i < data.length ; i++){
//              upcomingMoviesId.push(data[i]['id'])
             
//             }
//         })   
//     }
    
//     return upcomingMoviesId
// }

   async function getUpcomingMovies (){ 
         
            const config = {
                method: 'get',
                url: `${movieApi}movie/upcoming?api_key=${apiKey}&language=en-US&page=1`,
                headers: { 'User-Agent': 'Axios - console app' }
            }
        
            let apiResponse = await axios(config)
        
 
          return apiResponse
          
            
      }
        
        
    

    
    



async function getAllUsers(){
    try{

        let results = await userSchema.find()

        return results

    }
    catch(err){
        console.log(err.message)
    }
}


async function getMovieDetailsFromDbById(movieId){
    try{
        
        const response = await movieSchema.find({
            id:movieId
        })

        return response
    }
    catch(err){
        console.log(err.message)
    }
}


async function getMovieDetailById(id){
    let results 

    try{
        const reponse = await axios.get(`${movieApi}/movie/${id}`, {
             params: {
            api_key: apiKey,
            append_to_response: "videos"
         }})

         return reponse.data
    }
    catch(err){

        console.log(err.message)

    }
    return results
}

// <----- News ---->

// async function getUpcomingMovieDetailById(id){
//     let results 

//     try{
//         const reponse = await axios.get(`${movieApi}/movie/upcoming/${id}`, {
//              params: {
//             api_key: apiKey,
//             append_to_response: "videos"
//          }})

//          return reponse.data
//     }
//     catch(err){

//         console.log(err.message)

//     }
//     return results
// }

// <-------- DataBase -------->


async function getNumberofBundlesSubscribed(){
    try{
        let results = await manageBundlesAndUsers.find()
        let arrOfAllBundlesSubscribed = []

        for(let i = 0 ; i < results.length ; i++){
            let currentBundle = results[i]

            let currentObject= {
                registerDate: currentBundle['startBundleDate'],
                bundleTitle: '',
                bundlePrice: 0
            }

            await getBundleNameAndPriceById(currentBundle['bundleId']).then((data) => {
                currentObject.bundleTitle = data[0]['title']
                currentObject.bundlePrice = data[0]['price']
            })

            arrOfAllBundlesSubscribed.push(currentObject)

        }
        
        return arrOfAllBundlesSubscribed
    }
    catch(err){
        console.log(err.message)
    }
}


async function getBundleNameAndPriceById(bundleId){
    try{
            let results = await bundleSchema.find({
                _id: bundleId
            },{
                title:1,
                price:1
            })

            return results
    }
    catch(err){
        console.log(err.message)
    }
}


async function getNumberOfTimeMoviesIsSubscribed(){
    try{

        let allMovies = {}
        let allBundles = await manageBundlesAndUsersSchema.find()
        
        for(let i = 0 ; i < allBundles.length;  i++){
            let currentBundleMovies = allBundles[i].enrolledMoviesId
  
            for(let j = 0 ; j < currentBundleMovies.length ; j++){
                                                                             
                if(allMovies[currentBundleMovies[j]] != undefined){
                   
                    allMovies[currentBundleMovies[j]].count =  allMovies[currentBundleMovies[j]].count + 1

                }else{

                    let details

                    await getMovieDetailById(currentBundleMovies[j]).then((data) => {
                     details = data
                    })
 
                     allMovies[currentBundleMovies[j]] =  {
                         count: 1,
                         movieDetails: details
                     }

                }
            }
        }

        let moviesArr = []

        for(let i of Object.keys(allMovies)){
            moviesArr.push(
            {
                count: allMovies[i].count,
                details: allMovies[i].movieDetails
            }
            )
        }

        return moviesArr
    }
    catch(err){
        console.log(err.message)
    }
}


async function getAllBundles(){
    try{

        const results = await bundleSchema.find()

        return results

    }
    catch(err){
        console.log(err.message)
    }
}


async function getAllBundlesThatUserCanSubscribeTo(userEmail, onlyId = false){
    try{
        let currentAvailbleBundle

        await getUserCurrentMonthBundlesWithNonOverLimitMovies(userEmail).then((response) => {
            currentAvailbleBundle = response
        })

        if(currentAvailbleBundle.length > 0)return []

       let userCurrentBundles

       await getUserThisMonthBundles(userEmail, false).then((response) => {
            userCurrentBundles = response
       })

       let userCurrentBundlesId = userCurrentBundles.map((bundle) => bundle.bundleId)
       let allBundles = await bundleSchema.find()
       let filterdBundles = []
       
       for(let i = 0 ; i < allBundles.length ; i++){
        if(userCurrentBundlesId.includes(`${allBundles[i]._id}`))continue
        filterdBundles.push(allBundles[i])
       }
       
       
       if(onlyId)return filterdBundles.map((bundle) => bundle._id)

       return filterdBundles
    }
    catch(err){
        console.log(err.message)
    }
}


async function userAlreadyExist(email){
    try{
        const results = await userSchema.find({
            email: email
        }).count()
        
        return results != 0 
    }
    catch(err){
        console.log(err.message)
    }
}


async function getBundleForUserById(userId){
    try{
        const results = userSchema.find({
            _id: userId
        },{
            bundlesId: 1
        })

        return results[results.length - 1]
    }
    catch(error){
        console.log(error.message)
    }
}


async function getUserInfo(userEmail){
    try{
        const results =  await userSchema.find({
            email: userEmail
        })

        return results[0]
    }
    catch(err){
        console.log(err.message)
    }
}


async function getMovieLimitByBundleId(currentBundleId){
    try{
        const movieLimit = await bundleSchema.find({
            _id: currentBundleId
        },{
            movieLimit: 1
        })
 
        return movieLimit
    }
    catch(err){
        console.log(err.message)
    }
}

async function getThisMonthEnrolledMovies(userEmail){
    try{

        let thisMonthBundles
        let subscribedMovies = []

        await getUserThisMonthBundles(userEmail).then((response) => {
            thisMonthBundles = response
        })

        for(let i = 0 ; i < thisMonthBundles.length; i++){
            let currentBundleMovies = thisMonthBundles[i].enrolledMoviesId

            for(let j = 0 ; j < currentBundleMovies.length ; j++){
                subscribedMovies.push(currentBundleMovies[j])
            }
        }
 
        return subscribedMovies
    }
    catch(err){
        console.log(err.message)
    }
}


async function getUserThisMonthBundles(userEmail, onlyId = false){
    try{
        let userInfo

        await getUserInfo(userEmail).then( (response) => {
            userInfo = response
        })
    
        let userBundles = await manageBundlesAndUsers.find({
            userId: userInfo._id
        })
  
         let currentDate = modulesHelper.getCurrentDate()
         let thisMonthBundles = []

        for(let subscribtion of userBundles){

            if(modulesHelper.firstDateIsGreater(subscribtion.endBundleDate, currentDate)){
                thisMonthBundles.push(subscribtion)
            }

        }

        if(!onlyId)return thisMonthBundles
        return thisMonthBundles.map( (bundle) => bundle._id)

    }
    catch(err){
        console.log(err.message)
    }
}


async function getUserCurrentMonthBundlesWithNonOverLimitMovies(userEmail, onlyId = false){
    try{
        let userInfo

        await getUserInfo(userEmail).then( (response) => {
            userInfo = response
        })
    
        let userBundles = await manageBundlesAndUsers.find({
            userId: userInfo._id
        })
  
         let currentDate = modulesHelper.getCurrentDate()
         let thisMonthBundles = []

        for(let subscribtion of userBundles){

            if(modulesHelper.firstDateIsGreater(subscribtion.endBundleDate, currentDate)){
                thisMonthBundles.push(subscribtion)
            }

        }
        thisMonthBundles = thisMonthBundles.filter( (bundle) => bundle.numberOfMoviesLeft > 0)

        if(!onlyId)return thisMonthBundles

        return thisMonthBundles.map( (bundle) => bundle._id)

    }
    catch(err){
        console.log(err.message)
    }
}


async function canUserSubscribeToSpecificBundle(userEmail, bundleId){
    try{

        let thisMonthBundles

        await getUserThisMonthBundles(userEmail, true).then( (bundles) => {
            thisMonthBundles = bundles
        })


        for(let bundle of thisMonthBundles){
            if(bundle.numberOfMoviesLeft > 0 || bundle._id == bundleId)return false
        }
        
        return true

    }
    catch(err){
        console.log(err.message)
    }
}


async function existingUserSubscribeToBundle(userEmail, bundleId){
    try{
       
        await canUserSubscribeToSpecificBundle(userEmail, bundleId).then( async function(canSubscibe){
            if(canSubscibe){
                await newUserSubscribeToBundle(userEmail, bundleId)
                console.log("user subscribed new Bundle")
            }
            else console.log("can't Subscribe")
        })

    }
    catch(err){
        console.log(err.message)
    }
}


async function newUserSubscribeToBundle(userEmail, bundleid){
    try{
        let user 
        await getUserInfo(userEmail).then((response) => {
            user = response
        })
        const nextMonthDate = modulesHelper.getNextMonthDate()
        const currentMonthDate = modulesHelper.getCurrentDate()
        let numberOfMoviesLeft

         await getMovieLimitByBundleId(bundleid).then( (results) => {
            numberOfMoviesLeft = results[0].movieLimit
         })
      
        let element = {
            userId: user._id,
            bundleId: bundleid,
            startBundleDate: currentMonthDate,
            endBundleDate: nextMonthDate,
            numberOfMoviesLeft: parseInt(numberOfMoviesLeft)
        } 

       await addToDb(manageBundlesAndUsers, element)

    }
    catch(err){
        console.log(err.message)
    }
}


async function addToDb(modelName, modelInfo){
    try{
        let element = new modelName(modelInfo)
        await element.save()
    }
    catch (err){
        console.log(err.message)
    }
}


async function getAllDetailsFromDb(modelName){
    try{
        const results = await modelName.find()
        return results
    }
    catch(err){
        console.log(err.message)
    }
}


async function dbIsEmpty(SchemaName){

    try{
        const results = await SchemaName.find().count()
        return results == 0
    }
    catch(err){

        console.log(err.message)
    }

    return 1
}

function sessionHaveLikedMovies(){
    try{
        const results = session.currentUserLikedMovies
        return results != undefined
    }
    catch(err){
        console.log(err.message)
        return false
    }
}


async function getAllUserRelationsWithBundles(currentUserEmail, currentUserId = null){
    try{

        let results

         if(currentUserId){

            results = await manageBundlesAndUsers.find({
                userId: currentUserId
            })

        }else{
            
            let userInfo 

            getUserInfo(currentUserEmail).then((response) => {
                userInfo = response
            })

            results = await manageBundlesAndUsers.find({
                userId: userInfo._id
            })

        }

         return results
    }
    catch(err){
        console.log(err.message)
    }
}


module.exports = {
    getUserInfo,
    sessionHaveMovies,
    sessionHaveUpcomingMovies,
    sessionHaveLikedMovies,
    dbIsEmpty,
    getAllMoviesId,
    getMovieDetailById,
    addToDb,
    getAllDetailsFromDb,
    getBundleForUserById,
    hashString,
    getUpcomingMovies,
    userAlreadyExist,
    getMovieLimitByBundleId,
    newUserSubscribeToBundle,
    existingUserSubscribeToBundle,
    getAllUserRelationsWithBundles,
    getUserThisMonthBundles,
    getAllBundlesThatUserCanSubscribeTo,
    getUserCurrentMonthBundlesWithNonOverLimitMovies,
    getNumberOfTimeMoviesIsSubscribed,
    getThisMonthEnrolledMovies,
    getNumberofBundlesSubscribed,
    getMovieDetailsFromDbById,
    getAllBundles,
    getAllUsers,
    hashString  
}
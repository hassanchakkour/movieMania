const extensions = require('./../../helper/extensions.js')
const axios = require("axios");
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const session = require('express-session')
const NewsSchema = require('../../models/newsSchema');
const newsSchema = require('../../models/newsSchema');

dotenv.config({path: __dirname + '/../../../.env'})

const {
    backdropPath,
    movieApi,
    apiKey
} = process.env


const getAllUpcomingMovies = async (req, res) => {

    try{

        let dataBaseIsEmpty 

        await extensions.dbIsEmpty(newsSchema).then( async (response) => {
            dataBaseIsEmpty = response
        })

        if(!extensions.sessionHaveMovies()  && dataBaseIsEmpty ){
           
            let listOfAllUpcomingMoviesDetails = []
            await extensions.getUpcomingMovies().then(async (results) => {

                for(let i = 0 ; i < results.length ; i++){
                    
                    let currentMovieId = results[i]
                    
                   await  extensions.getUpcomingMovieDetailById(currentMovieId).then(async (movieDetails) => {
                        await extensions.addToDb(newsSchema, movieDetails)
                        listOfAllUpcomingMoviesDetails.push(movieDetails)
                    })
                    

                }
                console.log(listOfAllUpcomingMoviesDetails[0])
            })

            res.send(listOfAllUpcomingMoviesDetails)
            session.currentUserMovies = listOfAllUpcomingMoviesDetails
           
        }else{

            if(!extensions.sessionHaveMovies()){
                console.log("No new News")
                extensions.getAllDetailsFromDb(newsSchema).then( (results) => {
                session.currentUserMovies = results
                res.send(results)
               })

            }else{
                console.log("session have The Upcoming Movies News")
                res.send(session.currentUserMovies)
            }
        }
      }catch(err){
        console.log(err.message)
    }
}


    


const getUpcomingMoviesByGenre = async (req , res) => {

    try {

        const genre = req.query.genre
        let allMovies = session.currentUserMovies
        let filteredMovies = []

        for(let i = 0 ; i < allMovies.length ; i++) {
            let currentMovieGenres = allMovies[i]['genres']
            
            for(let j = 0 ; j < currentMovieGenres.length ; j++){
                if(currentMovieGenres[j]['name'].toLowerCase() == genre){
                    filteredMovies.push(allMovies[i])
                    break
                }
            }
        }
        res.send(filteredMovies)
    }
    catch(error){
        console.log(error.message)
    }
}

 async function upComing (req, res){ 
    
    try{ 
        if(extensions.sessionHaveUpcomingMovies()){ 
            res.send(session.currentUserUpcomingMovies)
        } else { 
            extensions.dbIsEmpty(newsSchema).then(async (resp) =>{
                let dbIsEmpty = resp
                
                if(dbIsEmpty){ 
                     let data 
                     await extensions.getUpcomingMovies().then(async (resp) => { 
                            data = resp.data["results"]
                            let allUpcomingMovies = []
                            for(let i=0; i < data.length; i++){ 
                                allUpcomingMovies.push(data[i])

                                await extensions.addToDb(NewsSchema, data[i])
                                
                            }
                            session.currentUserUpcomingMovies = allUpcomingMovies
                     })
                        res.json(data)
                }else{ 
                        console.log("session don't have the Upcomingmovies")
                        extensions.getAllDetailsFromDb(newsSchema).then( (results) => {
                        session.currentUserUpcomingMovies = results
                        res.send(results)
                       })
                }

             })
        } 
    }catch(error){ 
        res.status(500).json({message: "Inernal Error"})
        console.log(error)
    }
    
    
}


module.exports = {
    getAllUpcomingMovies, 
    getUpcomingMoviesByGenre, 
    upComing}
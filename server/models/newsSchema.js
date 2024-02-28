const mongoose = require('mongoose')


const newsSchema = new mongoose.Schema({

    
        "adult": {
          "type": "Boolean"
        },
        "backdrop_path": {
          "type": "String"
        },
        "genre_ids": {
          "type": [
            "Number"
          ]
        },
        "id": {
          "type": "Number"
        },
        "original_language": {
          "type": "String"
        },
        "original_title": {
          "type": "String"
        },
        "overview": {
          "type": "String"
        },
        "popularity": {
          "type": "Number"
        },
        "poster_path": {
          "type": "String"
        },
        "release_date": {
          "type": "Date"
        },
        "title": {
          "type": "String"
        },
        "video": {
          "type": "Boolean"
        },
        "vote_average": {
          "type": "Number"
        },
        "vote_count": {
          "type": "Number"
        }
      
                
            
        
    
    

      
})



module.exports = mongoose.model('news', newsSchema) 
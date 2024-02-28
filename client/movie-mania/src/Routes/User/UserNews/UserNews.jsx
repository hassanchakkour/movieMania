import React from 'react'
import UpcomingRow from '../../../Components/upcomingRows/UpcomingRow';
import requests from '../../../Request'
import SearchBar from '../../../Components/searchBar/SearchBar'
import styles from './UserNewscss.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const UserNews = ({fetchURL}) => {

        const [searchValue, setSearchValue] = useState("")
        const [filtredMovies, setFiltredMovies] = useState()
        const [isFilterOn, setIsFilterOn] = useState(false)
        const [movies, setMovies] = useState([]);

        const handleSearch = (e) => {
            setSearchValue(e.target.value.toLowerCase())
        }

        useEffect(() => {
          axios.get(fetchURL).then((response) => {
            setMovies(response.data.results.slice(0, 20));
            setFiltredMovies(response.data.results.slice(0, 20))
          });
        }, [fetchURL]);

    useEffect(() => {

        if(searchValue.trim() == ""){ 
          setFiltredMovies(movies)
          setIsFilterOn(false)
          console.log(searchValue)
          return
        }
  
        let searchedMovies = (movies.filter(movie => { 
         return movie.title.toLowerCase().includes(searchValue)   
        }))
  
        setFiltredMovies(searchedMovies)
        console.log(searchedMovies)
        setIsFilterOn(true)
  
      }, [searchValue])


  return (
    <div className={styles.cont}>
        <br /><br /><br /><br />
    <SearchBar  action={handleSearch}/> 
    <br />
    <div className='ml-20'>
          {filtredMovies &&<div className='ml-5 text-3xl'>
        <UpcomingRow title='> New Upcoming Movies'  MOVIES={filtredMovies}/>
        </div>}
        
    </div>
    
</div>
  )
}

export default UserNews
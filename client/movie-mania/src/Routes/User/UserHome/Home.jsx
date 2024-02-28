import React from 'react'
import Main from '../../../Components/Main/Main'
import Row from '../../../Components/Rows/Row'
import requests from '../../../Request'
import SearchBar from '../../../Components/searchBar/SearchBar'
import Filter from '../../../Components/filters/Filter'
import styles from './Homecss.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Loading from '../../../Components/Loading/Loading'
import { useNavigate } from 'react-router-dom'

let filterSkeleton = {
  Action: false,
  Comedy: false,
  Romance: false,
  Drama: false,
  Horror: false,
  Fantasy: false,
  Family: false,
  Animation: false,
  'Science Fiction': false,
  Thriller: false,
  Crime: false,
  Adventure: false,
}

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState();
  const [topRated, setTopRated] = useState([])
  const [mostViewed, setMostViewed] = useState([])
  const [filtredMovies, setFiltredMovies] = useState()
  const [moviesFilter, setMoviesFilter] = useState(filterSkeleton)
  const [isFilterOn, setIsFilterOn] = useState(false)

  const [searchValue, setSearchValue] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchMovie() {

      await axios.get('/user/Movies')
        .then(async (response) => {

          response.data == 'forbidden' && navigate('/')

          let moviesfetched1 = [...response.data]
          let moviesfetched = [...response.data]

          setMostViewed(moviesfetched1.sort((a, b) => {
            return (a.popularity - b.popularity)
          }))

          setTopRated(moviesfetched.sort((a, b) => {
            return (parseInt(b.rate) - parseInt(a.rate))
          }))


          setMovies(response.data)
          setFiltredMovies(response.data)
          setMovie(response.data[Math.floor(Math.random() * 20)])

        })
        .catch((err) => {
          if (err) {
            console.log(err)
            navigate('/')
          }
        })
    }

    fetchMovie();
  }, [])

      const handleSearch = (e) => {
        setSearchValue(e.target.value.toLowerCase())
    }

    useEffect(() => {

      if(searchValue.trim() == ""){ 
        setFiltredMovies(movies)
        setIsFilterOn(false)
        return
      }

      let searchedMovies = (movies.filter(movie => { 
       return movie.title.toLowerCase().includes(searchValue)   
      }))

      setFiltredMovies(searchedMovies)
      console.log(searchedMovies)
      setIsFilterOn(true)

    }, [searchValue])



  const handleCheckBox = (event) => {
    let name = event.target.name
    let value = !moviesFilter[name]
    setMoviesFilter({ ...moviesFilter, [name]: value })
  }

  useEffect(() => {
    let filterValues = Object.keys(moviesFilter).filter((filterKey) => moviesFilter[filterKey] == true)

    if (filterValues.length == 0 && movies != undefined) {
      setIsFilterOn(false)
      return setFiltredMovies(movies)
    }

    setIsFilterOn(filterValues.length > 0)

    let moviesMatchingFilter = []

    for (let i = 0; i < movies.length; i++) {
      let currentMovieGenres = []
      let genres = movies[i].genres

      for (let x = 0; x < genres.length; x++) {
        currentMovieGenres.push(genres[x].name)

      }


      for (let j = 0; j < filterValues.length; j++) {

        if (!currentMovieGenres.includes(`${filterValues[j]}`)) break
        if (j == filterValues.length - 1) moviesMatchingFilter.push(movies[i])
      }

    }
    setFiltredMovies(moviesMatchingFilter)
  }, [moviesFilter])


  if (movies[99] == undefined || topRated == undefined || mostViewed == undefined || mostViewed[5] == undefined ) {

    return <Loading></Loading>
  }

  return (
    <div className={styles.pageContent}>
      {<Main movies={movies} movie={movie} />}
      <SearchBar  action={handleSearch}/>
      <br />
      <div className='flex'>
        <div className='ml-5'>
          <div className='w-[230px]'>
            <h2 className='underline text-white text-3xl ml-4'>Filter By Genre</h2>
            <br />
            <div className='text-white ml-11 border-r border-black'>
              {Object.keys(moviesFilter).map((keyVal, index) => {
                return (
                  <div key={keyVal}>
                    <input type="checkbox" name={keyVal}  className='bg-gray-100 mb-3 opacity-40 w-4 h-4' onChange={handleCheckBox} />
                    <label className='ml-2 text-lg'>{keyVal}</label><br />
                  </div>
                )
              })}

            </div>

          </div>
        </div>
        <br />
        <div className='ml-5'>



          {!isFilterOn &&
            <div>
              <Row title='Top Rated' moviesArr={topRated} />
              <Row title='Most Views' moviesArr={mostViewed} />
            </div>
          }

          <Row title='All Movies' moviesArr={filtredMovies} />

        </div>
      </div>

    </div>
  )
}

export default Home
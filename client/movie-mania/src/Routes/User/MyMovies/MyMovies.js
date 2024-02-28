import { useEffect, useState } from 'react'
import styles from './MyMoviesCss.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Movies from '../../../Components/Movie/Movies';
import Loading from '../../../Components/Loading/Loading'
import { AiOutlineSearch } from 'react-icons/ai'


const MyMovies = () => {

    const navigate = useNavigate()
    const [likedMovies, setLikedMovies] = useState()
    const [enrolledMovies, setEnrolledMovies] = useState()
    const [filteredEnrolledMovies, setFilteredEnrolledMovies] = useState()
    const [filteredLikedMovies, setFilteredLikedMovies] = useState()
    const [search, setSearch] = useState()

    useEffect(() => {
        const fetchMoviesLiked = () => {
            axios.get('/user/likedMovies')
                .then((data) => {
                    let resp = data.data
                    resp == 'forbidden' && navigate('/')
                    setLikedMovies(resp)
                    setFilteredLikedMovies(resp)
                })
        }

        fetchMoviesLiked()
    }, [])

    useEffect(() => {
        const fetchEnrolledMovies = () => {
            axios.get('/user/Movies/subscribed')
                .then(data => {
                    let resp = data.data
                    setEnrolledMovies(resp)
                    setFilteredEnrolledMovies(resp)
                })
        }
        fetchEnrolledMovies()
    }, [])

    const handleSearch = (event) => {
        let value = event.target.value.toLowerCase()
        setSearch(value)

        if (value.trim() == '') {
            setFilteredEnrolledMovies(enrolledMovies)
            setFilteredLikedMovies(likedMovies)
            return
        }

        setFilteredEnrolledMovies(enrolledMovies.filter((currentMovies) => { return currentMovies.title.toLowerCase().includes(value) }))
        setFilteredLikedMovies(likedMovies.filter((currentMovies) => { return currentMovies.title.toLowerCase().includes(value) }))

    }




    if (likedMovies == undefined || enrolledMovies == undefined) {
        return (<Loading></Loading>)
    }

    return (
        <div className={[styles.allPage, ' text-white pt-10'].join('')}>
            <div className={['text-white pt-20'].join('')}>
                <div className='p-5'>

                    <div className='text-center mb-20'>
                        <div>
                            <label className='absolute text-4xl text-gray-400'><AiOutlineSearch /></label>
                            <input
                                type="search"
                                className='bg-black bg-opacity-40 w-96 h-10 outline-0 rounded text-center text-gray-400'
                                placeholder='Search'
                                onChange={handleSearch}
                                value={search}
                            />
                        </div>
                    </div>


                    <h1 className='text-3xl mb-3'>My Liked Movies</h1>
                    {filteredLikedMovies && filteredLikedMovies.map((movie, index) => {
                        return (
                            <Movies key={index} item={movie} />
                        )
                    })}
                </div>

                <div className='p-5'>
                    <h1 className='text-3xl mb-3'>My Enrolled Movies</h1>
                    {filteredEnrolledMovies && filteredEnrolledMovies.map((movie, index) => {
                        return (
                            <Movies key={index} item={movie} />
                        )
                    })}
                </div>
            </div>

        </div>
    )
}
export default MyMovies
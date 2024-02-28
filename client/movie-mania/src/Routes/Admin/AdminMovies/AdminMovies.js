import { useState, useEffect } from 'react'
import axios from 'axios'
import Notification from '../../../Components/Notification/Notification'
import styles from './AdminMoviesCss.module.css'
import LoadingSVG from '../../../Components/LoadingSvg/LoadingSvg'


let skeletonOfCurrentMovie = {

    title: '',
    genres: '',
    posterPath: '',
    titleOfContainer: 'Add Movie',
    btn: 'Add',
    id: ''

}

let errorSkeleton = {

    title: 'Error',
    content: '',
    hidden: true
}

const AdminMovies = () => {
    const [allMovies, setAllMovies] = useState()
    const [filteredMovies, setFilteredMovies] = useState()
    const [searchInput, setSearchInput] = useState('')
    const [currentMovie, setCurrentMovie] = useState(skeletonOfCurrentMovie)
    const [notificationError, setNotificationError] = useState(errorSkeleton)
    const [onlineSearchResult, setOnlineSearchResult] = useState('')
    const [hideSearchResults, setHideSearchResults] = useState(true)
    const [movieToAdd, setMovieToAdd] = useState()

    useEffect(() => {

        const fetchMovies = async () => {

            await axios.get('/admin/movies')
                .then((data) => {
                    let movies = data.data
                    setAllMovies(movies)
                    setFilteredMovies(movies)
                })
        }

        fetchMovies()

    }, [])

    useEffect(() => {

        setSearchInput('')
        setFilteredMovies(allMovies)

    },[allMovies])

    const handleSearch = (event) => {
        let searchValue = event.target.value
        setSearchInput(searchValue)

    }

    useEffect(() => {
        if (searchInput == '') {
            setFilteredMovies(allMovies)
            return
        }

        // To Find the stupid added movies
        // for(let i = 0 ; i < allMovies.length ; i++){
        //     let movie = allMovies[i]
        //     if(!(movie.genres && movie.genres.length > 0 &&  movie.genres[0] && movie.title ))console.log(movie)
        // }

        setFilteredMovies(allMovies.filter((movie) => {
            if(movie.genres && movie.genres.length > 0 &&  movie.genres[0] && movie.title ){
                return movie.title.toLowerCase().includes(searchInput.toLowerCase()) || movie.genres[0].name.toLowerCase().includes(searchInput.toLowerCase())
            }
        }))

    }, [searchInput])


    const handleCurrentBundleChange = (event) => {
        let name = event.target.name
        let value = event.target.value
        setCurrentMovie({ ...currentMovie, [name]: value })
    }

    const handleBtnClick = async (event) => {
        let idValue = event.target.id
        let posterPath = idValue.split('[]')[1]
        let operationType = idValue.split('[]')[0]
        alert(posterPath)

        if(!allMovies)return

            alert(`Delete => ${idValue}`)
            await axios.post('/admin/movies/delete',{
                posterPath: posterPath
            })
            .then((data) => {
                let resp = data.data
                if(resp == 'deleted'){

                    let dummyArr = allMovies.filter((movie) => {
                        return ( movie.poster_path != posterPath)
                    })

                    setAllMovies(dummyArr)

                }
            })

    }

    const handleAddEditMovieBtn = async () => {
        let operationType = currentMovie.btn
        let currentMovieTitle = currentMovie.title.trim()
        let currentMoviePosterPath = currentMovie.posterPath
        let currentMovieGenre = currentMovie.genres.trim()


      
        if (operationType == 'Edit') {

            let matchingMovies = allMovies.filter((movie) => movie.title.toLowerCase() == currentMovieTitle.toLocaleLowerCase())


            if (!currentMovieTitle || !currentMoviePosterPath || !currentMovieGenre) {
                return setNotificationError({ ...notificationError, ['title']: 'Error', ['content']: 'Please fill all the fields to continue', ['hidden']: false })
            }


            if (matchingMovies.length == 1 && matchingMovies[0].poster_path != currentMoviePosterPath) return setNotificationError({ ...notificationError, ['title']: 'Error', ['content']: 'Movie with the same Title Already Exist', ['hidden']: false })



        } else {
            if(!currentMovieTitle ){
                return setNotificationError({ ...notificationError, ['title']: 'Error', ['content']: 'Please choose a movie to add', ['hidden']: false })
            }
            
            // if (matchingMovies.length != 0 && matchingMovies[0].posterPath == movieToAdd.poster_path) return setNotificationError({ ...notificationError, ['title']: 'Error', ['content']: 'Movie with the same Title Already Exist', ['hidden']: false })

            await axios.get(`https://api.themoviedb.org/3/movie/${movieToAdd.id}?api_key=3115dc5e5611d2448a02e22f57725fdf&language=en-US`,{
                params: {
                    append_to_response: "videos"
                 }
            })
            .then((data) => {
                setMovieToAdd(data.data)
                return data.data
   
            })
            .then(async (data) => {
   
                let details = data
         
                await axios.post('/admin/movies/add', {
                    movie: details
                }).then((data) => {
                        let resp = data.data
                        if(resp == 'added'){
                        
                            
                            let dummyMovie = {
                                title: details.title,
                                poster_path: details.poster_path,
                                genres: details.genres
                            }
                       
                            let containerOfMovies = allMovies 
                            containerOfMovies.push(dummyMovie)
                        
                            setAllMovies(containerOfMovies)
                        }else{
                       
                        }
                  
                    })
             })



        }
    }
    

    const handleClickOnMovie = (event) => {
        let movie = onlineSearchResult.filter((movie) =>  movie.id == event.target.id )
        if(movie.length == 0)return setNotificationError({ ...notificationError, ['title']: 'Connection Error', ['content']: 'Your internet is weak please try again after load', ['hidden']: false })
        setCurrentMovie({...currentMovie, ['title']: movie[0].title})
        setHideSearchResults(true)
        setMovieToAdd(movie[0])
    }

    const handleAddNewMovie = (event) => {
        setCurrentMovie({ ...currentMovie, ['title']: '', ['genres']: '', ['posterPath']: '', ['btn']: 'Add' })
    }

    const handleSearchMovie = async (event) => {
        let fieldValue = event.target.value
        setCurrentMovie({ ...currentMovie, ['title']: fieldValue })
   
        if(fieldValue.length == 0){
            setHideSearchResults(true)
            return setOnlineSearchResult('')

        }
        await axios.post('/admin/movies/search', {
            movieTitle: fieldValue
        })
            .then((data) => {
                setOnlineSearchResult(data.data.results)
                setHideSearchResults(false)
            })
    }

    return (
        <div className={['h-screen w-full px-10 py-5 ', styles.allPageContent].join(' ')}>

            <div className=' text-white mb-10 '>
                <h1 className='text-center text-4xl'>Movies</h1>


            </div>
            <div className=''>
                <div className="flex">
                    <div className=" xl:w-80">
                        <div className="input-group relative flex flex-wrap items-stretch w-full mb-2 rounded">
                            <input type="search" className={["form-control relative flex-auto min-w-0 block w-full px-10 py-1.5 text-base font-normal text-white bg-white bg-clip-padding  rounded transition ease-in-out m-0 focus:text-white  focus:outline-none", styles.searchInput].join(' ')} placeholder="Search" aria-label="Search" aria-describedby="button-addon2" val={searchInput} onChange={handleSearch} />
                            <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 45" className='absolute w-6 -mt-2 ml-2' width="50px" height="50px"><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" /></svg>
                            <span className="input-group-text flex items-center px-3 py-1.5 text-base font-normal text-gray-700 text-center whitespace-nowrap rounded" id="basic-addon2">
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex h-3/4'>


                <div className={['w-1/2 p-5 rounded-xl ', styles.moviesTable].join(' ')}>

                    <table className='w-full'>
                        <thead className="flex text-white w-full">
                            <tr className="flex w-full mb-4 pt-4 text-2xl">
                                <th className=" w-1/4">Poster</th>
                                <th className=" w-1/4">Title</th>
                                <th className=" w-1/4">genres</th>
                                <th className=" w-1/4">Action</th>
                            </tr>
                        </thead>
                        <tbody className={[" text-center flex flex-col items-center justify-between overflow-y-scroll w-full text-white text-xl", styles.tableCss].join(' ')}>
                            {filteredMovies != undefined && filteredMovies != ' ' ? filteredMovies.map((movie, index) => {
                                return (
                                    movie.genres.length > 0 && 
                                    <tr className="flex w-full h-32 mb-8 text-center" key={index}>
                                        <td className="py-2 w-1/4">
                                            <img src={`https://image.tmdb.org/t/p/w154/${movie.poster_path}`} width='100px' height={'50px'} />
                                        </td>
                                        <td className="py-2 w-1/4 justify-center">{movie.title}</td>
                                        <td className="py-2 w-1/4">{movie.genres[0].name}</td>
                                        <td className="py-2 w-1/4 font-normal"> <span className='hover:font-bold hover:cursor-pointer' onClick={handleBtnClick} id={`delete[]${movie.poster_path}`} >Delete</span></td>
                                        {/* <span className='pl-2 pr-6 hover:font-bold hover:cursor-pointer' onClick={handleBtnClick} id={`edit[]${movie.title}`} >Edit</span>  */}
                                    </tr>


                                )
                            })
                                :
                                <tr className="flex w-full h-32 mb-8 text-center">
                                    <td className="py-2 w-1/4"><LoadingSVG />  </td>
                                    <td className="py-2 w-1/4 justify-center"><LoadingSVG />  </td>
                                    <td className="py-2 w-1/4"><LoadingSVG />  </td>
                                    <td className="py-2 w-1/4"><LoadingSVG />  </td>
                                </tr>
                            }

                        </tbody>
                    </table>

                </div>


                <div className='w-1/2 pl-10 h-3/4'>
                    <div className={['h-full pt-8 rounded-xl', styles.addMovieContainer].join(' ')}>

                        <div className='text-3xl text-center text-white mb-6 font-bold'>
                            <h1>{currentMovie.titleOfContainer}</h1>
                        </div>

                        <div className='px-20'>

                            <div className="mb-5 ">

                                <label className="block text-white text-2xl mb-2">
                                    Title:
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Title" name="title" onChange={handleSearchMovie} value={currentMovie.title} required />
                                {!hideSearchResults  &&  
                                    <div className='w-1/3'>
                                        <div className={["flex-col bg-white drop-shadow-lg p-3 ", styles.moviesContainer].join(' ')}>
                                            {onlineSearchResult.length > 0 && onlineSearchResult.map((movie, index) => {
                                        return(    index < 8 && movie.id != '' &&
                                                <div key={movie.id} className='flex h-32 w-4/6 text-center mb-3 text-white hover:bg-gray-400 ' onClick={handleClickOnMovie} id={`${movie.id}`}>
                                    
                                                    <img src={`https://image.tmdb.org/t/p/w300/${movie.backdrop_path}`} alt='Loading ...' className={['float w-1/4', styles.img].join(' ')} height={'25px'} width={'25px'} />
                                                    <h1 className='text-center ml-2 mt-10 text-xl'>{movie.title}</h1>
                                                </div>
                                           )
                                            })}

                                        </div>
                                    </div>}

                            </div>
                            <Notification content={notificationError.content} title={notificationError.title} hidden={notificationError.hidden} handleDoneBtn={() => { setNotificationError({ ...notificationError, ['hidden']: true }) }}  ></Notification>
                            {currentMovie.btn == 'Edit' && 
                            <div>

                             <div className="mb-5 ">

                                <label className="block text-white text-2xl mb-2">
                                    Poster Path:
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Title" name="posterPath" onChange={handleCurrentBundleChange} value={currentMovie.posterPath} required />
                            </div>

                            <div className="mb-5 ">

                                <label className="block text-white text-2xl mb-2">
                                    Genre:
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Title" name="genres" onChange={handleCurrentBundleChange} value={currentMovie.genres} required />
                            </div>
                            </div>
                            }

                            <div>
                                {currentMovie.btn == 'Edit' &&
                                    <button className='mb-7 w-auto px-2 rounded-full m-auto text-center font-normal text-blue-600 hover:underline hover:cursor-pointer text-md' onClick={handleAddNewMovie}>Add new movie</button>
                                }

                                <div className={[' w-32 font-bold py-2 px-10 text-xl rounded-full m-auto text-center text-white', styles.addEditMovieBtn].join(' ')} >
                                    <button onClick={handleAddEditMovieBtn}>{currentMovie.btn}</button>
                                </div>


                            </div>

                        </div>

                    </div>



                </div>
            </div>

        </div>
    )
}

export default AdminMovies
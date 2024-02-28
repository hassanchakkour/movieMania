import axios from "axios"
import { useEffect, useState } from "react"
// import YouTube, { YouTubeProps } from 'react-youtube';
import ReactPlayer from 'react-player'
import styles from './MovieDetailsCss.module.css'
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'
import {AiOutlineHeart, AiFillHeart,} from 'react-icons/ai'
import {BiCheck} from 'react-icons/bi'
import { useNavigate, useLocation } from "react-router-dom"
import Notification from "../../../Components/Notification/Notification"
import Loading from "../../../Components/Loading/Loading"

const MovieDetail = () => {

    const {state} = useLocation()

    const { movieId } = state

    const navigate = useNavigate()

    const [movieDetails, setMovieDetails] = useState('')

    const [trailers, setTrailers] = useState()

    const [otherThanTrailers, setOtherThanTrailers] = useState()

    const [currentVideoLink, setCurrentVideoLink] = useState()

    const [showMorePressed, setShowMorePressed] = useState(false)

    const [isMovieEnrolled, setIsMovieEnrolled] = useState()

    const [isMovieLiked, setIsMovieLiked] = useState()

    const [errorIsHidden, setErrorIsHidden] = useState(true)

    useEffect(() => {

        axios.post('/user/Movies', {
            movieId: movieId
        })
        .then(async (data) => {
            console.log(data)
                let resp = data.data
                let movie = resp.movieDetails[0]

                let userEnrolledMovies = resp.personalInfo.subscribedMovies
                let userLikedMovies = resp.personalInfo.likedMovies
 
                userEnrolledMovies && setIsMovieEnrolled( userEnrolledMovies.includes(`${movie.id}`) ? true : false )
                setIsMovieLiked( userLikedMovies.includes(movie.id) ? true : false )

                let alltrailers = movie.videos.results.filter((video) => video.type == 'Trailer')
                let likeTrailers = movie.videos.results.filter((video) => video.type != 'Trailer')



                setMovieDetails(movie)
                setTrailers(alltrailers)
                setOtherThanTrailers(likeTrailers)

                alltrailers.length > 0 ? setCurrentVideoLink(alltrailers[0].key) : setCurrentVideoLink(likeTrailers[0].key)

            })
        .catch((err) => console.log(err.message))
        

    }, [])

    

    

    const handleChangeTrailer = (event) => {setCurrentVideoLink(event.target.src.split('/')[4])}

    const handleLikeDislike = async () => {

        await axios.post(`/user/Movies/like`,{
            movieId: movieDetails.id
        })
        .then(async (data) => {
       
            setIsMovieLiked(!isMovieLiked)
        })
        .catch((err) => {console.log(err)})

    }

    const handleEnrollMovie = async () => {

        if(!isMovieEnrolled){
            await axios.post('/user/Movies/subscribe',{
                movieId: movieDetails.id
            })
            .then( (data) => {
                if(data.data == 'done'){setIsMovieEnrolled(true)}
                else if(data.data == 'full'){
                    setErrorIsHidden(false)
                }
        
            })
            .catch( (err) => console.log(err))
        }else{
            alert('cant')
        }

        // isMovieEnrolled ?   : setIsMovieEnrolled(!isMovieEnrolled)
    }

    const handleRedirectingToBundles = () => {
        return navigate('/payments')
    }

    if (!movieDetails || ! currentVideoLink) {
        return (
            <Loading></Loading>
        )
    }
    return (
        <div className={["pt-10", styles.allPageContainer].join(' ')} >

            <div className={["w-full ", styles.movieContainer].join('')}>
                {currentVideoLink != undefined && <ReactPlayer url={`https://www.youtube.com/watch?v=${currentVideoLink}`} pip={true} width='100%' height='100%' playing={true} muted={true} controls={false} className={styles.reactPlayer} />}
            </div>

            <Notification hidden={errorIsHidden} title={'Bundle Is over'} content={`Sadly your monthly bundle is over but you can subscribe to other bundle, where you can keep your movie and enroll into new movies, would you like to do that ?`} firstOption={'Yes'} handleDoneBtn={handleRedirectingToBundles} secondOption={'Not now'} secondOptionAction={() => setErrorIsHidden(true)}  ></Notification>

            <div className="h-full text-white pl-10 mt-2 ">

                <div>

                    <div className="flex ">
                        <div className="w-4/6">
                            <h1 className="text-6xl mb-10">{movieDetails.title}</h1>
                        </div>
                        
                        <div className="w-2/6 flex justify-end pr-20 space-x-12 mt-3 h-16">
                                <h1 onClick={handleEnrollMovie}>{isMovieEnrolled ? <h1 className="text-3xl pt-3 pb-3 pr-6 border border-white flex bg-blue-700"><span className="flex"> < BiCheck size={40}></BiCheck> <span className="ml-3">Enrolled</span> </span></h1> : <h1 className="text-3xl border border-white pt-3 pb-3 px-10 hover:cursor-pointer">Enroll</h1>}</h1>
                                <h1 className="" onDoubleClick={handleLikeDislike}>{ isMovieLiked ? <AiFillHeart size={55}></AiFillHeart> : <AiOutlineHeart size={55}></AiOutlineHeart> }</h1>

                        </div>
                    </div>

                    <div className="mt-8">
                        <h1 className="text-xl leading-8 pr-24 pl-4"> {movieDetails.overview} </h1>
                    </div>

                </div>

                <div className="flex flex-wrap space-x-12 m-auto mt-20 justify-center ">

                    <div>

                        <div className="mt-20">
                            <h1 className="flex"><h1 className="text-4xl font-bold">Budget: </h1> <h1 className="text-4xl ml-2 text-"> ${(parseInt(movieDetails.budget) / 1000000).toFixed(0)} Million </h1> </h1>
                        </div>

                        <div className="mt-20">
                            <h1 className="text-4xl text-bold"><span className="font-bold">Duration:</span> <span className="ml-2">{parseInt(movieDetails.runtime)} min </span></h1>
                        </div>

                    </div>

                    <div>


                        <div className="mt-20">
                            <h1 className="text-4xl text-bold"><span className="font-bold">Vote Average:</span>  <span className={(movieDetails.vote_average >= 7 ? ' ' : 'bg-yellow-700') + " rounded-full p-3 font-bold"} >{(movieDetails.vote_average)}</span> </h1>
                        </div>


                        <div className="mt-20">
                            <h1 className="text-4xl text-bold"><span className="font-bold">Revenue:</span> <span className="ml-2"> ${(parseInt(movieDetails.revenue) / 1000000).toFixed(0)} Million</span>  </h1>
                        </div>

                    </div>

                    <div>


                        <div className="mt-20">
                            <h1 className="text-4xl text-bold"><span className="font-bold">Released:</span>  <span className=" rounded-full p-3 " >{(movieDetails.release_date.split('T')[0])}</span> </h1>
                        </div>


                        <div className="mt-20">
                            <h1 className="text-4xl text-bold"><span className="font-bold">Genres:</span>  <span className="ml-3">{movieDetails.genres[0].name }{movieDetails.genres.length > 1 ? ` -  ${movieDetails.genres[1].name}` : ' ' }</span> </h1>
                        </div>

                    </div>

                </div>

                <div className="flex flex-wrap space-x-44 w-full m-auto mt-32 justify-center">
                    {movieDetails.production_companies.map((company, index) => {
                        return (index < 4 && (company.logo_path != null ? <img key={index} src={`https://image.tmdb.org/t/p/w1280/${company.logo_path}`} width={'170px'} height={'100px'} className={'ml-5 bg-white rounded mt-10'} alt={company.name} /> : <h1 className="text-3xl font-bold mt-10">{company.name}</h1>)
                        )
                    })
                    }
                </div>

                <div className="mt-32">


                    <h1 className="text-4xl mb-8">Trailers and More</h1>

                    <div className="flex flex-wrap">
                        {trailers != undefined && movieDetails.videos.results.map((trailer, index) => {
                            return index < (showMorePressed ? 20 : 8) && <img key={index} className={(currentVideoLink == trailer.key ? 'border border-white scale-110 ' : ' ') + 'hover:scale-105 ml-8 mb-6 hover:border-white  hover:border'} src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`} width='300px' height='200px' onClick={handleChangeTrailer} />
                        })}

                    </div>

                    {movieDetails.videos.results.length > 8 && <div>
                        <h2 className="justify-center text-xl flex hover:font-bold hover:cursor-pointer" onClick={() => setShowMorePressed(!showMorePressed)}>Show {showMorePressed ? 'Less' : 'More'}{showMorePressed ? <AiOutlineUp className="mt-1 ml-1 font-bold" size={20}></AiOutlineUp> : <AiOutlineDown className="mt-1 ml-1 font-bold" size={20}></AiOutlineDown>}</h2>
                    </div>}


                </div>

            </div>



        </div>
    )
}

export default MovieDetail
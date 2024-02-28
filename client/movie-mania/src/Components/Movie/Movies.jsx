import React from 'react';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'


const Movies = ({item}) => {
  const [like, setLike] = useState(false);


  const navigate = useNavigate()

  const handleClick = () => {

    navigate('/user/movieDetails',{
      state: { movieId: item.id }
    })

  }

  return (
    //w-[160px] sm:w-[200px] md:w-[240px] lg:w-[300px] inline-block cursor-pointer relative p-1 ml-5
<div className='w-auto  inline-block cursor-pointer relative p-1 ml-5' onClick={handleClick} >
    <img src={`https://image.tmdb.org/t/p/w154/${item?.poster_path}`} alt={item?.title} />
   <div className='absolute top-0 left-0 w-full h-full hover:outline-0 hover:bg-black/80 opacity-0 hover:opacity-100 text-white '>
       <p className='white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center'>{item?.title}</p>
       <p>

           {like ? <FaHeart className='absolute top-4 left-4 text-gray-400'/> : <FaRegHeart className='absolute top-4 left-4 text-gray-400'/>}
       </p>
   </div>

  </div>
  )
}

export default Movies
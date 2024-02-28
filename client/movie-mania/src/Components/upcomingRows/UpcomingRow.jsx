
import React, { useEffect, useState } from 'react';
import Movies from '../Movie/Movies';


const UpcomingRow = ({ title , MOVIES}) => {
  const [movies, setMovies] = useState(MOVIES);
  console.log(MOVIES)

    useEffect(() => { 
      setMovies(MOVIES)
    }, [MOVIES])

  return (
    <>
      <h2 className='text-white font-bold md:text-xl p-4'>{title}</h2>
       <div className='relative flex items-center group'>
        <div>
            {movies && movies.map((item, id) => {return(
            <Movies key={id} item={item}/>
            )})}
        </div>
        </div> 
    </>
  );
};

export default UpcomingRow;
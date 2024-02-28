import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Movies from '../Movie/Movies';
import {AiOutlineDown, AiOutlineUp} from 'react-icons/ai'


const Row = ({ title, moviesArr, fetchURL}) => {
  const [movies, setMovies] = useState(moviesArr);
  const [seeMore, setSeeMore] = useState(title == 'All Movies')
  const [showMorePressed, setShowMorePressed] = useState(false)

  useEffect(() => {
    axios.get(fetchURL).then((response) => {
      setMovies(response.data.results.slice(0, 6));
    });
  }, [fetchURL]);


  return (
    <>
      <h2 className='text-white font-bold md:text-4xl p-4 mt-4 '>{title}</h2>
       <div className='relative flex items-center group'>
        <div  id={'slider'}>
            { moviesArr && moviesArr.map((item, id) => (
             (showMorePressed ? id < 99 : id < 6) &&  <Movies key={id} item={item} />
            ))}
        </div>
       
        </div> 
        {seeMore && moviesArr.length > 6 && <div>
          <h2 className="justify-center text-center text-2xl flex hover:font-bold hover:cursor-pointer text-white mt-2 mb-4 mr-24 " onClick={() => setShowMorePressed(!showMorePressed)}>Show {showMorePressed ? 'Less' : 'More'}{showMorePressed ? <AiOutlineUp className="mt-1 ml-1 font-bold" size={20}></AiOutlineUp> : <AiOutlineDown className="mt-1 ml-1 font-bold" size={20}></AiOutlineDown>}</h2>
          
          </div>}
    </>
  );
};

export default Row;
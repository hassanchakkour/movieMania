import React from 'react';
import {AiOutlineSearch} from 'react-icons/ai';
import {BsFillMicFill} from 'react-icons/bs';


const SearchBar = ({action}) => {


  return (
    <div className='text-center mt-4'>
        <div>
          <label className='absolute text-4xl text-gray-400'><AiOutlineSearch /></label>
            <input 
            type="search" 
            className='bg-black bg-opacity-40 w-96 h-10 outline-0  rounded text-center text-gray-400'
            placeholder='Search for a Show, Movie etc...'
            onChange={action}
            />
            <label className='absolute mt-1 left-[79%] md:left-[67%] text-3xl text-gray-400 sm:left-[74%] lg:left-[62%]'><BsFillMicFill className='cursor-pointer'/></label>
        </div>
        
        </div>
  )
}

export default SearchBar
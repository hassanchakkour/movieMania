import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import requests from "../../Request";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Main = (props) => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(props.movie);

  const handleMoreInfoBtn = () => {
    navigate("/user/movieDetails", {
      state: { movieId: props.movie.id },
    });
  };

  return (
    <div className="w-full h-[700px] text-white">
      <div className="w-full h-full">
        <div className="absolute w-96 h-[550px] bg-gradient-to-r from-black"></div>
        <img
          className="w-full h-full object-cover"
          src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
          alt={movie?.title}
        />
        <div className="absolute w-100 top-[50%] ml-5 p-4 md:p-8">
          <h1 className="text-4xl md:text-5xl font-bold">{movie?.title}</h1>
          <div className="my-4 mb-4">
            {/* <button className='border bg-white opacity-90 text-black  border-gray-300 py-2 px-5' ><FaPlay className='inline-block mr-3'/>Play</button> */}
            <button
              className="border bg-white opacity-80 text-black border-gray-300 py-2 px-5 ml-4"
              onClick={handleMoreInfoBtn}
            >
              <AiOutlineInfoCircle className="inline-block mr-1 text-xl" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;

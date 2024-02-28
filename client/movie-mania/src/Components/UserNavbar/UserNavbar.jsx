import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { CgLogOut } from 'react-icons/cg'
import axios from 'axios'
import styles from '../AdminNavBar/AdminNavBarCss.module.css'

const UserNavbar = () => {

  const navigate = useNavigate()

  const handleLogout = async () => {
    await axios.get('/Logout')
      .then((data) => {
        navigate('/')
      })
  }

  return (
    <div>
      <div className='flex items-center justify-between p-4 z-[100] absolute w-full'>
        <Link to="/user/movies" ><h1 className='text-white text-2xl font-bold cursor-pointer'>Movie Mania</h1></Link>
        <div className='inline-flex mr-10'>
          <ul className='text-white list-none inline-flex'>

            <Link to='/user/news' > <li className='pr-10'> News</li> </Link>
            
            <div>
              <Link to='/user/profile' className='peer'> <li className='px-6 mr-5'>Profile</li></Link>

              <div className="hidden peer-hover:flex hover:flex w-[150px] flex-col bg-white drop-shadow-lg absolute text-black">
                <Link to="/user/myInfo" className="px-5 py-3 hover:bg-gray-200" href="#">My info</Link>
                <Link to="/user/myMovies" className="px-5 py-3 hover:bg-gray-200" href="#">My Movies</Link>
                <h1 className={['px-5 py-3 hover:bg-gray-200 hover:cursor-pointer ', styles.logoutIcon].join(' ')} onClick={() => handleLogout()}>Logout </h1>
              </div>
            </div>

          </ul>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default UserNavbar
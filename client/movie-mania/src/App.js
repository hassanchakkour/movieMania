import {Routes, Route, useNavigate} from 'react-router-dom'
import Landing from '../src/Routes/Landing/Landing';
import './CommunColors.css'
import React,{useEffect} from 'react'
import Loading from './Components/Loading/Loading';
import jwt_decode from 'jwt-decode'
import axios from 'axios';
import requests from './Request';

const LazyAdminNavBar = React.lazy(() => import('./Components/AdminNavBar/AdminNavBar'))
const LazySuccess = React.lazy(() => import('./Components/Success/Success'))
const LazyAdminMovies = React.lazy(() => import('./Routes/Admin/AdminMovies/AdminMovies'))
const LazyAdminDashboard = React.lazy(() => import('./Routes/Admin/AdminDashboard/AdminDashboard'))
const LazyAdminUsers = React.lazy(() => import('./Routes/Admin/AdminUsers/AdminUsers'))
const LazyBundles = React.lazy(() => import('./Routes/Bundles/Bundles'))
const LazyAdminBundles = React.lazy(() => import('./Routes/Admin/AdminBundles/AdminBundles'))
const LazyLogout = React.lazy(() => import('./Components/Logout/Logout'))
const LazyMovieDetails = React.lazy(() => import('./Routes/User/MovieDetails/MovieDetails'))
const LazyUserNavbar = React.lazy(() => import('./Components/UserNavbar/UserNavbar'))
const LazyUserHome = React.lazy(() => import('./Routes/User/UserHome/Home'))
const LazyMyMovies = React.lazy(() => import('./Routes/User/MyMovies/MyMovies')) 
const LazyUserNews = React.lazy(() => import('./Routes/User/UserNews/UserNews'))
const LazyUserProfile = React.lazy(() => import('./Routes/User/UserProfile/UserProfile'))

function App() {

  const navigate = useNavigate()

  const handleGoogleCallBack = async (resp) => {

    const userInfo = jwt_decode(resp.credential)

    axios.post('/googleLogin',{
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      email: userInfo.email
    })
    .then(async (data) => {
      let resp = data.data
      console.log(resp)
      if(resp == 'done') return navigate('/payments')
      return navigate('/user/movies')
    })

  }

  useEffect(() => {
    /* global google */
    
    google.accounts.id.initialize({
      client_id: "1079385549367-dtetskd0vu0373kfneufj2qh130de01k.apps.googleusercontent.com",
      callback: handleGoogleCallBack
    })

    google.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      {theme: 'outline', size: 'large'}
    )

  },[])

  return (
    <React.StrictMode>
    <div className="App">


    <React.Suspense fallback={<Loading></Loading>}>
      
      <Routes>
        
          <Route path='/' element={<Landing />}> 

            <Route path='success' element={<LazySuccess/>} ></Route>

          </Route>


          <Route path = 'payments' element = {<LazyBundles />} />


          <Route path='admin' element={<LazyAdminNavBar/>}>

                <Route path='' element={<LazyLogout/>} />

                <Route path='dashboard' element={<LazyAdminDashboard/>} />

                <Route path='users' element={<LazyAdminUsers/>} />

                <Route path='movies' element={ <LazyAdminMovies /> } />
                
                <Route path='bundles' element={<LazyAdminBundles/>} />

          </Route>

            <Route path='user' element={<LazyUserNavbar />} > 

              <Route path='movies' element={<LazyUserHome/>} />

              <Route path='movieDetails' element = {<LazyMovieDetails movieId='979163' key={'testing'} />} />

              <Route path='myMovies' element = {<LazyMyMovies />} />

              <Route path='news' element = {<LazyUserNews  fetchURL={requests.requestUpcoming}/>}/>

              <Route path='profile' element = {<LazyUserProfile />} />



              </Route>
          
      </Routes>

      </React.Suspense>
 
    </div>
    </React.StrictMode>

  );
}

export default App;

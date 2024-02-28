import { Link,Outlet, useNavigate} from "react-router-dom"
import {CgLogOut} from "react-icons/cg"
import styles from './AdminNavBarCss.module.css'
import axios from 'axios'

const AdminNavBar = () => {

    const navigate = useNavigate()

    const handleLogout = async () => {
        await axios.get('/Logout')
        .then((data) => {
            navigate('/')
        })
    }

    return(
        <>
            <div className={["flex justify-end px-10 text-2xl py-2 bg-transparent", styles.navContainer].join(' ')}>

                <div className="flex w-2/3 justify-end space-x-20  ">
                    <Link to = '/admin/dashboard' className={['p-3',styles.newNavPath].join(' ')}>Dashboard</Link>
                    <Link to = '/admin/users' className={['p-3',styles.newNavPath].join(' ')}>Users</Link>
                    <Link to = '/admin/movies' className={['p-3',styles.newNavPath].join(' ')}>Movies</Link>
                    <Link to = '/admin/bundles' className={['p-3',styles.newNavPath].join(' ')}>Bundles</Link>
                </div>

                <div className="flex  w-1/3 justify-end">

                     <button className={['p-3',styles.logoutIcon].join(' ')} onClick={ () => handleLogout()}> <CgLogOut size={32}/> </button>

                </div>

            </div>
            <Outlet></Outlet>
        </>
    )
}

export default AdminNavBar
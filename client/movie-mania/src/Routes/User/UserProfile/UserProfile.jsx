import React from 'react';
import { useState } from 'react';
import styles from './UserProfilecss.module.css';

const UserProfile = () => {

    const [show, setShow] = useState(false)

  return (
    <div className={styles.pageColor}>
        <br /><br /><br />
        <div className='flex'>
            <div className={styles.userInfo}>
                <h2 className='text-white text-3xl ml-20 '>My Info</h2>
                <div className={styles.childUser}>
                    <br />
                    <form action="#">
                    <label htmlFor="firstName" className='pt-2 mb-2 text-gray-700'>First Name</label><br />
                <input type="text"
                className='bg-gray-50 border outline-0 border-gray-300 w-64 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Enter First Name'
                value=''
                />
                <br /><br />
                    <label htmlFor="lastName" className=' mb-2 text-gray-700 font-normal'>Last Name</label><br />
                <input type="text"
                className='bg-gray-50 border outline-0 border-gray-300 w-64 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Enter Last Name'
                value=''
                />
                <br /><br />
                    <label htmlFor="lastName" className=' mb-2 text-gray-700 font-normal'>Email</label><br />
                <input type="email"
                disabled
                className='bg-gray-50 border outline-0 border-gray-300 w-64 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='user@example.com'
                value=''
                />
                <br /><br />
                <button onClick={() => setShow(true)} className={styles.changeBtn}>Change Password</button>
                <br />
                {show? <div>
                <label  className=' mb-2 text-gray-700 font-normal'>Current Password</label><br />
                <input type="password"
                className='bg-gray-50 border outline-0 border-gray-300 w-64 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                 /><br />    
                    <label  className=' mb-2 text-gray-700 font-normal'>New Password</label><br />
                    <input type="password"
                className='bg-gray-50 border outline-0 border-gray-300 w-64 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Enter New Passowrd'
                />
                <br />
                    <label className=' mb-2 text-gray-700 font-normal'>Confirm Password</label><br />
                <input type="password"
                className='bg-gray-50 border outline-0 border-gray-300 w-64 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Confirm New Password'
                />
                </div>:null}
                
                <br />
                </form>
                </div>
            </div>
        </div>
        <button type='submit' className={styles.submitBtn}>Save Changes</button>
    </div>
  )
}

export default UserProfile
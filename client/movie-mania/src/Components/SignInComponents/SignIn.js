import { useEffect, useState } from "react"
import './signInCss.css'
import { BiError } from 'react-icons/bi'
import SignInWithGoogle from "./SignInWithGoogle" // TODO google Login
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

let userObjectSkeleton = {
    email: '',
    password: ''
}

let errorObjectSkeleton = {
    errorClass: 'text-red-500 flex mt-6 hidden ',
    errorContent: '',
}

let registerErrorSkeleton = {
    errorClassRegister: 'text-red-500 flex mt-6 hidden ',
    errorContentRegister: '',
}

let userRegisterObjectSkeleton = {
    firstName: '',
    lastName: '',
    registerPassword: '',
    rePassword: '',
    age: '',
    registerEmail: ''
}

const SignIn = () => {
    const navigate = useNavigate()

    const [errorObject, setErrorObject] = useState(errorObjectSkeleton)
    const { errorClass, errorContent } = errorObject

    const [errorRegister, setErrorRegister] = useState(registerErrorSkeleton)
    const { errorClassRegister, errorContentRegister } = errorRegister

    const [userObject, setUserObject] = useState(userObjectSkeleton)
    const { email, password } = userObject

    const [userRegisterObject, setUserRegisterObject] = useState(userRegisterObjectSkeleton)
    const { firstName, lastName, registerPassword, rePassword, age, registerEmail } = userRegisterObject

    const [divContentClass, setDivContentClass] = useState('')



    const showErrorSignIn = (bool = true) => {

        if (bool) {

            setErrorObject({ ...errorObject, ['errorClass']: errorClass.replace('hidden', '') })

        } else {
            if (errorClass.includes('hidden')) return
            setErrorObject({ ...errorObject, ['errorClass']: errorClass + ' hidden' })
        }

    }

    const handleChange = async (event) => {
        const { name, value } = event.target

        if (divContentClass != 'hidden') {

            await setUserObject({ ...userObject, [name]: value })
            showErrorSignIn(false)

        } else {
            showErrorRegister(false)
            await setUserRegisterObject({ ...userRegisterObject, [name]: value })

        }

    }

    const handleSubmitSignIn = async (e) => {
        e.preventDefault()

        if ((email.length <= 5 || !email.includes('@') || !email.includes('.')) && email.toLowerCase() != 'admin') {
            setErrorObject({ ...errorObject, ['errorContent']: 'Please Insert Email Properly', ['errorClass']: errorClass.replace('hidden', '') })
            return
        }

        if (password.length <= 3) {
            setErrorObject({ ...errorObject, ['errorContent']: 'Please Insert Password Properly', ['errorClass']: errorClass.replace('hidden', '') })
            return
        }

        (async () => {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })
            });

            const content = await response.json();

            if (content == 'admin') return navigate('admin/dashboard')

            const isUser = content
                ? navigate('user/movies')
                : setErrorObject({ ...errorObject, ['errorContent']: 'User does not exist', ['errorClass']: errorClass.replace('hidden', '') })

        })();

    }


    const showErrorRegister = (bool = true) => {

        if (bool) {

            setErrorRegister({ ...errorRegister, ['errorClassRegister']: errorClassRegister.replace('hidden', '') })

        } else {
            if (errorClassRegister.includes('hidden')) return
            setErrorRegister({ ...errorClassRegister, ['errorClassRegister']: errorClassRegister + ' hidden' })
        }

    }

    const handleSubmitRegister = (e) => {
        e.preventDefault()

        if (firstName.length < 2) {
            setErrorRegister({ ...errorRegister, ['errorContentRegister']: 'First Name is too short', ['errorClassRegister']: errorClassRegister.replace('hidden', '') })
            return
        }

        if (lastName.length < 2) {
            setErrorRegister({ ...errorRegister, ['errorContentRegister']: 'Last Name is too short', ['errorClassRegister']: errorClassRegister.replace('hidden', '') })
            return
        }

        if (registerEmail.length < 6 || !String(registerEmail).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            setErrorRegister({ ...errorRegister, ['errorContentRegister']: 'Email Address not valide', ['errorClassRegister']: errorClassRegister.replace('hidden', '') })
            return
        }

        if (registerPassword.length < 6) {
            setErrorRegister({ ...errorRegister, ['errorContentRegister']: 'Password is too short', ['errorClassRegister']: errorClassRegister.replace('hidden', '') })
            return
        }

        // if (age < 18 || age > 100) {
        //     setErrorRegister({ ...errorRegister, ['errorContentRegister']: 'Our movies not suitable for your age', ['errorClassRegister']: errorClassRegister.replace('hidden', '') })
        //     return
        // }

        if (registerPassword != rePassword) {
            setErrorRegister({ ...errorRegister, ['errorContentRegister']: 'Passwords does not match', ['errorClassRegister']: errorClassRegister.replace('hidden', '') })
            return
        }

        let numOfCapital = 0

        for (let i = 0; i < registerPassword.length; i++) {
            if (registerPassword.charCodeAt(i) >= 65 && registerPassword.charCodeAt(i) <= 90 && registerPassword.charAt(i).toUpperCase() == registerPassword.charAt(i)) numOfCapital++
        }

        if (numOfCapital == 0) {
            setErrorRegister({ ...errorRegister, ['errorContentRegister']: 'Passwords must contains capital letters', ['errorClassRegister']: errorClassRegister.replace('hidden', '') })
            return
        }

        axios.post('/register', {
            firstName: firstName,
            lastName: lastName,
            age: age,
            password: registerPassword,
            email: registerEmail,
        })
            .then(function (response) {
                let content = response.data

                if (content == 'exist') return setErrorRegister({ ...errorRegister, ['errorContentRegister']: 'User Email is already in use', ['errorClassRegister']: errorClassRegister.replace('hidden', '') })

                if (content == 'created') {
                    navigate('/payments')
                }

            })
            .catch(function (error) {
                this.setErrorRegister({ ...errorRegister, ['errorContentRegister']: `${error}`, ['errorClassRegister']: errorClassRegister.replace('hidden', '') })
            });

    }

    const handleRegisterButton = () => {
        if (divContentClass == 'hidden') setDivContentClass('')
        else setDivContentClass('hidden')
    }

    if (divContentClass != 'hidden') {

        return (

            <div className="w-full">

                <form className="bg-white shadow-md rounded-lg px-12 pt-12 pb-20 mb-4" onSubmit={handleSubmitSignIn}>

                    <div className={divContentClass}>

                        <h1 className=" text-3xl mb-8 font-bold text-center text-black ">Welcome Back!</h1>



                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Email" onChange={handleChange} name="email" value={email} required />
                        </div>

                        <div className="mb-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Password
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="*************" onChange={handleChange} name="password" value={password} required />
                        </div>

                        <div className="text-black mb-10">
                            <span>Don't have a account ? <a to="/register" className="text-blue-700 hover:text-blue-300 hover:cursor-pointer" onClick={handleRegisterButton}>Register</a> </span>
                            <br></br>
                            <span className={errorClass}><span className="animate-bounce mr-1"><BiError size={20}></BiError></span><span className="text-red-500 text-sm ml-1">{errorContent}</span></span>
                        </div>

                        <div className="items-center justify-between mt-10 ">

                            <div className="w-full mt-10 mb-4"><div id='signInDiv' className="mt-5">
                                
                                </div>
                                
                                    </div>


                            <button className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="Submit">
                                Sign In
                            </button>



                            {/* <button className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-8" type="button">
                     Sign In With Google
                    </button> */}
                            {/* <SignInWithGoogle className="googleButton">test</SignInWithGoogle> */}
                        </div>

                    </div>
                    <div className="mt-6">

                        <p className="text-center text-gray-500 text-xs">
                            &copy;2022 Movie Mania. All rights reserved.
                        </p>

                    </div>
                </form>
            </div>
        )
    } else {
        return (

            <div className="w-full">

                <form className="bg-white shadow-md rounded-lg px-12 pt-3 pb-4 mb-2" onSubmit={handleSubmitRegister}>


                    <h1 className=" text-3xl mb-4 font-bold text-center text-black ">Register</h1>


                    <div className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            First Name
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="First name" onChange={handleChange} name="firstName" value={firstName} required />
                    </div>

                    <div className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Last Name
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Last name" onChange={handleChange} name="lastName" value={lastName} required />
                    </div>

                    <div className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Last name" onChange={handleChange} name="registerEmail" value={registerEmail} required />
                    </div>

                    {/* <div className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Age
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="number" placeholder="Age" onChange={handleChange} name="age" value={age} required />
                    </div> */}

                    <div className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="*************" onChange={handleChange} name="registerPassword" value={registerPassword} required />
                    </div>

                    <div className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Re-Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="*************" onChange={handleChange} name="rePassword" value={rePassword} required />
                    </div>

                    <div className="text-black mb-6">
                        <span>Already have a account ? <a className="text-blue-700 hover:text-blue-300 hover:cursor-pointer" onClick={handleRegisterButton}>Sign In</a> </span>
                        <br></br>
                        <span className={errorClassRegister}><span className="animate-bounce mr-1 text-red-500 "><BiError size={20}></BiError></span><span className="text-sm ml-1">{errorContentRegister}</span></span>
                    </div>

                    <div className="items-center justify-between mt-6">
                        <button className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="Submit">
                            Register
                        </button>
                    </div>

                </form>
            </div>

        )
    }
}

export default SignIn
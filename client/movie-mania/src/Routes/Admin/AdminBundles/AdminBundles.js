import styles from './AdminBundlesCss.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Notification from '../../../Components/Notification/Notification'
import {useNavigate} from 'react-router-dom'


let skeletonOfCurrentBundle = {

    title: '',
    price: '',
    limit: '',
    titleOfContainer: 'Add Bundle',
    btn: 'Add',
    id: ''

}

let errorSkeleton = {

    title: 'Error',
    content: '',
    hidden: true
}

const AdminBundles = () => {

    const [currentBundle, setCurrentBundle] = useState(skeletonOfCurrentBundle)

    const [fetchedData, setFetchedData] = useState()

    const [bundlesData, setBundlesData] = useState()

    const [searchInput, setSearchInput] = useState('')

    const [errorDetails, setErrorsDetails] = useState(errorSkeleton)

    const navigate = useNavigate()

    const getTableData = async () => {

        await axios.request('/admin/bundles')
            .then((data) => {

                data.data == 'forbidden' && navigate('/')

                let response = data.data.sort(function (a, b) {
                    return a.price - b.price
                })

                setFetchedData(response)

            }).catch((err) => {
                let errorAuth = err.response.data
                if(errorAuth)navigate('/')
            })

    }

    useEffect(() => {


        getTableData()

    }, [])


    useEffect(() => {

        setBundlesData(fetchedData)

    }, [fetchedData])


    const handleSearch = (event) => {
        let inputSearch = event.target.value

        setSearchInput(inputSearch)

        if (inputSearch == ' ') {
            setBundlesData(fetchedData)
            return
        }

        let splitedSearchArr = inputSearch.split(' ')

        let arrOfElement = ['limit', 'price']

        // TODO advanced Search

        if (arrOfElement.includes(splitedSearchArr[0].toLowerCase()) && splitedSearchArr.length == 3) {

            let searchBasedOn = splitedSearchArr[0] == 'limit' ? 'movieLimit' : 'price'

            let compareSign = splitedSearchArr[1]

            if (compareSign == '>') {
                setBundlesData(fetchedData.filter((bundle) => parseFloat(bundle[`${searchBasedOn}`]) > parseFloat(splitedSearchArr[2])))
                return
            }

            if (compareSign == '<') {
                setBundlesData(fetchedData.filter((bundle) => parseFloat(bundle[`${searchBasedOn}`]) < parseFloat(splitedSearchArr[2])))
                return
            }

            if (compareSign == '=') {
                setBundlesData(fetchedData.filter((bundle) => parseFloat(bundle[`${searchBasedOn}`]) == parseFloat(splitedSearchArr[2])))
                return
            }

            if (compareSign == '>=') {
                setBundlesData(fetchedData.filter((bundle) => parseFloat(bundle[`${searchBasedOn}`]) >= parseFloat(splitedSearchArr[2])))
                return
            }

            if (compareSign == '<=') {
                setBundlesData(fetchedData.filter((bundle) => parseFloat(bundle[`${searchBasedOn}`]) <= parseFloat(splitedSearchArr[2])))
                return
            }
        }


        setBundlesData(fetchedData.filter((bundle) => bundle.title.toLowerCase().includes(inputSearch.toLowerCase())))

    }


    const handleBtnClick = (event) => {

        let arrOfInfo = event.target.id.split(':')

        let typeOfHandling = arrOfInfo[0]
        let titleOfBundle = arrOfInfo[1]

        if (typeOfHandling == 'delete') {

            alert('Are u sure u want to delete ?')

            handleAddNewBundle()

            setFetchedData(fetchedData.filter((data) => data.title != titleOfBundle))

            let currentBundleTarget = bundlesData.filter((bundle) => bundle.title == titleOfBundle)[0]

            axios.delete(`/admin/bundles/${currentBundleTarget._id}`) // TODO delete will affect the dashboard and the relation between bundles

            return
        }

        if (typeOfHandling == 'edit') {

            let currentBundleTarget = bundlesData.filter((bundle) => bundle.title == titleOfBundle)[0]

            setCurrentBundle({ ...currentBundle, ['price']: currentBundleTarget.price, ['title']: currentBundleTarget.title, ['limit']: currentBundleTarget.movieLimit, ['id']: currentBundleTarget._id, ['titleOfContainer']: 'Edit Bundle', ['btn']: 'Edit' })
        }

    }

    const handleCurrentBundleChange = (event) => {

        let name = event.target.name
        let val = event.target.value

        setCurrentBundle({ ...currentBundle, [name]: val })

    }

    const handleAddNewBundle = () => {
        setCurrentBundle({ ...currentBundle, ['price']: '', ['title']: '', ['limit']: '', ['id']: '', ['titleOfContainer']: 'Add bundle', ['btn']: 'Add' })
    }

    const handleAddEditBundleBtn = (event) => {



            if (!currentBundle.title) {
                setErrorsDetails({ ...errorDetails, ['content']: 'Title is Empty !', ['hidden']: false })
                return
            }

            if (parseInt(currentBundle.price) <= 0) {
                setErrorsDetails({ ...errorDetails, ['content']: 'Edit Price !', ['hidden']: false })
                return
            }

            if (parseInt(currentBundle.limit) <= 0 || currentBundle.limit == '') {
                setErrorsDetails({ ...errorDetails, ['content']: 'Edit Limit !', ['hidden']: false })
                return
            }

            let bundlesWithSameName = fetchedData.filter((bundle) => bundle.title == currentBundle.title)

            if (currentBundle.btn == 'Add') {


                if (bundlesWithSameName.length >= 1) {
                    setErrorsDetails({ ...errorDetails, ['content']: 'Bundle With the same name already exist !', ['hidden']: false })
                    return
                }

                axios.post('/admin/bundles/', {

                    title: currentBundle.title,
                    movieLimit: currentBundle.limit,
                    price: currentBundle.price

                }).then((data) => {

                    if (data.status == 200) {
                        getTableData()
                    }

                })

            } else {



                if (bundlesWithSameName.length == 1 && bundlesWithSameName[0]._id != currentBundle.id) {
                    setErrorsDetails({ ...errorDetails, ['content']: 'Bundle With the same name already exist', ['hidden']: false })
                    return
                }

                axios.patch(`/admin/bundles/${currentBundle.id}`, {

                    title: currentBundle.title,
                    movieLimit: currentBundle.limit,
                    price: currentBundle.price

                }).then((data) => {
                    if (data.status == 200) {
                        getTableData()
                    }
                })

            }



    }

    const handleDoneBtn = () => {
        setErrorsDetails({ ...errorDetails, ['hidden']: true })
    }

    return (
        <div className={["h-full w-full p-10", styles.allContentContainer].join(' ')}>

            <div className='text-center text-4xl text-white'>
                <h1>Table of Bundles</h1>
            </div>

            <div className={['mt-14  h-3/4', styles.contentOfThePage].join(' ')}>

                <div className='text-2xl text-white ml-2 w-2/6 h-auto mb-1'>
                    <Notification content={errorDetails.content} title={errorDetails.title} hidden={errorDetails.hidden} handleDoneBtn={handleDoneBtn}  ></Notification>
                    <form>
                        <div className="flex">
                            <div className=" xl:w-96">
                                <div className="input-group relative flex flex-wrap items-stretch w-full mb-2 rounded">
                                    <input type="search" className={["form-control relative flex-auto min-w-0 block w-full px-10 py-1.5 text-base font-normal text-white bg-white bg-clip-padding  rounded transition ease-in-out m-0 focus:text-white  focus:outline-none", styles.searchInput].join(' ')} placeholder="Search" aria-label="Search" aria-describedby="button-addon2" val={searchInput} onChange={handleSearch} />
                                    <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 45" className='absolute w-6 -mt-2 ml-2' width="50px" height="50px"><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" /></svg>
                                    <span className="input-group-text flex items-center px-3 py-1.5 text-base font-normal text-gray-700 text-center whitespace-nowrap rounded" id="basic-addon2">
                                    </span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className='flex w-full '>

                    <div className='w-4/6'>

                        <table className={["w-full h-full rounded-xl", styles.bundlesTable].join(' ')}>
                            <thead className="flex text-white w-full">
                                <tr className="flex w-full mb-4 pt-4 text-2xl">
                                    <th className=" w-1/4">Title</th>
                                    <th className=" w-1/4">Limit</th>
                                    <th className=" w-1/4">Price</th>
                                    <th className=" w-1/4">Manage</th>
                                </tr>
                            </thead>
                            <tbody className={[" text-center flex flex-col items-center justify-between overflow-y-scroll w-full text-white text-xl", styles.tableCss].join(' ')}>
                                {bundlesData != undefined && bundlesData != ' ' ? bundlesData.map((bundle, index) => {
                                    return (

                                        <tr className="flex w-full h-32" key={index}>
                                            <td className="py-2 w-1/4">{bundle.title}</td>
                                            <td className="py-2 w-1/4">{bundle.movieLimit}</td>
                                            <td className="py-2 w-1/4">${bundle.price}</td>
                                            <td className="py-2 w-1/4 font-normal"> <span className='pl-2 pr-6 hover:font-bold hover:cursor-pointer' onClick={handleBtnClick} id={`edit:${bundle.title}`}>Edit</span> <span className='hover:font-bold hover:cursor-pointer' onClick={handleBtnClick} id={`delete:${bundle.title}`} >Delete</span></td>
                                        </tr>


                                    )
                                })

                                    :
                                    <tr className="flex w-full mb-4 h-20">
                                        <td className="py-2 w-1/4">No data Yet</td>
                                        <td className="py-2 w-1/4">No data Yet</td>
                                        <td className="py-2 w-1/4">No data Yet</td>
                                        <td className="py-2 w-1/4 "> <span className='px-6 '>Edit</span> <span>Delete</span></td>
                                    </tr>

                                }
                            </tbody>
                        </table>

                    </div>

                    <div className='w-2/6 pl-10 '>
                        <div className={['w-full py-4 px-10 rounded-xl h-full', styles.addDeleteBundles].join(' ')}>

                            <div className='text-3xl text-center text-white mb-6 font-bold'>
                                <h1>{currentBundle.titleOfContainer}</h1>
                            </div>

                            <div className="mb-5">
                                <label className="block text-white text-2xl mb-2">
                                    Title:
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Title" name="title" onChange={handleCurrentBundleChange} value={currentBundle.title} required />
                            </div>

                            <div className="mb-5">
                                <label className="block text-white text-2xl mb-2">
                                    Limit:
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="number" placeholder="Limit" name="limit" onChange={handleCurrentBundleChange} value={currentBundle.limit} required />
                            </div>

                            <div className={currentBundle.btn == 'Edit' ? 'mb-2' : 'mb-10'}>
                                <label className="block text-white text-2xl mb-2">
                                    Price:
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="number" placeholder="Price in usd" name="price" onChange={handleCurrentBundleChange} value={currentBundle.price} required />
                            </div>

                            {currentBundle.btn == 'Edit' &&
                                <button className='mb-7 w-auto px-2 rounded-full m-auto text-center font-normal text-blue-600 hover:underline hover:cursor-pointer text-md' onClick={handleAddNewBundle}>Add new bundle</button>
                            }

                            <div className={[' w-32 font-bold py-2 px-10 text-xl rounded-full m-auto text-center text-white', styles.addEditBundleBtn].join(' ')} >
                                <button onClick={handleAddEditBundleBtn}>{currentBundle.btn}</button>
                            </div>



                        </div>
                    </div>

                </div>

            </div>


        </div>
    )
}

export default AdminBundles
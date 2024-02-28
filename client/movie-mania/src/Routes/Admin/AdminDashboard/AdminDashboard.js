import CustomChart from '../../../Components/charts/Chart';
import { useEffect, useState } from 'react';
import styles from './AdminDashboardCss.module.css'
import axios from 'axios'
import TopMoviesAdmin from '../../../Components/TopMoviesAdmin/TopMoviesAdmin';
import Loading from '../../../Components/Loading/Loading'
import  {useNavigate } from 'react-router-dom'

let dateIntervalSkeleton = {
    startDate: new Date().toLocaleDateString(),
    endDate: new Date().toLocaleDateString()
}

function AdminDashboard(req, res) {
    let types = ['pie', 'line', 'bar', 'doughnut']

    const navigate = useNavigate()

    const [fetchedData, setfetchedData] = useState('')

    const [currentPage, setCurrentPage] = useState(-1)

    const [dateInterval, setDateInterval] = useState(dateIntervalSkeleton)

    const [bundlesStatistics, setBundlesStatistics] = useState('')

    const [numberOfNewUsers, setNumberOfNewUsers] = useState(0)

    const [topMovies, setTopMovies] = useState('')

    const [bundlesprofit, setBundlesProfit] = useState(0)

    const [chartType, setChartType] = useState('doughnut')

    useEffect(() => {

        const goFetchData = async () => {

            await axios.request('/admin/dashboard')
                .then((resp) => {
                    resp.data == 'forbidden' && navigate('/')
                    let data = resp.data
                    setfetchedData(data)
                    
                }).catch((err) => {
            
                    let authError =  err.response.data
                    if(authError){
                        navigate('/')
                    }
                })
       
                

        }

        goFetchData()

    }, [])

    const setStyle = (num) => {
        return currentPage == num ? styles.currentTitle : styles.nothing
    }

    const handleDateChange = (event) => {
        let target = event.target

        setCurrentPage(target.id)

        let pagesToDateMap = {

            0: getdate(0),
            1: getdate(-7),
            2: getdate(-30),
            3: getdate(-365),
            4: '1/1/1960'

        }

        setDateInterval({ ...dateInterval, ['startDate']: pagesToDateMap[target.id] })
    }

    useEffect(() => {
        if (currentPage == -1) return


        manageBundleStatistics()

        manageNbOfNewUsers()

        manageTopMovies()


    }, [currentPage])


    const manageTopMovies = () => {
        let allMoviesData = fetchedData['moviesStatistics']

        allMoviesData = allMoviesData.sort(function (a, b) {
            return (parseInt(b.count) - parseInt(a.count))
        })

        let arrOfDom = allMoviesData.map((movie, index) => {
            return <TopMoviesAdmin key={index} count={movie.count} details={movie.details} />
        })

        setTopMovies(arrOfDom)

    }

    const handleChartTypeChange = (event) => {
        setChartType(event.target.id)
    }

    const manageNbOfNewUsers = async () => {
        let allUsers = fetchedData['allUsers']

        let count = 0

        for (let i = 0; i < allUsers.length; i++) {

            let currentUser = allUsers[i]

            let registerDate = await convertRegisterDateFormat(currentUser.registrationDate)

            if (timeDifferenceBetweenFirstDateAndSecondInDays(registerDate, dateInterval.startDate) >= 0) {
                count++
            }

        }
        setNumberOfNewUsers(count)
    }

    const manageBundleStatistics = () => {
        let allBundles = fetchedData['bundleStatistics']
        let bundlesArr = []
        let bundlesCount = {}
        let profit = 0

        for (let i = 0; i < allBundles.length; i++) {
            if (timeDifferenceBetweenFirstDateAndSecondInDays(allBundles[i]['registerDate'], dateInterval.startDate) >= 0) {

                profit += parseFloat(allBundles[i].bundlePrice)

                let bundleName = allBundles[i]['bundleTitle']

                if (bundlesCount[bundleName] == undefined) {

                    bundlesCount[bundleName] = 1

                } else {

                    bundlesCount[bundleName] = bundlesCount[bundleName] + 1

                }
            }
        }
        setBundlesProfit(profit.toFixed(2))
        setBundlesStatistics(bundlesCount)
    }

    const setChartTypeStyle = (type) => {
        return chartType == type ? styles.currentChartType : styles.notCurrentChartType
    }

    if(!fetchedData){
        return(
            <Loading/>
        )
    }
      
    // TODO user can change chart Type

    let element = (

        <div>
        <div className='h-1/3'>

        <CustomChart graphType={chartType} graphTitle="" graphData={Object.values(bundlesStatistics)} graphLabels={Object.keys(bundlesStatistics)} ></CustomChart>
        
        </div>

        <div className='flex justify-evenly mt-16 h-1/3'>

            <h1 id="polarArea" className={setChartTypeStyle('polarArea') } onClick={handleChartTypeChange} >Polar</h1>
            <h1 id='line' className={setChartTypeStyle('line') } onClick={handleChartTypeChange} >Line</h1>
            <h1 id='bar' className={setChartTypeStyle('bar') } onClick={handleChartTypeChange}  >Bar</h1>
            <h1 id='doughnut' className={setChartTypeStyle('doughnut') } onClick={handleChartTypeChange}  >doughnut</h1>

        </div>

    </div>
    )
        
    return (
        <div className={["w-full", styles.AllContainer].join(' ')}>
            <div className={['flex justify-center space-x-20 text-white py-2']}>
                <h1 className={setStyle(0)} onClick={handleDateChange} id='0' >Today</h1>
                <h1 className={setStyle(1)} onClick={handleDateChange} id='1' >This week</h1>
                <h1 className={setStyle(2)} onClick={handleDateChange} id='2' >This Month</h1>
                <h1 className={setStyle(3)} onClick={handleDateChange} id='3' >This year</h1>
                <h1 className={setStyle(4)} onClick={handleDateChange} id='4' >All</h1>
            </div>
            <div className={['px-5 w-full flex flex-wrap space-x-10 space-y-10', styles.allContentContainer].join(' ')}>

                <div className={["w-1/4 h-auto rounded-xl text-white mt-10 p-2 pt-4", styles.graph].join(' ')} >
                    <h1 className='text-center text-3xl'>Subscribed Bundles</h1>
                    {Object.values(bundlesStatistics).length > 0 ?
                        element
                        : <h1 className='text-5xl text-center mt-20 ml-2 ' >No Bundles </h1>}

                </div>

                <div className='w-1/2'>

                    <div className={["w-auto h-64 rounded-xl text-white p-10", styles.graph].join(' ')} >
                        <h1 className='text-center text-5xl'>Number Of New Users:</h1>
                        {parseInt(numberOfNewUsers) > 0 ? <p className='text-5xl mt-10 text-center font-bold'>{convertNumberToDisplay(numberOfNewUsers)}</p>
                            : <h1 className='text-5xl mt-22 ml-2 ' >No New Users </h1>}

                    </div>

                    <div className={["w-auto h-64 rounded-xl text-white p-1 mt-10", styles.graph].join(' ')} >

                        <h1 className='text-3xl p-2'>Top Movies:</h1>

                        <div className='overflow-auto w-auto h-3/4 p-3'>
                            {topMovies}
                        </div>

                    </div>

                </div>


                <div className={["w-auto h-auto rounded-xl text-white mt-2 p-4 ", styles.graph].join(' ')} >

                    {Object.values(bundlesStatistics).length > 0 ?

                        <div className='h-full'>

                            <div className='h-1/3  text-center p-2'>

                                <h1 className='text-3xl font-bold tracking-wide'>Total Profit:</h1>

                                <h1 className='text-3xl mt-6'>${bundlesprofit}</h1>

                            </div>

                            <div className='h-1/3 text-center'>

                                <h1 className='text-3xl mb-8 font-bold tracking-wide'>Details:</h1>

                                <div className='w-full '>

                                    {Object.keys(bundlesStatistics).map((value,index) => {
                                        return (<h1 className='text-center w-auto mt-3' key={index} > <span className='text-2xl'>{value}</span>  <span className='m-2 text-2xl'>x</span> <span className='text-2xl'>{bundlesStatistics[value]}</span> </h1>)
                                    })}

                                </div>

                            </div>

                            <div className='text-center mt-24'>
                                <h1 className='text-2xl  hover:cursor-pointer' onClick={() => window.open('https://dashboard.stripe.com/test/payments')}>Check All Payments</h1>
                            </div>

                        </div>
                        : <h1 className='text-5xl text-center mt-20 ml-2 ' >No Profit </h1>}

                </div>


            </div>
        </div>
    );

}

function timeDifferenceBetweenFirstDateAndSecondInDays(firstDate, secondDate) {
    let firstDateArr = firstDate.split("/")
    let secondDateArr = secondDate.split("/")

    let firstDateDay = parseInt(firstDateArr[0])
    let firstDateMonth = parseInt(firstDateArr[1])
    let firstDateYear = parseInt(firstDateArr[2])

    let secondDateDay = parseInt(secondDateArr[0])
    let secondDateMonth = parseInt(secondDateArr[1])
    let secondDateYear = parseInt(secondDateArr[2])

    let firstDateInSeconds = new Date(firstDateYear, firstDateMonth - 1, firstDateDay).getTime() / 1000
    let secondDateInSeconds = new Date(secondDateYear, secondDateMonth - 1, secondDateDay).getTime() / 1000

    return parseInt((firstDateInSeconds - secondDateInSeconds) / (3600 * 24))
}

const getdate = (differenceOfTimeInDays) => {
    let today = new Date();
    let nextMonthDate = new Date(new Date().setDate(today.getDate() + parseInt(differenceOfTimeInDays)));

    let day = nextMonthDate.getDate()
    let month = nextMonthDate.getMonth() + 1
    let year = nextMonthDate.getFullYear()

    return `${day}/${month}/${year}`
}

const convertRegisterDateFormat = (dateStr) => {
    let date = dateStr.split('T')[0]
    date = date.split('-')
    return `${date[2]}/${date[1]}/${date[0]}`
}

const convertNumberToDisplay = (num) => {
    num = `${num / 1000}`.replace('.', ',')
    return num
}

export default AdminDashboard
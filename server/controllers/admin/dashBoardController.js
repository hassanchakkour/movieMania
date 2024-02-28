const extensions = require('../../helper/extensions.js')

const displayDashBoardInfo = async (req, res) => {
   

    let statisticsObject = {

        moviesStatistics: '',
        allUseres: '',
        bundleStatistics: ''

    }

    await extensions.getNumberOfTimeMoviesIsSubscribed().then((response) => {
        statisticsObject['moviesStatistics'] = response
    })
    
    await extensions.getAllUsers().then((response) => {
        statisticsObject['allUsers'] = response
    })

    await extensions.getNumberofBundlesSubscribed().then((response) => {
        statisticsObject['bundleStatistics'] = response
    })

    return res.json(statisticsObject)
}

module.exports = displayDashBoardInfo
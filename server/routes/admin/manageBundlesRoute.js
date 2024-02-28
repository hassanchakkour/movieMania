const { 
    getBundles,
    getBundle,
    addBundle,
    updateBundle,
    deleteBundle
} = require('../../controllers/admin/manageBundlesController')


const express = require('express')
const bundle = require('../../models/bundleSchema')

// initiallizing express
const router = express.Router()


router.get('/', getBundles);

router.get('/:id', getBundle);

 router.post('/', addBundle)

 router.patch('/:id', updateBundle)


router.delete('/:id', deleteBundle)


module.exports = router



const mongoose = require('mongoose');
const bundleSchema = require('../../models/bundleSchema');
const bundle = require('../../models/bundleSchema')


const getBundles = async (req, res) => { 


    try{ 
        const title = req.query.title;
        const movieLimit = req.query.movieLimit;
        const price = req.query.price;

        const filters =  {}

        title && (filters.title = title)
        movieLimit && (filters.movieLimit = movieLimit)
        price && (filters.price = price)

        const projection = { 
            title: 1,
            movieLimit: 1,
            price: 1 
        }

        const bundles = await bundleSchema.find(filters, projection);

        if(bundles){ 
            res.status(200).json(bundles);
        }

    }catch(error){ 
        res.status(500).json({message: "internal Error" `${error.message}`})
    }
}


    const getBundle  = async (req, res) => { 

        try{ 
            const id = req.params.id;

            const bundle = await bundleSchema.findOne({
                _id: id
            });
            if(bundle){ 
                res.status(200).json(bundle)
            } else { 
                res.status(404).json({message: "Bundle Not Found!"})
            }


        }catch(error){ 
            res.status(500).json({message: `${error.message}`})
        }
    }


    const addBundle = async (req, res) => { 

        try{ 

            const bundle = req.body;
            const result = await bundleSchema.create(bundle);

            if(result){
                res.status(200).json({message: "Bundle Added"})
                console.log(bundle)
            } else { 
                res.status(409).json({message: "Failed to add Bundle"})
            }

        }catch(error){
            res.status(500).json({message: "internal Error" `${error.message}`})
        }
    }


    const deleteBundle = async (req, res) => { 

        try{ 
            const id = req.params.id; 

            const deleteBundle = await bundleSchema.deleteOne({ 
                _id: id
            });
            if(deleteBundle){ 
                res.status(200).json({message: "Bundle Deleted"})
                console.log(deleteBundle)
            } else { 
                res.status(404).json({message: "Failed to Delete Bundle!"})
            }
        }catch(error) { 
            res.status(500).json({message: "internal Error" `${error.message}`})
        }
    }


    const updateBundle = async (req, res) => { 

        try{ 
            const bundles = await bundle.findById(req.params.id)
            bundles.title = req.body.title
            const updatedBundle = await bundles.save()
            res.status(200).json(updatedBundle)
            console.log("Bundle Updated")
        }catch(error) { 
            res.status(500).json({message: "internal Error"})
            console.log(error)
        }

    }



module.exports = { 
    getBundles,
    getBundle,
    addBundle,
    deleteBundle,
    updateBundle
}

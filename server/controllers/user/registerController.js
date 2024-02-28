const extensions = require('../../helper/extensions.js')
const userSchema = require('../../models/userSchema.js')
const session = require('express-session')
const dotenv = require('dotenv')
const { v4: uuidv4 } = require('uuid')

dotenv.config({path: "../../.env"})

const {
    stripPublishKey,
    stripSecretKey
} = process.env

const stripe = require('stripe')(stripSecretKey)

const getUserInfo = async (req, res, next) => {
  const requestBody = req.body

  const user = {

    firstName: requestBody.firstName,
    lastName: requestBody.lastName,
    age: requestBody.age,
    email: requestBody.email,
    password: extensions.hashString(requestBody.password)

   }      

    session.currentUserInfo = user
    let userExist 

    extensions.userAlreadyExist(requestBody.email).then( async (result) => {
        if(result){
            return res.send("exist")
        }else{
              let uniqueId = uuidv4()
             
              res.cookie('uuid', `${uniqueId}`, {httpOnly: true})
              req.session[String(uniqueId)] =  user
              // return res.redirect('http://localhost:3000/regiter/payments')
              return res.json("created")
        }
    })
}


const payments = async (req, res, next) => {
  let currentUserId = req.cookies.uuid
  console.log(req.session[currentUserId])
 let userInfo = req.session[currentUserId]

    if(userInfo == undefined){
      return res.status(403).json('forbidden')
    }

    if(userInfo.bundlesId == undefined ){

        await extensions.getAllBundles().then((data) => {
          return res.json(data)
        })

    }else{

      await extensions.getAllBundlesThatUserCanSubscribeTo(userInfo).then((data) => {
        return res.json(data)
      })

    }
    
}


const makePayment = async (req, res) => {
    try {

      let currentUserId = req.cookies.uuid
      let userInfo = req.session[currentUserId]
      let newUserInfo
      if(userInfo['bundlesId'] == undefined){

        newUserInfo = [{...userInfo,['bundlesId']: [req.body.items.bundleId]}]
        req.session[currentUserId] = newUserInfo

      }else{

        userInfo.bundlesId.push(req.body.items.bundleId)

      }

        let bundleToBuy = {
            price_data: {
              currency: "usd",
              product_data: {
                name: req.body.items.bundleName,
              },
              unit_amount: parseInt(req.body.items.bundlePrice) * 100,
            },
            quantity: 1,
          }

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [bundleToBuy],
          success_url: 'http://localhost:3000/success',
          cancel_url: 'http://localhost:3000/',
        })
        
        session.currentBundle = req.body.items.bundleName

        res.json({ url: session.url})
        
      } catch (e) {

        res.status(500).json({ error: e.message })
        
      }

}

module.exports = {
    getUserInfo,
    makePayment,
    payments
}


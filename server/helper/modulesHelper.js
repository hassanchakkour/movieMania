const crypto = require('crypto');
const hashType = 'sha1'
const encodeAs = 'hex'



// <-------- Date -------->


function getNextMonthDate(){
    let today = new Date();
    let nextMonthDate = new Date(new Date().setDate(today.getDate() + 30));
    
    let day = nextMonthDate.getDate()
    let month = nextMonthDate.getMonth() + 1
    let year = nextMonthDate.getFullYear()

    return `${day}/${month}/${year}`
}


function getCurrentDate(){
    let today = new Date()
    
    let day = today.getDate()
    let month = today.getMonth() + 1
    let year = today.getFullYear()

    return `${day}/${month}/${year}`
}


function timeDifferenceBetweenFirstDateAndSecondInDays(firstDate, secondDate){
    let firstDateArr = firstDate.split("/")
    let secondDateArr = secondDate.split("/")

    let firstDateDay = parseInt(firstDateArr[0])
    let firstDateMonth = parseInt(firstDateArr[1])
    let firstDateYear = parseInt(firstDateArr[2])

    let secondDateDay = parseInt(secondDateArr[0])
    let secondDateMonth = parseInt(secondDateArr[1])
    let secondDateYear = parseInt(secondDateArr[2])

    let firstDateInSeconds = new Date(firstDateYear, firstDateMonth - 1, firstDateDay).getTime()/1000
    let secondDateInSeconds = new Date(secondDateYear, secondDateMonth - 1, secondDateDay).getTime()/1000

    return parseInt((firstDateInSeconds - secondDateInSeconds)/(3600 * 24))
}


function firstDateIsGreater(firstDate, secondDate){
    return timeDifferenceBetweenFirstDateAndSecondInDays(firstDate, secondDate) > 0 
}


// <-------- String -------->


async function hashString(str){
    try{
        const hash = await crypto.createHash(hashType).update(str).digest(encodeAs);
        return hash
    }
    catch(err){
        console.log(err.message)
    }
}


function isAlphaNumeric(str) {
    let code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i)
      if (!(code > 47 && code < 58) && !(code > 64 && code < 91) && !(code > 96 && code < 123)){ 
        return false
    }}

    return true
}


function isAlpha(str) {
    let len = str.length

    for(let i = 0 ; i < len ; i++){
        let charCode = str.charCodeAt(i)
        if( (charCode < 91 && charCode > 64) || (charCode < 123 && charCode > 96) ){
            continue
        }
        return false
    }

    return true
}


function containsCapital(str){
    let capitalCount = 0;

    for(let i = 0; i < str.length ; i++){
        let currentChar = str.charAt(i)
        if(isAlphaNumeric(currentChar) && currentChar.toUpperCase() == currentChar)capitalCount++
    }

    return capitalCount > 0
}


// <-------- Validation -------->


async function validateName(name){
    try{
        if(isAlpha(name) && name.length >= 2 && name.length <= 20)return true
        return false

    }catch(error){
        console.log(error.message)
    }
}


async function validatePassword(password){
    try{
        if(containsCapital(password) && password.length >= 6 && password.length <= 20)return true
        return false

    }catch(error){
        console.log(error.message)
    }
}


async function validateAge(age){
    return age >= 14 && age <= 100
}


async function validateEmail(email){
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
}



// <-------- Date -------->


function getNextMonthDate(){
    let today = new Date();
    let nextMonthDate = new Date(new Date().setDate(today.getDate() + 30));
    
    let day = nextMonthDate.getDate()
    let month = nextMonthDate.getMonth() + 1
    let year = nextMonthDate.getFullYear()

    return `${day}/${month}/${year}`
}


function getCurrentDate(){
    let today = new Date()
    
    let day = today.getDate()
    let month = today.getMonth() + 1
    let year = today.getFullYear()

    return `${day}/${month}/${year}`
}


function timeDifferenceBetweenFirstDateAndSecondInDays(firstDate, secondDate){
    let firstDateArr = firstDate.split("/")
    let secondDateArr = secondDate.split("/")

    let firstDateDay = parseInt(firstDateArr[0])
    let firstDateMonth = parseInt(firstDateArr[1])
    let firstDateYear = parseInt(firstDateArr[2])

    let secondDateDay = parseInt(secondDateArr[0])
    let secondDateMonth = parseInt(secondDateArr[1])
    let secondDateYear = parseInt(secondDateArr[2])

    let firstDateInSeconds = new Date(firstDateYear, firstDateMonth - 1, firstDateDay).getTime()/1000
    let secondDateInSeconds = new Date(secondDateYear, secondDateMonth - 1, secondDateDay).getTime()/1000

    return parseInt((firstDateInSeconds - secondDateInSeconds)/(3600 * 24))
}


function firstDateIsGreater(firstDate, secondDate){
    return timeDifferenceBetweenFirstDateAndSecondInDays(firstDate, secondDate) > 0 
}


module.exports = {
    hashString,
    validatePassword,
    validateName,
    validateAge,
    validateEmail,
    getNextMonthDate,
    timeDifferenceBetweenFirstDateAndSecondInDays,
    firstDateIsGreater,
    getCurrentDate
}
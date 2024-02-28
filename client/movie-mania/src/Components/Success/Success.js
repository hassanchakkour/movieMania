import { useEffect, useState } from "react"
import  {useNavigate } from 'react-router-dom'
import SuccessCheckMark from "../SuccessCheckMark/SuccessCheckMark"


const Success = () => {
    const [fetchedData, setFetchedData] = useState('')
    const navigate = useNavigate()

    useEffect(() => {

        const checkIfSuccess = async () =>{
            await fetch('success')
            .then((data) => {
                return data.json()}
                )
            .then((data) => {
               
                if(data == 'forbidden'){

                    navigate('/')

                }
                if(data == 'done'){

                    setFetchedData(data)

                }
            })
        }

        checkIfSuccess()

    }, [])
    if(fetchedData == 'done'){
        return(
            <SuccessCheckMark></SuccessCheckMark>
        )
    }
    return(
        <h1>
            test
        </h1>
    )
}

export default Success
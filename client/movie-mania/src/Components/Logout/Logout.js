import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Logout = () => {

    const navigate = useNavigate()

    useEffect(() => {
        navigate('/')
    }, [])

    return(
        <h1> Error</h1>
    )
}

export default Logout
import './LoadingCss.css'
import gifVideo from './LoadingGif.mp4'
const Loading = () => {
    return (
        <div className='w-80 m-auto text-center mt-24'>
            <video width="300" height="300" autoPlay loop >
                <source src={gifVideo} type="video/mp4" />
            </video>
            <h1 className='text-3xl mt-1'>Loading...</h1>
        </div>

    )
}

export default Loading
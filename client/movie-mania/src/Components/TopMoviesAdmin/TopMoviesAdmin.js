
const TopMoviesAdmin = (prorps) => {
    const {count, details} = prorps
    return (
        <div className="flex ">

    
        <div className="flex mb-5 w-5/6">

            <img src={`https://image.tmdb.org/t/p/w1280/${details['poster_path']}`} width='120px'></img>

            <div className="p-2">
            <h1 className="text-xl m-2">{details['original_title']}</h1>
            <h1 className="text m-2">{details['overview']}</h1>
            <h1 className="ml-2"><span className="font-bold">Genre: </span>{details['genres'][0].name}</h1>
            </div>

        </div>

        <div className="text-center">
            <h1 className="text-xl">Enrolled:</h1>
            <h1>{count}</h1>
        </div>

        </div>
    )
}

export default TopMoviesAdmin
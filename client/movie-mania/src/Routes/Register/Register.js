import styles from './RegisterCss.module.css'
import videoBg from './backgroundMovie.mp4'

const Register = () => {
    return (
        <>
            <video src={videoBg} autoPlay loop muted className={styles.bgMovie} />
            <div className={styles.centerDiv}>

            </div>

        </>
    )
}
export default Register
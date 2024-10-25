import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '../../../contexts/AuthContextFirebase'
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth'

import styles from "./SignIn.module.css";

export const SignIn = () => {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true)
            await doSignInWithEmailAndPassword(email, password)
        }
    }

    const onGoogleSignIn = (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false)
            })
        }
    }



    return (
        <div className={styles["login-form-wraper"]}>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
            <h1>Sign In</h1>
            <form id="login" className={styles.form} onSubmit={onSubmit}>
                <div className={styles.containers}>
                    <input
                        name="email"
                        id="email-sign-up"
                        type="text"
                        placeholder="Email"
                        value={email} onChange={(e) => { setEmail(e.target.value) }}
                    />
                </div>
                <div className={styles.containers}>
                    <input
                        name="password"
                        id="password-sign-up"
                        type="password"
                        placeholder="password"
                        value={password} onChange={(e) => { setPassword(e.target.value) }}
                    />
                </div>

                {errorMessage && (<span className="text-red-600 front-bold">{errorMessage}</span>)}

                <div>
                    <button
                        type="submit"
                        disabled={isSigningIn}
                        className={styles["auth-btn"]}
                    >
                        {isSigningIn ? 'Signing In...' : 'Sign In'}
                    </button>
            
                    <button
                        disabled={isSigningIn}
                        onClick={(e) => { onGoogleSignIn(e) }}
                        className={styles["auth-btn"]}
                    >
                        {isSigningIn ? 'Signing In...' : 'Google'}
                    </button>
                </div>
            </form>
        </div>
    );
};

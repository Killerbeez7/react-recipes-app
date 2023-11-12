import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../contexts/AuthContext';
import * as authService from '../../../services/authService';

export const Login = () => {
    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const { email, password } = Object.fromEntries(new FormData(e.target));

        authService.login(email, password)
            .then((authData) => {
                userLogin(authData);
                navigate('/')
            })
            .catch(() => {
                navigate('/not-found');
            });
    };

    return (
        <div className="register-form-wraper">
            <h1>Sign In</h1>
            <form id="login" onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email-sign-in">Email:</label>
                    <input name="email" id="email-sign-in" type="text" />
                </div>

                <div>
                    <label htmlFor="password-sign-in">Password:</label>
                    <input
                        name="password"
                        id="password-sign-in"
                        type="password"
                    />
                </div>

                <div>
                    <input type="submit" value="Login" />
                </div>
            </form>
        </div>
    );
};

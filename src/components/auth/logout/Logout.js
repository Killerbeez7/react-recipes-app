import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../contexts/AuthContext';
import * as authService from '../../../services/authService';

import { doSignOut } from '../../../firebase/auth'
import { useAuth } from '../../../contexts/AuthContextFirebase';

export const Logout = () => {
    const navigate = useNavigate();
    const { userLoggedIn, } = useAuth
    if (userLoggedIn) {
        doSignOut()
        navigate('/');
    }


    return null
};



// export const Logout = () => {
//     const navigate = useNavigate();
//     const { user, userLogout } = useContext(AuthContext);

//     useEffect(() => {
//         authService
//             .logout(user.accessToken)
//             .then(() => {
//                 userLogout();
//                 navigate('/');
//             })
//             .catch(navigate('/'));
//     });

//     return null;
// };

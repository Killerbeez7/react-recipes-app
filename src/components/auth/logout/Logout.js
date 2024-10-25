import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../../../firebase/auth'
import { useAuth } from '../../../contexts/AuthContext';

export const Logout = () => {
    const navigate = useNavigate();
    const { userLoggedIn, } = useAuth
    if (userLoggedIn) {
        doSignOut()
        navigate('/');
    }

    return null
};


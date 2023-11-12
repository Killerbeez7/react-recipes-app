import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import styles from './Navigation.module.css';

export const Navigation = (props) => {
    const { user } = useContext(AuthContext);

    const setNavStyle = ({ isActive }) => {
        return isActive ? styles['active-link'] : undefined;
    };

    return (
        <div className={styles['nav-wrapper']}>
            <div className={styles['left-side']}>
                <div className={styles['nav-link-wrapper']}>
                    <NavLink className={setNavStyle} to="/">
                        Home
                    </NavLink>
                </div>

                <div className={styles['nav-link-wrapper']}>
                    <NavLink className={setNavStyle} to="/recipes/list">
                        Recipes
                    </NavLink>
                </div>

                <div className={styles['nav-link-wrapper']}>
                    <NavLink className={setNavStyle} to="/about">
                        About
                    </NavLink>
                </div>

                <div className={styles['nav-link-wrapper']}>
                    <NavLink className={setNavStyle} to="/contacts">
                        Contacts
                    </NavLink>
                </div>
            </div>

            <div className={styles['right-side']}>
                {user.email ? (
                    <>
                        <div className={styles['nav-link-wrapper']}>
                            <NavLink to="/">{user.email}</NavLink>
                        </div>
                        <div className={styles['nav-link-wrapper']}>
                            <NavLink to="/logout">logout</NavLink>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles['nav-link-wrapper']}>
                            <NavLink className={setNavStyle} to="/login">
                                login
                            </NavLink>
                        </div>
                        <div className={styles['nav-link-wrapper']}>
                            <NavLink className={setNavStyle} to="/register">
                                try it free
                            </NavLink>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

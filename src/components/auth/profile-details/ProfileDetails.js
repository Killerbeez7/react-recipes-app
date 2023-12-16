import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
// import * as authService from "../../../services/authService";

import styles from "./ProfileDetails.module.css";

export const ProfileDetails = () => {
    const { user } = useContext(AuthContext);
    const [values, setValues] = useState({
        username: user.username,
        email: user.email,
    });

    const userData = { ...user };

    const changeHandler = (e) => {
        setValues((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        userData["username"] = values["username"];
        userData["email"] = values["email"];

        // to fix edit user data
        // authService.editUserData(user._id, userData);
    };

    return (
        <>
            <form
                className={styles["profile-details-form"]}
                onSubmit={onSubmit}
            >
                <h1 className={styles["profile-details-title"]}>
                    Profile settings
                </h1>
                <label>Change username</label>
                <div>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder={user.username}
                        onChange={changeHandler}
                    ></input>
                </div>
                <br></br>
                <label>Change email</label>
                <div>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder={user.email}
                        onChange={changeHandler}
                    ></input>
                </div>
                <br></br>
                <button className={styles["change-btn"]}>CHANGE</button>
            </form>
        </>
    );
};

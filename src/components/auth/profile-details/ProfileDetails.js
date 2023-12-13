import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

import styles from "./ProfileDetails.module.css";

export const ProfileDetails = () => {
    const { user } = useContext(AuthContext);

    const userData = {...user}

    const [values, setValues] = useState({
        username: user.username,
        email: user.email,
    });

    const changeHandler = (e) => {
        setValues((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        userData['username'] = values['username']
        userData['email'] = values['email']

        console.log('1  USER:', userData);
        console.log(`2 new username: ${values["username"]}`);
        console.log(`3 new email: ${values["email"]}`);
        console.log('4 NEW USER:', userData);
        
        //add POST request to update the user details on the server
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
                <div>
                    <p>change username</p>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder={user.username}
                        onChange={changeHandler}
                    ></input>
                </div>
                <br></br>
                <div>
                    <p>change email</p>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder={user.email}
                        onChange={changeHandler}
                    ></input>
                </div>
                <br></br>
                <button>CHANGE</button>
            </form>
        </>
    );
};

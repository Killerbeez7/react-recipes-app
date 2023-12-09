import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

import styles from "./ProfileDetails.module.css";

export const ProfileDetails = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            <h1 className={styles["profile-details-title"]}>Hello {user.username}</h1>
        </>
    );
};

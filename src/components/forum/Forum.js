import styles from "./Forum.module.css";
import cx from "classnames";
import { useState } from "react";
import { storage } from "../../firebase/firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

export const Forum = () => {
    const [imageUpload, setImageUpload] = useState(null);

    const uploadImage = () => {
        if (!imageUpload) return;

        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload)
            .then(() => {
                console.log("Image uploaded successfully");
            })
            .catch((error) => {
                console.error("Upload failed:", error.message);
            });
    };

    return (
        <div className={cx(styles["main-wrapper"])}>
            <h1>Forum</h1>
            <input
                type="file"
                onChange={(e) => setImageUpload(e.target.files[0])}
            />
            <button onClick={uploadImage}>Upload Image</button>
        </div>
    );
};

import { useState } from "react";
import { getAuth, updatePassword } from "firebase/auth";

export const Settings = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const auth = getAuth();
    const user = auth.currentUser;

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match.");
            return;
        }

        if (!user) {
            setMessage("No user is logged in.");
            return;
        }

        try {
            await updatePassword(user, newPassword);
            setMessage("Password updated successfully!");
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <input 
                type="password" 
                placeholder="New Password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Confirm New Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            <button onClick={handleChangePassword}>Update Password</button>
            <p>{message}</p>
        </div>
    );
};

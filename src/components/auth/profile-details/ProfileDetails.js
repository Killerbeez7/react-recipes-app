import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../../../firebase/firebaseConfig";
import {
    deleteImage,
    isStoredImage,
    uploadImage,
} from "../../../services/imageService";
import { useAuth } from "../../../contexts/AuthContext";
import { Avatar } from "../../ui/Avatar";
import { Spinner } from "../../ui/Loader";

export const ProfileDetails = () => {
    const { currentUser, userProfile, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState(currentUser.displayName || "");
    const [bio, setBio] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(
        userProfile?.profilePicture || currentUser.photoURL || ""
    );
    const [initialised, setInitialised] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const accountPath = `/auth/${currentUser.uid}/account-management`;

    // Fill the form once the DB profile has loaded (it may arrive after mount)
    useEffect(() => {
        if (userProfile && !initialised) {
            setUsername(userProfile.username || currentUser.displayName || "");
            setBio(userProfile.bio || "");
            setPreview(
                userProfile.profilePicture || currentUser.photoURL || ""
            );
            setInitialised(true);
        }
    }, [userProfile, initialised, currentUser]);

    useEffect(() => {
        if (!imageFile) return;
        const url = URL.createObjectURL(imageFile);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!username.trim()) {
            setError("Username cannot be empty.");
            return;
        }

        setIsSaving(true);
        setError("");

        try {
            const user = auth.currentUser;
            const previousPicture =
                userProfile?.profilePicture || user.photoURL || "";
            let profilePicture = previousPicture;

            if (imageFile) {
                profilePicture = await uploadImage(imageFile, user.uid, {
                    maxSize: 512,
                });
            }

            // Auth's photoURL only accepts real links; stored photos live on
            // the profile document instead
            await updateProfile(user, {
                displayName: username.trim(),
                photoURL: isStoredImage(profilePicture) ? null : profilePicture,
            });
            await setDoc(
                doc(db, "users", user.uid),
                {
                    username: username.trim(),
                    bio: bio.trim(),
                    profilePicture,
                },
                { merge: true }
            );
            if (profilePicture !== previousPicture) {
                deleteImage(previousPicture);
            }

            refreshUser();
            navigate(accountPath);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(
                "There was an error updating your profile. Please try again."
            );
            setIsSaving(false);
        }
    };

    return (
        <div className="page max-w-2xl">
            <Link to={accountPath} className="btn-ghost -ml-3 mb-6 px-3">
                <ArrowLeft className="h-4 w-4" /> My account
            </Link>
            <h1 className="page-title">Edit profile</h1>
            <p className="page-subtitle">
                This is how other cooks will see you.
            </p>

            <form
                onSubmit={handleSaveChanges}
                className="card mt-8 space-y-6 p-6 sm:p-8"
            >
                <div className="flex items-center gap-5">
                    <Avatar
                        src={preview}
                        name={username || currentUser.email}
                        size="lg"
                    />
                    <div>
                        <label
                            htmlFor="profilePicture"
                            className="btn-secondary cursor-pointer"
                        >
                            <Camera className="h-4 w-4" /> Change picture
                        </label>
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) =>
                                setImageFile(e.target.files?.[0] || null)
                            }
                        />
                        <p className="hint">JPG, PNG or GIF.</p>
                    </div>
                </div>

                <div>
                    <label htmlFor="username" className="label">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        className="input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email" className="label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="input"
                        value={currentUser.email || ""}
                        disabled
                    />
                    <p className="hint">Your email can't be changed here.</p>
                </div>
                <div>
                    <label htmlFor="bio" className="label">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        rows={4}
                        className="input"
                        placeholder="Tell others a little about your cooking"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                {error && <p className="alert-error">{error}</p>}

                <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800 sm:flex-row sm:justify-end">
                    <Link to={accountPath} className="btn-secondary">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isSaving}
                    >
                        {isSaving && <Spinner className="h-4 w-4" />}
                        {isSaving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

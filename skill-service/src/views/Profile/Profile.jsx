import { useContext, useState } from "react";
import NavBarPrivate from "../../components/NavBar/NavBarPrivate";
import { AppContext } from "../../store/app.context.js";
import { auth } from "../../config/firebase.config.js";
import { updateProfile, deleteProfileImage } from "../../services/user.service.js";
import { uploadImageToCloudinary } from "../../services/cloudinary.service.js";

export default function Profile() {
    const { user, setAppState } = useContext(AppContext);

    const [selectedImage, setSelectedImage] = useState(null);

    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        username: user?.username || "",
        bio: user?.bio || ""
    });

    if (!user) {
        return (
            <>
                <NavBarPrivate />
                <div className="p-6 text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </>
        );
    }

    const avatarLetter =
        user?.username?.[0]?.toUpperCase() ||
        user?.email?.[0]?.toUpperCase() ||
        "U";

    const handleChange = (e) => {
        setFormData((oldData) => ({
            ...oldData,
            [e.target.name]: e.target.value
        }));
    };

    const handleDeleteProfileImage = async () => {
        const confirmed = window.confirm("Are you sure you want to delete your profile image?");

        if (!confirmed) return;

        setIsSaving(true);

        try {
            const token = await auth.currentUser.getIdToken();

            const updatedUser = await deleteProfileImage(token);

            setAppState((oldState) => ({
                ...oldState,
                user: updatedUser
            }));

            alert("Profile image deleted successfully");

        } catch (error) {
            console.error("Error deleting profile image:", error);
            alert("Failed to delete profile image");
        } finally {
            setIsSaving(false);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSaving(true);

        try {
            const token = await auth.currentUser.getIdToken();

            let profileImage = user.profileImage;
            let profileImagePublicId = user.profileImagePublicId;

            if (selectedImage) {

                const uploadedImage = await uploadImageToCloudinary(selectedImage);

                profileImage = uploadedImage.imageUrl;
                profileImagePublicId = uploadedImage.publicId;

            }


            const profileData = {
                ...formData,
                profileImage,
                profileImagePublicId
            };

            const updatedUser = await updateProfile(
                profileData,
                token
            );

            setAppState((oldState) => ({
                ...oldState,
                user: updatedUser
            }));

            setSelectedImage(null);

            alert("Profile updated successfully");
        } catch (error) {
            console.error("FULL ERROR:", error);
            console.error("ERROR MESSAGE:", error.message);
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <NavBarPrivate />

            {isSaving && (
                <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
                    <span className="loading loading-spinner loading-lg text-blue-500"></span>
                </div>
            )}

            <div className="pt-24 p-6 max-w-3xl mx-auto">
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body items-center text-center">

                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="Profile"
                                className="w-28 h-28 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-28 h-28 rounded-full bg-primary text-primary-content flex items-center justify-center text-4xl font-bold">
                                {avatarLetter}
                            </div>
                        )}

                        {user.profileImage && (
                            <button
                                type="button"
                                className="btn btn-error btn-sm mt-3"
                                onClick={handleDeleteProfileImage}
                            >
                                Delete Profile Picture
                            </button>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-bordered w-full"
                            onChange={(e) => setSelectedImage(e.target.files[0])}
                        />

                        <p className="text-gray-500 mt-3">{user.email}</p>

                        <div className="divider"></div>

                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            <label className="form-control w-full text-left">
                                <span className="label-text mb-1">Username</span>
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="Enter username"
                                    className="input input-bordered w-full"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </label>

                            <label className="form-control w-full text-left">
                                <span className="label-text mb-1">Bio</span>
                                <textarea
                                    name="bio"
                                    placeholder="Add bio"
                                    className="textarea textarea-bordered w-full"
                                    value={formData.bio}
                                    onChange={handleChange}
                                />
                            </label>

                            <button type="submit" className="btn btn-primary w-full">
                                Save Changes
                            </button>

                        </form>

                    </div>
                </div>
            </div>


        </>
    )


}
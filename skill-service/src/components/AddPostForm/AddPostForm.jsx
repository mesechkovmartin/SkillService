import { useState } from "react";
import { auth } from "../../config/firebase.config";
import { createPost } from "../../services/post.service";
import { categories } from "../../constants/categories";
import { cities } from "../../constants/cities";
import { uploadImageToCloudinary } from "../../services/cloudinary.service.js";
import { getCurrentLocationData, completeLocation, updateLocationField } from "../../helpers/location.helper.js";
import LocationFields from "../Posts/LocationFields.jsx";

export default function AddPostForm({ onPostCreated }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: {
            locationType: "city",
            city: "",
            area: "",
            address: "",
            latitude: null,
            longitude: null
        },
        ownerPhoneNumber: "",
        price: ""
    });

    const [selectedImages, setSelectedImages] = useState([]);

    const handleChange = (e) => {
        setFormData((oldData) => ({
            ...oldData,
            [e.target.name]: e.target.value

        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;

        if (!user) {
            alert("You must be logged in.");
            return;
        }

        try {
            let uploadedImages = [];

            if (selectedImages.length > 0) {
                uploadedImages = await Promise.all(
                    selectedImages.map((image) => uploadImageToCloudinary(image))
                );
            }

            const finalLocation = await completeLocation(formData.location);

            const images = uploadedImages.map((image) => ({
                url: image.imageUrl,
                publicId: image.publicId
            }));

            const postData = {
                title: formData.title,
                description: formData.description,
                images: images,
                category: formData.category,
                location: finalLocation,
                ownerPhoneNumber: formData.ownerPhoneNumber,
                price: Number(formData.price),
                ownerEmail: user.email,
                ownerId: user.uid
            };

            const createdPost = await createPost(postData);

            if (onPostCreated) onPostCreated(createdPost);

            console.log("Created post: ", createdPost);
            alert("Post created successfully");

            document.getElementById("add-post-modal").close();

            resetForm();
        }
        catch (err) {
            console.error("Error creating post: ", err);
            alert("Failed to create post");
        }

    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;

        setFormData((oldData) => ({
            ...oldData,
            location: updateLocationField(oldData.location, name, value)
        }));
    };

    const handleUseCurrentLocation = async () => {
        try {
            const locationData = await getCurrentLocationData();

            setFormData((oldData) => ({
                ...oldData,
                location: {
                    ...oldData.location,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    address: locationData.address,
                    city: locationData.city || oldData.location.city
                }
            }));
        } catch (error) {
            console.error(error);
            alert("Unable to get your current location.");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            category: "",
            location: {
                locationType: "city",
                city: "",
                area: "",
                address: "",
                latitude: null,
                longitude: null
            },
            ownerPhoneNumber: "",
            price: ""
        });
        setSelectedImages([]);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                name="title"
                type="text"
                placeholder="Service title"
                className="input input-bordered w-full"
                value={formData.title}
                onChange={handleChange}
                required
            />

            <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                    const files = Array.from(e.target.files);

                    setSelectedImages((oldImages) => {
                        const updatedImages = [...oldImages, ...files];

                        if (updatedImages.length > 10) {
                            alert("You can upload up to 10 photos.");
                            return oldImages;
                        }

                        return updatedImages;
                    })

                    e.target.value = null;
                }}
            />

            {selectedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {selectedImages.map((image, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="h-24 w-full object-cover rounded"
                        />
                    ))}
                </div>
            )}

            <textarea
                name="description"
                placeholder="Service description"
                className="textarea textarea-bordered w-full"
                value={formData.description}
                onChange={handleChange}
                required
            />

            <select
                name="category"
                className="select select-bordered w-full"
                value={formData.category}
                onChange={handleChange}
                required
            >
                <option value="">Select category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <LocationFields
                location={formData.location}
                onLocationChange={handleLocationChange}
                setFormData={setFormData}
            />

            <input
                name="ownerPhoneNumber"
                type="text"
                placeholder="PhoneNumber"
                className="input input-bordered w-full"
                value={formData.ownerPhoneNumber}
                onChange={handleChange}
                required
            />

            <input
                name="price"
                type="number"
                placeholder="Price in EUR"
                className='input input-bordered w-full'
                value={formData.price}
                onChange={handleChange}
                required
            />

            <button type="submit" className="btn btn-primary w-full">Add Service</button>
            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    className="btn"
                    onClick={() => {
                        resetForm();
                        document.getElementById("add-post-modal").close();
                    }}
                >
                    Close
                </button>
            </div>
        </form>
    )
}
import { useState, useEffect } from "react";
import { updatePost } from "../../services/post.service";
import { categories } from "../../constants/categories";
import { cities } from "../../constants/cities";
import { uploadImageToCloudinary } from "../../services/cloudinary.service.js";
import { getCurrentLocationData, completeLocation, updateLocationField } from "../../helpers/location.helper.js";
import LocationFields from "../Posts/LocationFields.jsx";

export default function EditPostForm({ post, onClose, onPostUpdated }) {
    const [formData, setFormData] = useState({
        title: post.title,
        description: post.description,
        category: post.category,
        location: post.location || {
            locationType: "city",
            city: "",
            area: "",
            address: "",
            latitude: null,
            longitude: null
        },
        ownerPhoneNumber: post.ownerPhoneNumber,
        price: post.price
    });

    const [existingImages, setExistingImages] = useState(post.images || []);
    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    const handleChange = (e) => {
        setFormData((oldData) => ({
            ...oldData,
            [e.target.name]: e.target.value
        }));
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

    const handleRemoveExistingImage = (imageToRemove) => {
        setExistingImages((oldImages) => oldImages.filter((image) => image.publicId !== imageToRemove.publicId));

        setRemovedImages((oldImages) => [...oldImages, imageToRemove]);
    }

    const handleRemoveNewImage = (indexToRemove) => {
        setNewImages((oldImages) => oldImages.filter((_, index) => index !== indexToRemove));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let uploadedNewImages = [];

            if (newImages.length > 0) {
                uploadedNewImages = await Promise.all(
                    newImages.map((image) => uploadImageToCloudinary(image))
                );
            }

            const formattedNewImages = uploadedNewImages.map((image) => ({
                url: image.imageUrl,
                publicId: image.publicId
            }));

            const finalImages = [...existingImages, ...formattedNewImages];

            const finalLocation = await completeLocation(formData.location);

            const updatedData = {
                ...formData,
                location: finalLocation,
                price: Number(formData.price),
                images: finalImages,
                removedImages: removedImages
            };

            const updatedPost = await updatePost(post._id, updatedData);

            alert("Post updated successfully");
            onPostUpdated(updatedPost);
            onClose();

        } catch (err) {
            console.error("Error updating post:", err);
            alert("Failed to update service");
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Edit Service</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="title"
                        type="text"
                        className="input input-bordered w-full"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((image) => (
                            <div key={image.publicId} className="relative group">
                                <img
                                    src={image.url}
                                    alt="Post"
                                    className="h-24 w-full object-cover rounded-xl"
                                />

                                <button
                                    type="button"
                                    className="btn btn-circle btn-xs btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                                    onClick={() => handleRemoveExistingImage(image)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {newImages.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="New preview"
                                    className="h-24 w-full object-cover rounded-xl"
                                />

                                <button
                                    type="button"
                                    className="btn btn-circle btn-xs btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                                    onClick={() => handleRemoveNewImage(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            const files = Array.from(e.target.files);

                            setNewImages((oldImages) => {
                                const updatedImages = [...oldImages, ...files];

                                if (existingImages.length + updatedImages.length > 10) {
                                    alert("You can upload up to 10 photos.");
                                    return oldImages;
                                }

                                return updatedImages;
                            });

                            e.target.value = null;
                        }}
                    />

                    <textarea
                        name="description"
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

                    <div className="flex gap-3 justify-end">
                        <button type="button" className="btn" onClick={onClose}>
                            Cancel
                        </button>

                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}
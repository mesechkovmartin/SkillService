import { useState } from "react";
import { updatePost } from "../../services/post.service";
import { categories } from "../../constants/categories";
import { cities } from "../../constants/cities";

export default function EditPostForm({ post, onClose, onPostUpdated }) {
    const [formData, setFormData] = useState({
        title: post.title,
        description: post.description,
        category: post.category,
        location: post.location,
        ownerPhoneNumber: post.ownerPhoneNumber,
        price: post.price
    });

    const handleChange = (e) => {
        setFormData((oldData) => ({
            ...oldData,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            ...formData,
            price: Number(formData.price)
        };

        try {
            const updatedPost = await updatePost(post._id, updatedData);

            alert("Post updated successfully");
            onPostUpdated(updatedPost);
            onClose();

        } catch (err) {
            console.error("Error updating post:", err);
            alert("Failed to update service");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-xl w-full max-w-lg">
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

                    <select
                        name="location"
                        className="select select-bordered w-full"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>

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
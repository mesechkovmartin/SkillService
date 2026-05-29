import { useState } from "react";
import { auth } from "../../config/firebase.config";
import { createPost } from "../../services/post.service";
import { categories } from "../../constants/categories";
import { cities } from "../../constants/cities";
import defaultPostImage from "../../assets/defaultPostImage.png";

export default function AddPostForm({onPostCreated}) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        ownerPhoneNumber: "",
        price: ""

    });

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

        const postData = {
            title: formData.title,
            description: formData.description,
            imageUrl: defaultPostImage,
            category: formData.category,
            location: formData.location,
            ownerPhoneNumber: formData.ownerPhoneNumber,
            price: Number(formData.price),
            ownerEmail: user.email,
            ownerId: user.uid
        };

        try {
            const createdPost = await createPost(postData);
            
            if (onPostCreated) onPostCreated(createdPost);

            console.log("Created post: ", createdPost);
            alert("Post created successfully");

            document.getElementById("add-post-modal").close();

            setFormData({
                title: "",
                description: "",
                category: "",
                location: "",
                ownerPhoneNumber: "",
                price: ""
            });
        }
        catch (err) {
            console.error("Error creating post: ", err);
            alert("Failed to create post");
        }

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

            <button type="submit" className="btn btn-primary W-full">Add Service</button>
        </form>
    )
}
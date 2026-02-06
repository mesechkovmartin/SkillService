import { useContext, useState } from "react"
import NavBarPublic from "../../components/NavBar/NavBarPublic"
import { AppContext } from "../../store/app.context"
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service"
import { auth } from "../../config/firebase.config"

export default function Login() {
    const { setAppState } = useContext(AppContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        if (!email || !password) {
            return alert('Please enter email and password');
        }

        try {
            setError("");

            // Firebase Login
            await loginUser(email, password);

            // Get Firebase token
            const token = await auth.currentUser.getIdToken(true);

            // Call backend to get the user from mongoDB
            const res = await fetch("http://localhost:4000/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Backend error ${res.status}, Failedd to fetch user data`);
            }

            const mongoUser = await res.json();

            // Store user in app context
            setAppState((prev) => ({
                ...prev,
                user: mongoUser,
            }));

            navigate("/home");
        } catch (err) {
            setError(err.message);
    }
};

return (
        <>
            <NavBarPublic />
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <form
                    onSubmit={(e) => { e.preventDefault(); login(); }}
                    className="card w-full max-w-sm bg-base-100 shadow-xl"
                >
                    <div className="card-body">
                        <h2 className="card-title justify-center">Log in</h2>

                        <input
                            type="email"
                            placeholder="Email"
                            className="input input-bordered w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="input input-bordered w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button className="btn btn-primary w-full" type="submit">
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}



import { AppContext } from "../../store/app.context"
import { useContext, useState } from "react"
import { registerUser } from "../../services/auth.service"
import { useNavigate } from "react-router-dom"
import NavBarPublic from "../../components/NavBar/NavBarPublic"
import { auth } from "../../config/firebase.config"

export default function Signup() {

    const { setAppState } = useContext(AppContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const register = async () => {
        if (!email || !password) {
            return alert('Please enter email and password');
        }

        try {
            const userCredential = await registerUser(email, password);

            // Firebase user object
            const user = userCredential.user;

            const token = await auth.currentUser.getIdToken(true);
            console.log("FIREBASE TOKEN:", token);

            // Call backend
            const res = await fetch("http://localhost:4000/auth/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Backend error ${res.status}: ${errText}`);
            }

            const mongoUser = await res.json();
            console.log("MongoDB user:", mongoUser);


            // OPTIONAL: store user in app context
            setAppState((prev) => ({
                ...prev,
                user: mongoUser,
            }));

            console.log("User created:", user.email);
            console.log("User UID:", user.uid);
            console.log(AppContext);

            // Redirect after successful signup
            navigate("/home");
        } catch (err) {
            setError(err.message);
        }
    }


    return (
        <>
            <NavBarPublic />
            <h1>Signup Page</h1>
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <form
                    onSubmit={(e) => { e.preventDefault(); register(); }}
                    className="card w-full max-w-sm bg-base-100 shadow-xl"
                >
                    <div className="card-body">
                        <h2 className="card-title justify-center">Sign up</h2>

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

                        {error && (
                            <div className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        )}

                        <button className="btn btn-primary w-full" type="submit">
                            Create account
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
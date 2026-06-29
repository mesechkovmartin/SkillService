import { useContext } from 'react';
import { AppContext } from '../../store/app.context';
import { categories } from '../../constants/categories';
import { Link, useNavigate } from 'react-router-dom';
import logoSkillService from '../../assets/logoSkillservice.png';
import { navigateToSection } from '../../utils/sectionNavigation';



export default function Footer() {
    const { user } = useContext(AppContext);

    const navigate = useNavigate();

    const homePath = user ? "/home" : "/";

    return (
        <footer className="bg-slate-950 text-white mt-20">
            <div className="max-w-7xl mx-auto px-8 py-12 grid gap-10 md:grid-cols-3">

                {/* SkillService */}
                <div>
                    <img
                        src={logoSkillService}
                        alt="SkillService logo"
                        className="h-20 w-auto mb-4 brightness-0 invert "
                    />

                    <p className="text-gray-300">
                        Connecting people with local professionals across Bulgaria.
                    </p>
                </div>

                {/* Categories */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        Categories
                    </h2>

                    <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-gray-300">
                        {categories.map((category) => (
                            <p key={category}>
                                {category}
                            </p>
                        ))}
                    </div>
                </div>

                {/* For Users */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        For Users
                    </h2>

                    <div className="space-y-2 text-gray-300">
                        <a href="#hero-search"
                            className="hover:text-primary transition"
                            onClick={(e) => {
                                e.preventDefault();
                                navigateToSection("hero-search", navigate, homePath);
                            }}
                        >
                            Find Services
                        </a>

                        {user ? (
                            <>
                                <Link
                                    to="/my-services"
                                    className="block hover:text-primary transition"
                                >
                                    My Services
                                </Link>

                                <Link
                                    to="/profile"
                                    className="block hover:text-primary transition"
                                >
                                    Profile
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/signup"
                                    className="block hover:text-primary transition"
                                >
                                    Become a Provider
                                </Link>

                                <Link
                                    to="/signup"
                                    className="block hover:text-primary transition"
                                >
                                    Sign Up
                                </Link>

                                <Link
                                    to="/login"
                                    className="block hover:text-primary transition"
                                >
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                </div>

            </div>

            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-8 py-6 text-gray-400">
                    © 2025 SkillService. All rights reserved.
                </div>
            </div>
        </footer>
    );
}


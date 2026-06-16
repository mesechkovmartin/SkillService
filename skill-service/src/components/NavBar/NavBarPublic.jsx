import { Link } from "react-router-dom";
import logo from "../../assets/logoSkillService.png";
import SearchBar from "../SearchBar/SearchBar";
import { useState, useEffect } from "react";

export default function NavBarPublic() {
    const [showNavbar, setShowNavbar] = useState(true);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                //scrolling down
                setShowNavbar(false);
            } else {
                //scrolling up
                setShowNavbar(true);
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll);

        return () =>
            window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>

            <div className={`fixed top-0 left-0 right-0 z-50 bg-base-100 shadow px-4 py-2 transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">

                    {/* Logo */}
                    <div>
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                src={logo}
                                alt="SkillService logo"
                                className="h-16 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Search bar */}
                    <div className="hidden md:flex justify-center">
                        <SearchBar />
                    </div>

                    {/* Auth buttons */}
                    <div className="flex items-center gap-2">
                        <Link to="/signup" className="btn btn-primary">
                            Sign up
                        </Link>
                        <Link to="/login" className="btn btn-primary btn-outline ">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

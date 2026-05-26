import { Link } from "react-router-dom";
import logo from "../../assets/logoSkillService.png";
import SearchBar from "../SearchBar/SearchBar";

export default function NavBarPublic() {
    return (
        <>

            <div className="bg-base-100 shadow px-4 py-2">
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

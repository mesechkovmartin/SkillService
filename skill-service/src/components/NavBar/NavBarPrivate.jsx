import logo from '../../assets/logoSkillService.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../store/app.context';
import { logoutUser } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

export default function NavBarPrivate() {
    const { user } = useContext(AppContext);

    const { setAppState } = useContext(AppContext);
    
    const navigate = useNavigate();

    const avatarLetter = user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

    async function handleLogout() {
        try {
            await logoutUser();

            setAppState({
                user: null,
                userData: null,
            });
            navigate('/');
        } catch (err) {
            console.error("Logout error:", err);
        }
    }

    return (
        <div className="bg-base-100 shadow px-4 py-2">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">

                {/* Logo */}
                <div className="navbar-left">
                    <Link to="/home" className="flex items-center gap-2">
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

                {/* User menu */}
                <div className="flex items-center gap-2">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost avatar">
                            <div className="w-10 rounded-full overflow-hidden bg-base-200 flex items-center justify-center">
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-bold">
                                        {avatarLetter}
                                    </span>
                                )}
                            </div>
                        </div>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
                        >
                            <li className="px-2 py-1 text-sm opacity-70">
                                {user?.username || user?.email}
                            </li>
                            <li><Link to="/profile">Profile</Link></li>
                            <li><Link to="/my-services">My Services</Link></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </ul>
                    </div>

                </div>
            </div>

        </div >

    )

}
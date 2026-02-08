import { Link } from "react-router-dom"
import logo from "../../assets/logoSkillService.png"
export default function NavBarPublic() {

    return (
        <>
            <div className="navbar bg-base-100 shadow">
                <div className="flex-1">
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src={logo}
                            alt="SkillService logo"
                            className="h-20 w-auto"
                        />
                    </Link>
                </div>


                    <div className="flex-none gap-2">
                        <Link to='/signup' className="btn btn-primary btn-lg mr-4">
                            Sign up
                        </Link>
                        <Link to="/login" className="btn btn-primary btn-lg">
                            Log in
                        </Link>
                    </div>
                </div>
                </>
            )
}
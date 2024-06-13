import logo from "../assets/image.png"
import "../styles/navbar.css"
import { Link } from "react-router-dom"
export default function Navbar() {
    return (<div className="navbar">
        <img
            src={logo}
        />
        <div className="nav-link">
            <Link>
                Signup
            </Link>
            <Link>
                Login
            </Link>
            <Link>
                Home
            </Link>
        </div>
    </div>)
}
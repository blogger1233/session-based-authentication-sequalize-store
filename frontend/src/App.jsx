import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import "./app.css"
import Authnavbar from "./components/Authnavbar";
export default function App()
{
    return(<div className="app">
        <Authnavbar/>
        <Outlet/>
        <Footer/>
    </div>)
}
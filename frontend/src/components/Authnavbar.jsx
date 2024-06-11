import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./authnavbar.css";

export default function Authnavbar() {
  const location = useLocation();
  console.log(location.pathname);

  return (
    <div className="navbar-auth">
     <div>
     <span className="logo">
        <span style={{ color: "white" }}>Stream</span>
        <span style={{ color: "blueviolet" }}>Sphere</span>
      </span>
     </div>
      <div>
      <Link className="auth-link">Home</Link>
      <Link
        to="/app/register"
        style={{
          backgroundColor: location.pathname === "/app/register" ? "rgb(196, 165, 226)" : "",
          color: location.pathname === "/app/register" ? "black" : "",
        }}
        className="auth-link"
      >
        Register
      </Link>
      <Link className="auth-link">Login</Link>
      </div>
    </div>
  );
}

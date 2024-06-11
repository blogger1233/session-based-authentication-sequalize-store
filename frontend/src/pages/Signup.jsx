// Signup.js
import React from "react";
import "../styles/signup.css";
import ReCAPTCHA from "react-google-recaptcha";
import Footer from "../components/Footer";
import { useRef } from "react";
export default function Signup() {
    const recaptcha = useRef();
    async function recaptchafun(token){
        const object ={
            response:token,
            secret:'6LfZYPYpAAAAAEHBkoXTdVrBWiOr5abiGfesWwrP'
        }
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify",{
            method:'POST',
            body:JSON.stringify(object)
        })
        const data = await response.json();
        console.log(data)
    }
    return (
        <div className="login-form">
            <h2>
                Register <span style={{color:"#9096D6"}}>new account</span>
            </h2>
            <p>
                Username
            </p>
            <input type="text" />
            <p>
                Email
            </p>
            <input type="text" />
            <p>
                Password
            </p>
            <input type="password" />
            <br></br>
            <p>
                Confirm password
            </p>
            <input type="text"/>
            <p>
                Date of birth
            </p>
            <input type="date" />
            <br/>
            <ReCAPTCHA
            ref={recaptcha}
            onChange={recaptchafun}
           sitekey="6LfZYPYpAAAAAEHBkoXTdVrBWiOr5abiGfesWwrP"
            />
            <button>
                Submit
            </button>
           
        </div>
    );
}

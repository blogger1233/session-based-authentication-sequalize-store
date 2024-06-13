import { useEffect, useReducer, useState } from "react"
import "../styles/signup.css"
import Navbar from "../components/Navbar"
import validate from "../modules/validatesignup"
export default function Signup() {
    const [message]=useState([
        "Username should only contain alphanumeric characters (a-z, 0-9).",
        "Email should be a valid format.",
        "Password must be at least 6 characters long and should not contain spaces.",
        "Passwords do not match.",
        "Date should be in YYYY-MM-DD format."
    ])
    const [notvalid,setNotValid]=useState([])
    const initalState={
        "name":"",
        "email":"",
        "password":"",
        "confirm_password":"",
        "age":""
    }
    const reducer = (state,action)=>{
        console.log(state)
        return({
            ...state,[action.name]:action.value
        })
    }
    const handleChange = (e)=>{
        const {name,value}= e.target;
        dispatch({name:name,value:value})
        setNotValid(validate(state))
    }
    const [state,dispatch]=useReducer(reducer, initalState)
    const handleSubmit = async function(){
        setNotValid(validate(state))
        console.log(validate(state))
    }
    useEffect(() => {
        document.title = "Signup"

    },[])
    return (<div className="signup">
        <Navbar />
        <div className="signup-form">
            <p className="form-heading">
                Register <span style={{color:"blue"}}>new account</span>
            </p>
            <label className="label">
                <p className="label-p">
                    Username
                </p>
                <input
                    type="text"
                    placeholder="username"
                    name="name"
                    onChange={handleChange}
                />
            </label>
            <label className="label">
                <p className="label-p">
                    Email
                </p>
                <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    onChange={handleChange}
                />
            </label>
            <label className="label">
                <p className="label-p">
                    Password
                </p>
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={handleChange}
                />
            </label>
            <label className="label">
                <p className="label-p">
                    Confirm password
                </p>
                <input
                    type="text"
                    name="confirm_password"
                    placeholder="Confirm password"
                    onChange={handleChange}
                />
            </label>
            <label className="label">
                <p className="label-p">
                    Date of birth
                </p>
                <input
                    type="date"
                    name="age"
                    onChange={handleChange}
                />
            </label>
            <button onClick={handleSubmit}>
                Submit
            </button>
            <ul className="message">
          {notvalid.length > 0 &&
            notvalid.map((error, index) => (
              <li style={{color:"red"}} key={index}>
                {(() => {
                  switch (error) {
                    case "name":
                      return message[0];
                    case "email":
                      return message[1];
                    case "password":
                      return message[2];
                    case "confirm_password":
                      return message[3];
                    case "age":
                      return message[4];
                    default:
                      return "";
                  }
                })()}
              </li>
            ))}
        </ul>
        </div>
    </div>)
}
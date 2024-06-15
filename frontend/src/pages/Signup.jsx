import { useEffect, useReducer, useState } from "react"
import "../styles/signup.css"
import Navbar from "../components/Navbar"
import validate from "../modules/validatesignup"
import { useNavigate } from "react-router-dom"
export default function Signup() {
    const navigate = useNavigate();
    const [message]=useState([
        "Username should only contain alphanumeric characters (a-z, 0-9).",
        "Email should be a valid format.",
        "Password must be at least 6 characters long and should not contain spaces.",
        "Passwords do not match.",
        "Date should be in YYYY-MM-DD format."
    ])
    const [loading,setLoading]=useState(false)
    const [notvalid,setNotValid]=useState([])
    const [status,setStatus]=useState()
    const [data,setData]=useState()
    const initalState={
        "name":"",
        "password":"",
        "confirm_password":"",
        "email":"",
        "age":""

        
    }
    const reducer = (state,action)=>{
        console.log(state)
        return({
            ...state,[action.name]:action.value
        })
    }
    const [state,dispatch]=useReducer(reducer, initalState)
    
    const handleChange = (e)=>{
        const {name,value}= e.target;
        dispatch({name:name,value:value})
        const newState = { ...state, [name]: value };
        setNotValid(validate(newState));
     
    }
    const handleSubmit = function () {
        // Validate the current state
        const validationErrors = validate(state);
      
        // Update the notvalid state with validation errors
        setNotValid(validationErrors);
      
        // Check if there are any validation errors
        if (validationErrors.length === 0) {
          setLoading(true);
          fetch("http://192.168.1.8:8000/registration", {
            method: 'POST',
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(state)
          })
          .then((response) => {
            setStatus(response.status);
            return response.json();
          })
          .then((data) => {
            setData(data);
            navigate("/email",{state:{email:state.email}})
          })
          .finally(() => {
            setLoading(false);
          });
        }
      };
      
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
                {loading?"loading...":"submit"}
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
        <p className="response">
                
                {
                    status!=200&&data?<span style={{color:"red"}}>{data.error}</span>:""
                }
        </p>
        </div>
    </div>)
}
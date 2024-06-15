import { useEffect, useState } from "react"
import logo from "../assets/image.png"
import "../styles/email.css"
import OtpInput from "react-otp-input"
import { useLocation } from "react-router-dom"
export default function Email() {
    const location = useLocation();
    const [state]=useState(location.state)
    const [loading,setLoading]=useState(true)
    const [status,setStatus]=useState(null)
    const [data,setData]=useState(null)
    const [enable,setEnable]=useState(false)
    function handleClick(){
    setLoading(true)
    setEnable(false)
    if(location.state.email){
        fetch("http://192.168.1.8:8000/registration/sendmail",
    {
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify(state)
    })
    .then((response)=>{setStatus(response.status); return response.json();})
    .then((data)=>{setData(data);setLoading(false);setTimeout(()=>{
        setEnable(true)
    },1200000)})
    }
    else{
        setLoading(false)
    }
    
    }
    useState(()=>{
            handleClick();
    },[])
   
    const [otp, set] = useState('')
    const setOtp = (code)=>{
        set(code)
    }
    useEffect(()=>{
        console.log(otp)
    },[otp])
    return (<div className="email">
        <div className="logo">
            <img
                src={logo}
            />
        </div>
        {loading?"loading...":<div className="block">
            <div className="form">
                <p className="heading">
                    Verify Email
                </p>
                <p className="para">
                    An email has been sent to your email address:<span style={{fontWeight:"bold"}}>{state.email}</span> for verification. Please check your inbox, and click the link provided to complete the verification process. If you don't see the email, please check your spam or junk folder.
                </p>
                
                    <OtpInput
                        className="inputs"
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => <input {...props} />}
                        inputStyle={{
                            fontSize:"16px",
                            border: "1px solid transparent",
                            borderRadius: "8px",
                            width: "54px",
                            height: "54px",
                            fontSize: "12px",
                            color: "#000",
                            fontWeight: "400",
                            margin:"10px",
                            caretColor: "blue",
                            backgroundColor:"rgb(237, 234, 234)"
                          }}
                    />
                    <button disabled={enable} onClick={handleClick} className="resend-btn">
                        Resend mail
                    </button>
                        <span>
                            {}
                        </span>
            </div>
        </div>}
    </div>)
}
import { useEffect, useState } from "react";
import logo from "../assets/image.png";
import "../styles/email.css";
import OtpInput from "react-otp-input";
import { useLocation } from "react-router-dom";

export default function Email() {
    const location = useLocation();
    const [state] = useState(location.state);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [data, setData] = useState(null);
    const [response, setResponse] = useState(null);
    const [minutes, setMinutes] = useState();
    const [seconds, setSeconds] = useState();
    const [timeup, setTimeup] = useState(false);
    const [futurecheckpoint, setFutureCheckpoint] = useState(null);

    function handleClick() {
        setLoading(true);
        setTimeup(false);
        if (location.state.email) {
            fetch("http://192.168.1.8:8000/registration/sendmail",
                {
                    method: "POST",
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
                    setLoading(false);
                    setFutureCheckpoint(new Date().getTime() + 120000);
                });
        } else {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleClick();
    }, []);

    const [otp, setOtp] = useState('');

    useEffect(() => {
        console.log(otp);
    }, [otp]);

    useEffect(() => {
        if (futurecheckpoint) {
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const distance = futurecheckpoint - now;
                if (distance < 0) {
                    clearInterval(interval);
                    setTimeup(true);
                    setMinutes(0);
                    setSeconds(0);
                } else {
                    setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
                    setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [futurecheckpoint]);

    return (
        <div className="email">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="block">
                <div className="form">
                    <p className="heading">Verify Email</p>
                    <p className="para">
                        An email has been sent to your email address: <span style={{ fontWeight: "bold" }}>{state.email}</span> for verification. Please check your inbox, and click the link provided to complete the verification process. If you don't see the email, please check your spam or junk folder.
                    </p>
                    <OtpInput
                        className="inputs"
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        inputMode="numeric"
                        renderInput={(props) => <input {...props} />}
                        inputStyle={{
                            fontSize: "16px",
                            border: "1px solid transparent",
                            borderRadius: "8px",
                            height: "54px",
                            color: "#000",
                            fontWeight: "400",
                            margin: "10px",
                            caretColor: "blue",
                            backgroundColor: "rgb(237, 234, 234)"
                        }}
                    />
                   
                        <button
                            disabled={!timeup}
                            style={{ color: !timeup ? "grey" : "blue" }}
                            onClick={handleClick}
                            className="resend-btn"
                        >
                            resend
                        </button>
                
                    <p className="para" style={{ color: "green" }}>
                        timer: {minutes !== undefined && seconds !== undefined ? `${minutes}:${seconds}` : "00:00"}
                    </p>
                    <button onClick={handleClick} className="submit-btn">
                        submit
                    </button>
                </div>
            </div>
        </div>
    );
}

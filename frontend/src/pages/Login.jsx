import { useEffect, useReducer, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
export default function Login(){
    const navigate = useNavigate();
    const [valid,setValid]=useState(null)
    const [status,setStatus]=useState(null)
    const [response,setResponse]=useState(null)
    const intialData = {
        user:"",
        password:""
     }
     const reducer = (state,action)=>{
        return({
            ...state,[action.name]:action.value
        })
     }

     const handleChange = (event)=>{
        const {name,value}= event.target;
        dispatch({name:name,value:value})
        setStatus(null)
        setResponse(null)
        if(!data.user){
            setValid("please enter user")
        }
        else{
            setValid(null)
        }
        if(!data.password){
            setValid("please enter password")
        }
        else{
            setValid(null)
        }
     }

     const [data,dispatch]=useReducer(reducer,intialData)
    useEffect(()=>{
        document.title="login"
    },[])
    useEffect(()=>{
        console.log(data)
    },[data])
   function fetchData(){
        if(!data.user){
            setValid("please enter user info")
            return
        }
        if(!data.password){
            setValid("please enter password info")
            return
        }
        if(data.password.length>0&&data.user.length>0){
            fetch("http://localhost:8000/auth",{
                method:"POST",
                headers:{
                    'Content-type':"application/json"
                },
                body:JSON.stringify(data)
            })
            .then((response)=>{setStatus(response.status);return response.json()})
            .then((data)=>{
                if(status===200){
                    setResponse(data.message)
                    localStorage.setItem("session_id",data.session_id)
                    setTimeout(()=>{
                        navigate("/home")
                    },1000)
                }
                else{
                    setResponse(data.error)
                }

            })
        }
    }
    return (<div className="signup">
    <Navbar />
    <div className="signup-form">
        <p className="form-heading">
            Login <span style={{color:"blue"}}>account</span>
        </p>
        <label className="label">
            <p className="label-p">
                Username
            </p>
            <input
                onChange={handleChange}
                type="text"
                placeholder="Username or email"
                name="user"
                
               
            />
        </label>
       
        <label className="label">
            <p className="label-p">
                Password
            </p>
            <input
            onChange={handleChange}
                type="password"
                name="password"
                placeholder="password"
               
            />
        </label>
      
        <button onClick={fetchData} className="submit-btn" >
            {"login"}
        </button>
        <div style={{width:"100%",textAlign:"center",color:"red"}}>
            {valid?valid:""}
        </div>
        <div style={{width:"100%",textAlign:"center",color:status==200?"green":"red"}}>
            {response&&status?response:""}
        </div>
   
    </div>
</div>)
}
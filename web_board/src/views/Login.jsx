import axios from "axios";
import React from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;

function LoginPage(){
    const navigate = useNavigate();
    const [loginData, setLoginData] = React.useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() =>{
        const auth = sessionStorage.getItem('auth')
        // const parseAuth = JSON.parse(auth)
        if(auth){
            navigate('/route/dashboard')
        }
    },[])

    async function onSubmit(e){
        e.preventDefault();
        try{
            const res = await axios.post(API_URL+'/auth/login',{
                email: loginData.email,
                password: loginData.password
            })

            if(res.status === 200){
                // console.log(res.data.data.user)
                setLoading(true)
                sessionStorage.setItem("auth", JSON.stringify(res.data.data.user))
            }
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
            navigate('/route/dashboard')
        }
    }

    return(
        <>
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <h2>Login</h2>
                    <p>Please login to access our services</p>
                    <form className="login-form" onSubmit={onSubmit}>
                        <div className="form-group">
                            <input 
                            type="email" 
                            className='form-control' 
                            placeholder="Enter your email" 
                            required 
                            value={loginData?.email}
                            onChange={(val) => setLoginData({...loginData, email: val.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input 
                            type="password" 
                            className='form-control' 
                            placeholder="Enter your password" 
                            required 
                            value={loginData?.password}
                            onChange={(val) => setLoginData({...loginData, password: val.target.value})}
                            />
                        </div>
                        {loading ? 
                        <button type="button" disabled>
                            <div class="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </button>
                        :
                        <button type="submit">
                            Login
                        </button>
                        }
                        
                    </form>
                </div>
                <div className="circle circle1"></div>
                <div className="circle circle2"></div>
                <div className="circle circle3"></div>
                <div className="circle circle4"></div>
            </div>
        </div>
        </>
    )
}
export default LoginPage
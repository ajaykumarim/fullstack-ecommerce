import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';


interface LoginProps {
    userName: string;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    setCurrentUser:React.Dispatch<React.SetStateAction<any>>;
    isAdmin:any;
    setIsAdmin:React.Dispatch<React.SetStateAction<any>>
  }
  
const Login: React.FC<LoginProps> = ({ userName, setUserName,setCurrentUser,isAdmin,setIsAdmin }) => {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const[emailVerification,setEmailVerification]=useState('*email should not be empty')
    const[userNameVerification,setUserNameVerification]=useState('*username should not be empty')
    const[passwordVerification,setPasswordVerification]=useState('*password should not be empty')
    const [login,setLogin]=useState(true)

    const emailFn=(e:any)=>{
        if(e.target.value==''){
        setEmailVerification("*email should not be empty")
        }else{
            setEmailVerification("")
        }
        setEmail(e.target.value)
    }
    const userNameFn=(e:any)=>{
        if(e.target.value==''){
            setUserNameVerification("*username should not be empty")
        }else{
            setUserNameVerification("")
        }
        setUserName(e.target.value)
    }
    const passwordFn=(e:any)=>{
        if(e.target.value==''){
            setPasswordVerification("*password should not be empty")
        }else{
            setPasswordVerification("")
        }
        setPassword(e.target.value)
    }

    const navigate=useNavigate()
    const loginFunction=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
           

        try {
            const response = await axios.post(
                'http://localhost:5000/api/shopping/login',
                {
                    email: email,
                    user: userName,
                    pass: password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
        
            const req = response.data;
            const userObj = req.usersData;
            console.log(userObj);

            if(userObj!=undefined&&!req.usersData.isAdmin){
                localStorage.setItem('isAdmin',JSON.stringify(req.usersData.isAdmin))
                sessionStorage.setItem('currentUser',req.usersData.user)
                navigate('/Home')
            }else{
                alert("Enter a valid username and password!")
            }
            setEmail('')
            setUserName('')
            setPassword('')
        } catch (error:any) {
            alert("Enter a valid email")
            setEmail('')
            setUserName('')
            setPassword('')
            console.error('Axios Error:', error.message);
            if (error.response) {
                
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                
                console.error('No response received. Request:', error.request);
            } else {
                
                console.error('Error during request setup:', error.message);
            }
        }
     
    }


    const adminLoginFunction=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
           

        try {
            const response = await axios.post(
                'http://localhost:5000/api/shopping/login',
                {
                    email: email,
                    user: userName,
                    pass: password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
        
            const req = response.data;
            const userObj = req.usersData;
            console.log(userObj);

            if(userObj!=undefined&&req.usersData.isAdmin){
                localStorage.setItem('isAdmin',JSON.stringify(req.usersData.isAdmin))
                sessionStorage.setItem('currentUser',req.usersData.user)
                navigate('/Home')
            }else{
                alert("Enter a valid username and password!")
            }
            setEmail('')
            setUserName('')
            setPassword('')
        } catch (error:any) {
            alert("Enter a valid email")
            setEmail('')
            setUserName('')
            setPassword('')
            console.error('Axios Error:', error.message);
            if (error.response) {
                
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                
                console.error('No response received. Request:', error.request);
            } else {
                
                console.error('Error during request setup:', error.message);
            }
        }
    }
    
  return (
    <div className="login-block">
        {login?<div className="login-div">
            <h1 className="login-title">Login:</h1>
        <form onSubmit={(e)=>loginFunction(e)}>
            <div>
                <label>Enter Email id:</label><br></br>
                <input className="input-bar" type="email" value={email} onChange={(e)=>emailFn(e)}/>
                <p className="verify-input">{emailVerification}</p>
            </div>
            <div>
                <label>Enter the username:</label><br></br>
                <input className="input-bar" value={userName} onChange={(e)=>userNameFn(e)}/>
                <p className="verify-input">{userNameVerification}</p>
            </div>
            <div>
                <label>Enter the password:</label><br></br>
                <input type="password" className="input-bar" value={password} onChange={(e)=>passwordFn(e)}/>
                <p className="verify-input">{passwordVerification}</p>
            </div>
            <button className="submit-btn" type="submit">Login</button>
           
        </form>
        <div className="login-bottom">
         <p id="admin-login" className="link" onClick={()=>setLogin(false)}>admin login</p>
        <p className="link"><Link to='/Register'>Register</Link></p>
        </div>
        </div>:
         <div className="login-div">
         <h1 className="login-title">Admin Login:</h1>
        <form onSubmit={(e)=>adminLoginFunction(e)}>
         <div>
             <label>Enter Email id:</label><br></br>
             <input className="input-bar" type="email" value={email} onChange={(e)=>emailFn(e)}/>
             <p className="verify-input">{emailVerification}</p>
         </div>
         <div>
             <label>Enter the username:</label><br></br>
             <input className="input-bar" value={userName} onChange={(e)=>userNameFn(e)}/>
             <p className="verify-input">{userNameVerification}</p>
         </div>
         <div>
             <label>Enter the password:</label><br></br>
             <input type="password" className="input-bar" value={password} onChange={(e)=>passwordFn(e)}/>
             <p className="verify-input">{passwordVerification}</p>
         </div>
         <button className="submit-btn" type="submit">Login</button>
        
     </form>
     <div className="login-bottom">
     <p className="link" id="admin-cancel" onClick={()=>setLogin(true)}>cancel</p>
     </div>
     </div>}         
    </div>
  )
}

export default Login




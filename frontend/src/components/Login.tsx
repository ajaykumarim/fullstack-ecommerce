import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
interface LoginProps {
    userName: string;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    setCurrentUser:React.Dispatch<React.SetStateAction<any>>
  }
  
const Login: React.FC<LoginProps> = ({ userName, setUserName,setCurrentUser }) => {
    
    const [password,setPassword]=useState('')
    const navigate=useNavigate()
    const loginFunction=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const response=await fetch('http://localhost:5000/api/shopping/username')
        const users=await response.json()
        const required=users.usersData
        const value=required.filter((a:any)=>(a.user==userName)&&(a.pass==password))
        setCurrentUser(userName)
        sessionStorage.setItem('currentUser',userName)
        
        if(value.length!=0){
            navigate('/Home')
        }else{
            alert("Enter a valid username and password!")
        }
        
        setUserName('')
        setPassword('')
    }
  return (
    <div className="login-block">
        <div className="login-div">
            <h1 className="login-title">Login:</h1>
        <form onSubmit={(e)=>loginFunction(e)}>
            <div>
                <label>Enter the username:</label><br></br>
                <input className="input-bar" value={userName} onChange={(e)=>setUserName(e.target.value)}/>
            </div>
            <div>
                <label>Enter the password:</label><br></br>
                <input className="input-bar" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <button className="submit-btn" type="submit">Login</button>
        </form>
        <p className="link"><Link to='/Register'>Register</Link></p>
        </div>
    </div>
  )
}

export default Login


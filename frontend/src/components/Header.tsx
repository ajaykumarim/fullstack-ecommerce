import { Link, useNavigate } from "react-router-dom";
import { FaOpencart } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";

interface HeaderProps {
    favouriteProfile:()=>void,
    count:number,
    currentUser:string,
    cuUser:any,
    isAdmin:any,
    setIsAdmin:React.Dispatch<React.SetStateAction<any>>
}
const Header: React.FC<HeaderProps> = ({favouriteProfile,count,currentUser,cuUser,isAdmin,setIsAdmin}) => {
        const val:any=localStorage.getItem("isAdmin")
        setIsAdmin(JSON.parse(val))
    
    const navigate=useNavigate()
    const panelFunction=()=>{
        navigate('/AdminPanel')
    }
  return (
    <div className="header">
        <img src='https://i1.lmsin.net/website_images/in/logos/logo-lifestyle.svg'/>
        <div className="header-right">
            {isAdmin?<h3 onClick={panelFunction} className="admin-btn">Admin Panel</h3>:null}
            
        {!isAdmin?<><FaOpencart className="cart-logo" onClick={favouriteProfile}/><span className="cart-count">{count}</span></>:null}
        
        <Link to='/'><CiLogout className="logout-logo"/></Link>
        </div>      
    </div>
  )
}

export default Header

























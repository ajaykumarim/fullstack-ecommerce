import { Link, useNavigate } from "react-router-dom";
import { FaOpencart } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
interface HeaderProps {
    favouriteProfile:()=>void,
    count:number,
    currentUser:string,
    cuUser:any,
}
const Header: React.FC<HeaderProps> = ({favouriteProfile,count,currentUser,cuUser}) => {
    const navigate=useNavigate()
    const panelFunction=()=>{
        navigate('/AdminPanel')
    }
  return (
    <div className="header">
        <img src='https://i1.lmsin.net/website_images/in/logos/logo-lifestyle.svg'/>
        <div className="header-right">
            {cuUser=='ajay'?<h3 onClick={panelFunction} className="admin-btn">Admin Panel</h3>:null}
            
        <FaOpencart className="cart-logo" onClick={favouriteProfile}/><span className="cart-count">{count}</span>
        
        <Link to='/'><CiLogout className="logout-logo"/></Link>
        </div>      
    </div>
  )
}

export default Header














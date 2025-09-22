import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
    GoSignOut, 
    GoGraph, 
    GoDiamond,
    GoCommentDiscussion,
    GoPeople,
    GoBrowser
} from "react-icons/go";
import axios from "axios";

const routePath = [
    {
        path: "/route/dashboard",
        name: "Dashboard",
        icon: <GoGraph />
    },
    {
        path: "/route/website-setting",
        name: "Website Setting",
        icon: <GoBrowser />
    },
    {
        path: "/route/webboards",
        name: "Web board",
        icon: <GoDiamond />
    },
    {
        path: "/route/comments",
        name: "Comments",
        icon: <GoCommentDiscussion />
    },
    {
        path: "/route/users",
        name: "Users Management",
        icon: <GoPeople />
    },
];

const API_URL = import.meta.env.VITE_API_URL;

function Routers(){
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [adminData, setAdminData] = React.useState(null)
    const { pathname } = useLocation();
    const navigate = useNavigate()
    // console.log(pathname)

    React.useEffect(() =>{
        const auth = sessionStorage.getItem('auth')
        const parseAuth = JSON.parse(auth)
        if(!auth){
            navigate('/')
        }
        setAdminData(parseAuth)
        console.log(parseAuth)
    },[])

    async function logout(){
        try{
            const res = await axios.get(API_URL+"/auth/logout")

            if(res.status === 200){
                sessionStorage.removeItem('auth')
                navigate('/')
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <>
        <div className={`layout ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo">W & C System</div>
                <nav>
                    <ul>
                        {routePath.slice(0, adminData?.user_metadata?.role === "admin" ? 4 : 5).map((item, index) => (
                            <li 
                            key={index}
                            className={pathname === item.path ? "active" : ""}
                            onClick={() => navigate(item.path)}
                            >
                                {item.icon && React.cloneElement(item.icon, { className: "mr-10" })}
                                <span>{item.name}</span>
                            </li>
                        ))}
                        {/* <li 
                        className={pathname === "/route/dashboard" ? "active" : ""}
                        onClick={() => navigate('/route/dashboard')}
                        >
                            <GoGraph className="mr-10"/>
                            <span>Dashboard</span>
                        </li>
                        <li 
                        className={pathname === "/route/webboards" ? "active" : ""}
                        onClick={() => navigate('/route/webboards')}
                        >
                            <GoDiamond className="mr-10"/>
                            <span>Web board</span>
                        </li>
                        <li 
                        className={pathname === "/route/comments" ? "active" : ""}
                        onClick={() => navigate('/route/comments')}
                        >
                            <GoCommentDiscussion className="mr-10"/>
                            <span>Comments</span>
                        </li> */}
                    </ul>
                </nav>
            </aside>
            {/* Main Content */}
            <div className="main">
                {/* Navbar */}
                <header className="navbar">
                    <div className="left-section">
                        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            ☰
                        </button>
                        <h3>Admin Panel</h3>
                    </div>
                    <div className="right-section">
                        <span>{adminData?.user_metadata?.display_name}</span>
                        <button className="logout-btn" onClick={() => logout()}>
                            <GoSignOut/>
                        </button>
                    </div>
                </header>

                <main>
                    <Outlet />
                </main>
            </div>
        </div>
        
        </>
    )
}
export default Routers
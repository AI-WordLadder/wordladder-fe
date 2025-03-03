import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, LogOut, LogIn, Menu, X } from "lucide-react";
import NotificationCard from "./NotificationCard";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [loginState, setLoginState] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [ShowWATnav, setShowWATnav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  let current_id = sessionStorage.getItem("currentUser_id");
  const watid = sessionStorage.getItem("wat_id");
  const role = sessionStorage.getItem("role");

  const notificationRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setShowNotifications(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Existing functions remain the same...
  const fetchNotifications = async () => {
    try {
      if (role === "wat") {
        current_id = watid;
      }
      const response = await axios.get(`${backendUrl}/notification/owner/${current_id}`);
      setNotifications(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (notificationId) => {
    try {
      const response = await axios.delete(`${backendUrl}/notification/${notificationId}`);
      if (response.data.length >= 1) {
        setNotifications(notifications.filter((notification) => notification.id !== notificationId));
      }
    } catch (err) {
      console.error(err.response.data.message);
    }
    fetchNotifications();
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handlebutton = () => {
    if (loginState) {
      sessionStorage.clear();
      setLoginState(false);
      setShowWATnav(false);
      window.location.href = "/";
    } else {
      window.location.href = "/login";
    }
  };

  const formatDateToThai = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    const role = sessionStorage.getItem("role");

    if (token) {
      setLoginState(true);
      if (role === "wat") {
        setShowWATnav(true);
      }
    } else {
      setLoginState(false);
      setShowWATnav(false);
    }

    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [notifications]);

  return (
    <nav
      className={`fixed top-0 w-full p-4 px-10 flex justify-between items-center z-[9999] bg-[#312F32] ${isScrolled ? "shadow-lg" : ""}`}
    >
      <div className="flex items-center w-full">
        {/* Logo Section */}
        <div className="flex items-center font-['Old_Standard_TT'] transition-transform duration-300 hover:scale-105">
          <img
            src="../logo.png"
            alt="Logo"
            className="w-[45px] h-[45px] 
              sm:w-[50px] sm:h-[50px]     
              md:w-[60px] md:h-[60px]     
              lg:w-[65px] lg:h-[65px]     
              xl:w-[70px] xl:h-[70px]    
              2xl:w-[75px] 2xl:h-[75px]   
            "
          />
          <Link
            to="/"
            className="text-2xl ml-2       
              sm:text-3xl sm:ml-3         
              md:text-4xl md:ml-3         
              lg:text-5xl lg:ml-4         
              xl:text-6xl xl:ml-4         
              text-white hover:text-[#AD957B] 
              transition-colors duration-300 
              tracking-wide font-medium 
              whitespace-nowrap
            "
          >
            Meru-Online
          </Link>
        </div>

        {loginState && ShowWATnav && (
          <div className="hidden lg:flex items-center font-sans text-lg text-white ml-8">
            {[
              { key: "EditWat", text: "แก้ไขข้อมูลวัด" },
              { key: "Reservation", text: "รายการจอง" },
              { key: "MyWat", text: "วัดของฉัน" },
            ].map((item) => (
              <Link
                key={item.key}
                to={item.key === "MyWat" ? `/Watpage1/${watid}` : `/${item.key}`}
                className="ml-6 relative group"
              >
                <span className="hover:text-[#AD957B] transition-colors duration-300">{item.text}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#AD957B] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 ml-auto">
          {/* Notification Button */}
          {loginState && (
            <div className="relative" ref={notificationRef}>
              <button
                className="text-white p-2 rounded-full hover:bg-[#AD957B] transition-colors duration-300"
                onClick={toggleNotifications}
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className={`
                  absolute 
                  mt-2 
                  w-[400px] 
                  bg-[#1C1C1C] 
                  rounded-lg 
                  shadow-xl 
                  right-[-140px]       
                  z-[10000] 
                  overflow-hidden 
                
                  /* Mobile styles */
                  sm:fixed 
                  sm:top-[88px] 
                  sm:left-2        
                  sm:right-2       
                  sm:mx-0          
                  sm:w-[calc(100%-16px)]  
                
                
                  lg:fixed
                  lg:right-4
                  lg:left-auto
                  lg:w-[500px]      
                  xl:w-[600px]      
                  lg:top-[88px]
                `}
                >
                  <div className="flex text-[20px] sm:text-[16px] text-[#AD957B] bg-[#292725] p-4 font-bold">
                    การแจ้งเตือนของคุณ
                  </div>
                  <div className="bg-[#1C1C1C] flex flex-col-reverse max-h-[80vh] overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <div
                        key={notification._id}
                        className={`relative hover:bg-[#2A2A2A] transition-colors duration-200
                          ${index < notifications.length - 1 ? "border-b border-[#3A3A3A]" : ""}`}
                      >
                        <NotificationCard
                          description={notification.description}
                          title={notification.title}
                          date={formatDateToThai(notification.updatedAt)}
                          ondel={() => handleDelete(notification._id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Login/Logout Button */}
          <button
            onClick={handlebutton}
            className="flex items-center gap-2 h-[40px] px-[15px] bg-[#AD957B] text-white rounded-[25px] 
              font-['Old_Standard_TT'] hover:bg-[#b2a18f] transition-all duration-300 hover:shadow-lg
              transform hover:scale-105 sm:text-sm sm:px-[10px] sm:h-[35px]"
          >
            {loginState ? (
              <>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">เข้าสู่ระบบ</span>
              </>
            )}
          </button>

          {/* User Profile Section */}
          {loginState && (
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <p className="text-white font-bold hidden sm:block">{sessionStorage.getItem("currentUser_username")}</p>
              </div>
              {sessionStorage.getItem("role") !== "wat" && (
                <Link to="/Profile">
                  <button className="relative group p-1 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110">
                    <img
                      src={sessionStorage.getItem("currentUser_profileimg") || "/defaultprofile.jpg"}
                      alt="User"
                      className="w-[40px] h-[40px] sm:w-[35px] sm:h-[35px] rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-full" />
                  </button>
                </Link>
              )}
            </div>
          )}

          {/* Hamburger Menu Button - Only for WAT Users */}
          {loginState && ShowWATnav && (
            <button
              className="lg:hidden text-white p-2 hover:bg-[#AD957B] rounded-full transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu - Only for WAT Users */}
      {loginState && ShowWATnav && isMobileMenuOpen && (
        <div className="lg:hidden fixed top-[75px] right-0 w-full bg-[#312F32] shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            <div className="flex flex-col space-y-4 text-white">
              {[
                { key: "EditWat", text: "แก้ไขข้อมูลวัด" },
                { key: "Reservation", text: "รายการจอง" },
                { key: "MyWat", text: "วัดของฉัน" },
              ].map((item) => (
                <Link
                  key={item.key}
                  to={item.key === "MyWat" ? `/Watpage1/${watid}` : `/${item.key}`}
                  className="hover:text-[#AD957B] transition-colors duration-300 text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
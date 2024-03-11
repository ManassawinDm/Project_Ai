// Navbar.js
import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../component/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
function Navbar() {
  const navigate = useNavigate();
  const { userDetails, logout } = useContext(AuthContext);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); 
  const [nav, setNav] = useState(false);
  const sidebarRef = useRef(null);

  const handleNav = () => {
    setNav(!nav);
  };

  const handleMobile = (path) => {
    navigate(path);
    setNav(false); // Close sidebar on navigation
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setNav(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleToggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  // Admin Navigation
  const AdminNav = () => (
    <div  ref={sidebarRef} className="w-full bg-[#000300]">
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white ">
      <h1 className="text-3xl font-bold text-[#00df9a] shrink-0">
        <Link to="/home">Admin Dashboard</Link>
      </h1>
      <div className="md:flex items-center gap-3 flex-wrap justify-end w-full hidden text-base ">
        <>
          <button
            onClick={() => navigate("/admin/addbot")}
            className="hover:bg-gray-700 px-2 py-2 rounded whitespace-nowrap"
          >
            Add Bot
          </button>
          <button
            onClick={() => navigate("/admin/addCurrency")}
            className="hover:bg-gray-700 px-2 py-2 rounded whitespace-nowrap"
          >
            Add Currency
          </button>
          <button
            onClick={() => navigate("/admin/payment")}
            className="hover:bg-gray-700 px-2 py-2 rounded whitespace-nowrap"
          >
            Check Payment
          </button>
          <button
            onClick={() => navigate("/admin/verify")}
            className="hover:bg-gray-700 px-2 py-2 rounded whitespace-nowrap"
          >
            Verify
          </button>
         
        </>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <div onClick={handleNav} className="block md:hidden cursor-pointer">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
        className={`${
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "ease-in-out duration-500 fixed left-[-100%]"
        }`}
      >
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">
        Admin Dashboard
        </h1>
          <>
            <li
              className="p-4 border-b border-gray-600 cursor-pointer"
              onClick={() => handleMobile("/admin/addbot")}
            >
              Add Bot
            </li>
            <li
              className="p-4 border-b border-gray-600 cursor-pointer"
              onClick={() => handleMobile("/admin/commission")}
            >
              User Commission
            </li>
            <li
              className="p-4 border-b border-gray-600 cursor-pointer"
              onClick={() => handleMobile("/admin/payment")}
            >
              Check Payment
            </li>
          </>
          <li className="p-4 cursor-pointer text-red-600 hover:text-red-700 rounded py-5" onClick={handleLogout}>
            Logout
          </li>
        
      </ul>
    </div>
    </div>
  );

  // User Navigation
  const UserNav = () => (
    <div   ref={sidebarRef} className="w-full bg-[#000300]">
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      <h1 className="text-3xl font-bold text-[#00df9a] shrink-0">
        
          <Link to="/home">Trading Bot</Link>
      
      </h1>
      <div className="md:flex items-center gap-3 flex-wrap justify-end w-full hidden text-base ">
       
          <button
            onClick={() => navigate("/home")}
            className="hover:bg-gray-700 px-2 py-2 rounded whitespace-nowrap"
          >Bot
          </button>
      
        <button
          onClick={() => navigate("/Q&A")}
          className="hover:bg-gray-700 px-5 py-2 rounded whitespace-nowrap"
        >
          Q&A
        </button>
       
          <>
            <button
              onClick={() => navigate("/profile")}
              className="hover:bg-gray-700 px-2 py-2 rounded whitespace-nowrap"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/history")}
              className="hover:bg-gray-700 px-2 py-2 rounded whitespace-nowrap"
            >
              History
            </button>
          </>
       
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-2 py-2 rounded whitespace-nowrap"
          >
            Logout
          </button>
    
      </div>
      <div onClick={handleNav} className="block md:hidden cursor-pointer">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
  className={`${
    nav
      ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 z-50" // Added z-50 here
      : "ease-in-out duration-500 fixed left-[-100%] z-50" // And here as well
  }`}
>
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">
          Trading Bot
        </h1>
        
          <li
            className="p-4 border-b border-gray-600 cursor-pointer"
            onClick={() => navigate("/home")}
          >Bot
          </li>
       
        <li
          className="p-4 border-b border-gray-600 cursor-pointer"
          onClick={() => navigate("/Q&A")}
        >
          Q&A
        </li>
       
          <>
            <li
              className="p-4 border-b border-gray-600 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              Profile
            </li>
            <li
              className="p-4 border-b border-gray-600 cursor-pointer"
              onClick={() => navigate("/history")}
            >
              History
            </li>

          </>
    
       
          <button className="p-4 cursor-pointer text-red-600 hover:text-red-700 rounded py-5" onClick={handleLogout}>
            Logout
          </button>
         
        
      </ul>
    </div>
    </div>
  );


  const DefaultNav = () => (
    <div   ref={sidebarRef} className="w-full bg-[#000300]">
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      <h1 className="text-3xl font-bold text-[#00df9a] shrink-0">
       
          <Link to="/">Trading Bot</Link>
      
      </h1>
      <div className="md:flex items-center gap-3 flex-wrap justify-end w-full hidden text-base ">
       
        <button
          onClick={() => navigate("/qa")}
          className="hover:bg-gray-700 px-5 py-2 rounded whitespace-nowrap"
        >
          Q&A
        </button>
     
      
          <button
            onClick={() => navigate("/login")}
            className="bg-[#00df9a] hover:bg-[#44967c] px-2 py-2 rounded whitespace-nowrap"
          >
            Login
          </button>
      
      </div>
      <div onClick={handleNav} className="block md:hidden cursor-pointer">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
   className={`${
    nav
      ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 z-50" // Added z-50 here
      : "ease-in-out duration-500 fixed left-[-100%] z-50" // And here as well
  }`}
>
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">
          Trading Bot
        </h1>
        
        <li
          className="p-4 border-b border-gray-600 cursor-pointer"
          onClick={() => navigate("/qa")}
        >
          Q&A
        </li>
       
      
          <button className="p-4 cursor-pointer text-[#00df9a] hover:text-[#44967c] rounded py-5" onClick={() => navigate("/login")}>
            Login
          </button>
    
      </ul>
    </div>
    </div>
  );

  // Render based on user role
  if (userDetails) {
    return userDetails.role === 'admin' ? <AdminNav /> : <UserNav />;
  } else {
    return <DefaultNav />;
  }
}

export default Navbar;

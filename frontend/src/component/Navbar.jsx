import React, { useContext,useEffect,useState } from 'react';
import { AuthContext } from '../component/authContext';
import { Link, useNavigate } from 'react-router-dom'; 

function Navbar() {
  const navigate = useNavigate();
  const { authToken, logout, username,userole } = useContext(AuthContext);
  const handleNavigate = (path) => () => {
    navigate(path);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const hideDropdown = () => {
    if (isDropdownVisible) {
      setDropdownVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', hideDropdown);
    return () => {
      document.removeEventListener('click', hideDropdown);
    };
  }, [isDropdownVisible]); 

  if (authToken && userole === 'admin') {
    return (
      <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <div className="font-bold text-xl">
          <Link to="/home">Admin Dashboard</Link>
        </div>
        <div className="flex items-center gap-4">
        <div className="relative">
            <button onClick={(e) => {toggleDropdown(); e.stopPropagation();}} className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded">
              Menu
            </button>
            {isDropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                <Link to="/admin/addbot" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add Bot</Link>
                <Link to="/admin/commission" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">User Commission</Link>
                <Link to="/admin/payment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Check Payment</Link>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded">
            Logout
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="font-bold text-xl">
        {authToken ? (
            <Link to="/home">Trading Bot</Link>
          ) : (
            <Link to="/">Trading Bot</Link>
          )}
      </div>
      <div className="flex items-center gap-4">
        {authToken && (
          <button onClick={() => navigate('/downloads')} className="hover:bg-gray-700 px-3 py-2 rounded">
            Downloads Bot
          </button>
        )}
        <button onClick={() => navigate('/qa')} className="hover:bg-gray-700 px-3 py-2 rounded">
          Q&A
        </button>
        {authToken && (
          <div className="relative">
            <span className="px-3 py-2 cursor-pointer" onClick={(e) => {toggleDropdown(); e.stopPropagation();}} >
              Welcome: {username}
            </span>
            {isDropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                <Link to="/history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">History</Link>
              </div>
            )}
          </div>
        )}
        {authToken ? (
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded">
            Logout
          </button>
        ) : (
          <button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
